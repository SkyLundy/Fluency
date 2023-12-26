<?php

declare(strict_types=1);

namespace Fluency\Engines\DeepL;

use \InvalidArgumentException;
use Fluency\App\{ FluencyErrors, FluencyLocalization };
use Fluency\DataTransferObjects\{
  EngineApiUsageData,
  EngineLanguageData,
  EngineTranslatableLanguagesData,
  EngineTranslationData,
  FluencyConfigData,
  TranslationRequestData
};
use Fluency\Engines\FluencyEngine;
use Fluency\Engines\Traits\{ LocalizesPageUrls, LogsEngineData };
use stdClass;

/**
 * Handles all API interaction with the DeepL API
 */
final class DeepLEngine implements FluencyEngine {

  use LocalizesPageUrls;

  use LogsEngineData;

  private const IGNORED_TAG_NAME = 'fluency-ignore';

  private ?string $apiUrl;

  private ?string $apiKey;

  private bool|string|null $preserveFormatting;

  private ?string $globalIgnoredStrings;

  private ?string $formality;

  /**
   * {@inheritdoc}
   */
  public function __construct(private FluencyConfigData $fluencyConfig) {
    // Destructure config, get engine values
    [
      'deepl_account_type' => $accountType,
      'deepl_api_key' => $this->apiKey,
      'deepl_formality' => $this->formality,
      'deepl_global_ignored_strings' => $this->globalIgnoredStrings,
      'deepl_preserve_formatting' => $this->preserveFormatting,
    ] = $fluencyConfig->toArray()['engine'];

    $this->apiUrl = match ($accountType) {
      'pro' => 'https://api.deepl.com/v2',
      default => 'https://api-free.deepl.com/v2',
    };
  }

  /**
   * Public interfaces
   */

  /**
   * {@inheritdoc}
   */
  public function translate(TranslationRequestData $translationRequest): EngineTranslationData {
    $sourceLanguageCode = strtoupper($translationRequest->sourceLanguage);
    $targetLanguageCode = strtoupper($translationRequest->targetLanguage);

    $content = $this->addIgnoredTags(
      $translationRequest->content,
      $translationRequest->options['ignoredStrings'] ?? []
    );

    $requestBody = array_merge([
     'source_lang' => $sourceLanguageCode,
     'target_lang' => $targetLanguageCode,
     'tag_handling' => 'html',
     'ignore_tags' =>  self::IGNORED_TAG_NAME,
     'formality' => $this->formality,
     'text' => $content
    ], $translationRequest->options['requestParameters'] ?? []);

    $result = $this->apiRequest('/translate', 'POST', $requestBody);

    if ($result->error) {
      return EngineTranslationData::fromArray([
        'request' => $translationRequest,
        'error' => $result->error
      ]);
    }

    $translations = array_map(
      fn($translation) => html_entity_decode($translation->text),
      $result->data->translations
    );

    $translations = $this->removeIgnoredTags($translations);

    $translations = $this->localizePageUrlsInTranslations($translations, $targetLanguageCode);

    // Create new object that merges new data with request data
    return EngineTranslationData::fromArray([
      'request' => $translationRequest,
      'translations' => $translations,
    ]);
  }

  /**
   * {@inheritdoc}
   */
  public function getLanguages(): EngineTranslatableLanguagesData {
    // DeepL requires 2 API calls to get this information. This will only succeed if both succeed
    // since one set of data is useless without the other

    $sourceResult = $this->apiRequest('/languages', 'GET', ['type' => 'source']);

    if ($sourceResult->error) {
      return EngineTranslatableLanguagesData::fromArray(['error' => $sourceResult->error]);
    }

    $targetResult = $this->apiRequest('/languages', 'GET', ['type' => 'target']);

    if ($targetResult->error) {
      return EngineTranslatableLanguagesData::fromArray(['error' => $targetResult->error]);
    }

    // Get a source language ISO code using the target language ISO code
    // DeepL provides some target languages that do not have direct equivalents in source languages
    // By removing secondary language codes a match can be found
    $getSource = function(string $targetCode) use ($sourceResult, &$getSource): ?object {
      $sourceLanguage = array_reduce(
        $sourceResult->data,
        fn($match, $language) => $match = $language->language === $targetCode ? $language : $match
      );

      // If a source language was found, or if a source language wasn't and the target code was
      // the base 2 character code, return the language or null
      if ($sourceLanguage || !$sourceLanguage && strlen($targetCode) === 2) {
        return $sourceLanguage;
      }

      return $getSource(explode('-', $targetCode)[0]);
    };

    // Creates an array of EngineLanguageData objects where a source/target can be identified
    // If source cannot be identified from a target language, skips
    $languages = array_map(function($targetLanguage) use ($getSource) {
      $targetCode = $targetLanguage->language;
      $sourceLanguage = $getSource($targetCode);

      if (!$sourceLanguage) {
        return null;
      }

      return EngineLanguageData::fromArray([
        'sourceName' => $sourceLanguage->name,
        'sourceCode' => $sourceLanguage->language,
        'targetName' => $targetLanguage->name,
        'targetCode' => $targetCode,
        'meta' => [
          'supports_formality' => $targetLanguage->supports_formality ?? false
        ]
      ]);
    }, $targetResult->data);

    return EngineTranslatableLanguagesData::fromArray([
      'languages' => array_filter($languages),
    ]);
  }

