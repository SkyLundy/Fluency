<?php

declare(strict_types=1);

namespace Fluency\Engines\GoogleCloudTranslation;

use \InvalidArgumentException;
use Fluency\App\FluencyErrors;
use Fluency\DataTransferObjects\{
  EngineApiUsageData,
  EngineLanguageData,
  EngineTranslatableLanguagesData,
  EngineTranslationData,
  FluencyConfigData,
  TranslationRequestData,
};
use Fluency\Engines\FluencyEngine;
use Fluency\Engines\Traits\LogsEngineData;

final class GoogleCloudTranslationEngine implements FluencyEngine {

  use LogsEngineData;

  private const API_URL = 'https://translation.googleapis.com/language/translate/v2';

  private ?string $apiKey;

  /**
   * {@inheritdoc}
   */
  public function __construct(private FluencyConfigData $fluencyConfig) {
    $this->apiKey = $fluencyConfig->engine->gcp_api_key;
  }

  /**
   * {@inheritdoc}
   */
  public function translate(TranslationRequestData $translationRequest): EngineTranslationData {
    $result = $this->apiRequest('/', 'POST', [
      'q' => $translationRequest->content,
      'source' => $translationRequest->sourceLanguage,
      'target' => $translationRequest->targetLanguage,
    ]);

    if ($result->error) {
      return EngineTranslationData::fromArray([
        'request' => $translationRequest,
        'error' => $result->error
      ]);
    }

    return EngineTranslationData::fromArray([
      'request' => $translationRequest,
      'translations' => array_map(
        fn($translation) => $translation->translatedText,
        $result->data->translations
      )
    ]);
  }

  /**
   * {@inheritdoc}
   */
  public function getLanguages(): EngineTranslatableLanguagesData {
    $result = $this->apiRequest('/languages', 'GET', ['target' => 'en']);

    if ($result->error) {
      return EngineTranslatableLanguagesData::fromArray(['error' => $result->error]);
    }

    $languages = array_map(fn($language) => EngineLanguageData::fromArray([
        'sourceName' => $language->name,
        'sourceCode' => $language->language,
        'targetName' => $language->name,
        'targetCode' => $language->language,
      ]),
      $result->data->languages
    );

    return EngineTranslatableLanguagesData::fromArray(['languages' => $languages]);
  }

  /**
   * {@inheritdoc}
   */
  public function getApiUsage(): EngineApiUsageData {
    return EngineApiUsageData::fromArray(['error' => FluencyErrors::FLUENCY_NOT_IMPLEMENTED]);
  }

  /**
   * Internal Methods
   */

  /**
   * Makes call to GoogleCloudTranslation API
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
  ): object {
    $requestUrl = self::API_URL . "{$endpoint}?key={$this->apiKey}";

    $requestConfig = [
      CURLOPT_IPRESOLVE => CURL_IPRESOLVE_V4,
      CURLOPT_RETURNTRANSFER => true,
      CURLOPT_USERAGENT => 'Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1; SV1; .NET CLR 1.0.3705; .NET CLR 1.1.4322)'
    ];

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

    if (!$response || property_exists($response, 'error')) {
      $return['error'] = match ($response?->error->status) {
        'NOT_FOUND' => FluencyErrors::NOT_FOUND,
        'UNAUTHENTICATED' => FluencyErrors::AUTHENTICATION_FAILED,
        'PERMISSION_DENIED' => FluencyErrors::AUTHORIZATION_FAILED,
        'INVALID_ARGUMENT' => FluencyErrors::BAD_REQUEST,
        'RESOURCE_EXHAUSTED' => FluencyErrors::QUOTA_EXCEEDED,
        'INTERNAL' => FluencyErrors::INTERNAL_SERVER_ERROR,
        'UNAVAILABLE' => FluencyErrors::SERVICE_UNAVAILABLE,
        default => FluencyErrors::SERVICE_UNAVAILABLE,
      };

      $this->logError($return['error'], $response?->error?->message, $response);
    }

    !$return['error'] && property_exists($response, 'data') && $return['data'] = $response->data;

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

    $allParams = array_reduce($keys, fn($params, $key) => $params = array_merge(
      $params,
      array_map(fn($arrValue) => "{$key}=" . urlencode($arrValue), (array) $data[$key])
    ), []);

    return implode('&', $allParams);
  }
}