  /**
   * {@inheritdoc}
   */
  public function getApiUsage(): EngineApiUsageData {
    $response = $this->apiRequest('/usage');

    $returnData = [
      'error' => $response->error,
      'unit' => FluencyLocalization::getFor('usage')->unitTypeCharacter
    ];

    if ($response->error) {
      return EngineApiUsageData::fromArray($returnData);
    }

    return EngineApiUsageData::fromArray([
      'used' => $response->data->character_count,
      'limit' => $response->data->character_limit,
      ...$returnData
    ]);
  }

  /**
   * Private methods
   */

  /**
   * Makes call to DeepL API
   *
   * @param  string $endpoint Endpoint starting with a slash
   * @param  string $method   HTTP method to use, default GET
   * @param  array  $data     k/v array with data for API call, optional
   * @return object
   */
  private function apiRequest(
    string $endpoint,
    string $method = 'GET',
    array $data = []
  ): stdClass {
    $requestUrl = "{$this->apiUrl}{$endpoint}?auth_key={$this->apiKey}";

    // WireHttp/http_build_query were not used as DeepL uses multipe 'data' keys queries for
    // multi-string requests which neither support. See DeepLEngine::createParamString()
    $requestConfig = [
      CURLOPT_CONNECTTIMEOUT => 5,
      CURLOPT_IPRESOLVE => CURL_IPRESOLVE_V4,
      CURLOPT_RETURNTRANSFER => true,
      CURLOPT_USERAGENT => 'Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1; SV1; .NET CLR 1.0.3705; .NET CLR 1.1.4322)'
    ];

    // Additional request configurations depending on HTTP method
    switch ($method) {
      case 'POST':
        $requestConfig[CURLOPT_POST] = true;
        $requestConfig[CURLOPT_HTTPHEADER] = ['Content-Type:application/json'];
        $requestConfig[CURLOPT_POSTFIELDS] = json_encode($data);
        $requestConfig[CURLOPT_URL] = $requestUrl;
        break;
      case 'GET':
        $payload = $this->createParamString($data);

        $requestConfig[CURLOPT_URL] = $payload ? "{$requestUrl}&{$payload}" : $requestUrl;
        break;
      default:
        throw new InvalidArgumentException("Method {$method} is invalid");
        break;
    }

    $ch = curl_init();

    curl_setopt_array($ch, $requestConfig);

    $response = curl_exec($ch);
    $response = is_string($response) ? json_decode($response) : null;

    ['http_code' => $status] = curl_getinfo($ch);

    curl_close($ch);

    $return = [
      'data' => [],
      'status' => $status,
      'error' => null
    ];

    // Handle fail
    if (!$response || $status < 200 || $status >= 300) {
      $return['error'] = match ($status) {
        403 => FluencyErrors::AUTHENTICATION_FAILED,
        400 => FluencyErrors::BAD_REQUEST,
        429 => FluencyErrors::RATE_LIMIT_EXCEEDED,
        456 => FluencyErrors::QUOTA_EXCEEDED,
        default => FluencyErrors::SERVICE_UNAVAILABLE,
      };

      $this->logError($return['error'], $response?->message, $response);
    }

    !$return['error'] && $return['data'] = $response;

    return (object) $return;
  }

  /**
   * Creats a parameter string that can be used for different types of requests.
   * This is necessary as some requests require the use of the same parameter key more than once
   * which does not work with in-built methods or ProcessWire utilities
   * Accepts parameters with array values to recursively create parameters using the same key
   */
  private function createParamString(array $data): string {
    $keys = array_keys($data);

    $allParams = array_reduce($keys, function($params, $key) use ($data) {
      // Convert all values to array for array_map
      $value = is_array($data[$key]) ? $data[$key] : [$data[$key]];

      return $params = array_merge(
        $params,
        array_map(fn($arrValue) => "{$key}=" . urlencode($arrValue), $value)
      );
    }, []);

    return implode('&', $allParams);
  }

  /**
   * Adds the tag that prevents DeepL from translating specified words/phrases.
   *
   * @param array        $texts          Array of content to add ignored tags to
   * @param array|string $ignoredStrings Strings to ignore
   */
  private function addIgnoredTags(array $texts, array|string $ignoredStrings = []): array {
    is_string($ignoredStrings) && $ignoredStrings = explode(',', $ignoredStrings);

    $ignoredStrings = array_map('trim', [
      ...explode('||', $this->globalIgnoredStrings),
      ...$ignoredStrings
    ]);

    return array_map(function($value) use ($ignoredStrings) {
      return array_reduce($ignoredStrings, function($text, $ignored) {
        preg_match_all('/' . preg_quote($ignored) . '/', $text, $matches);

        if (count($matches[0])) {
          return $text = str_replace($ignored, "<span translate=\"no\">{$ignored}</span>", $text);
        }

        return $text;
      }, $value);
    }, $texts);
  }

  /**
   * Removes the ignored tags from array of translated texts
   *
   * @param  array $texts
   * @return array
   */
  private function removeIgnoredTags(array $texts): array {
    return array_map(fn($text) => preg_replace('/<\/?span( translate="no")?>/', '', $text), $texts);
  }
}
