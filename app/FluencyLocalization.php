<?php

declare(strict_types=1);

namespace Fluency\App;

use Fluency\App\FluencyErrors;

use function ProcessWire\{ __, wire };

final class FluencyLocalization {

  /**
   * Gets all translation strings for all contexts
   *
   * @return object
   */
  public static function getAll(): object {
    $defaultLanguageTitle = wire()->languages->getDefault()->title;

    $values = json_encode([
      'inputfieldTranslateButtons' => [
        'translateButton' => sprintf(__('Translate from %s'), $defaultLanguageTitle),
        'translateToAllButton' => __('Translate to all languages'),
        'translate' => __('Translate'),
        'translationAvailable' => __('Translation Available'),
        'languageNotAvailable' => __('Translation is not available for this language'),
        'pageNameNotAvailable' => __('Page names cannot be translated to this language'),
        'translateToAllLanguages' => __('Translate to all languages'),
        'translateTo' => __('Translate to:'),
        'translateFrom' => __('Translate from:'),
        'translateForm' => [ // The multi-language translate button is a form
        ],
        'poweredBy' => 'Powered by Fluency',
        'showTranslator' => __('Show Translator'),
      ],
      'standaloneTranslator' => [
        'menuName' => __('Translator'),
        'title' => __('Fluency Translation'),
        'description' => __('Powered by'),
        'fieldLabelFrom' => __('Translate From:'),
        'fieldLabelTo' => __('Translate To:'),
        'fieldLabelOriginal' => __('Original'),
        'fieldLabelTranslated' => __('Translated'),
        'buttonLabelTranslate' => __('Translate'),
        'clickToCopy' => __('Copy Text'),
        'clickToClear' => __('Clear Text'),
        'copied' => __('Copied!'),
      ],
      'languageTranslator' => [
        'translateAllButton' => __('Click To Translate All'),
      ],
      'usage' => [
        'title' => __('Translation Service Usage Information'),
        'description' => __('Click Refresh to get usage information'),
        'limit' => __('Limit'),
        'used' => __('Used'),
        'remaining' => __('remaining'),
        'unit' => __('Unit'),
        'total' => __('Total Usage'),
        'buttonLabelRefresh' => __('Refresh'),
        'unitTypeCharacter' => __('Character'),
        'unitTypeWord' => __('Word'),
        'unitTypeSentence' => __('Sentence'),
        'noUsageProvided' => __('This translation service does not provide usage information')
      ],
      'languageSelect' => [
        'label' => __('Select Language')
      ],
      'activityOverlay' => [
        'translating' => [
          'static' => __('Translating'),
          'animated' => [
            '번역',
            'Oversættelse',
            'Translating',
            'Übersetzen',
            'Traduire',
            'Traduciendo',
            '翻訳する',
            'Traduzione',
            'Перевод',
          ]
        ],
        'updating' => [
          'static' => __('Updating'),
          'animated' => [
            '업데이트',
            'Opdatering',
            'Updating',
            'Aktualisierung',
            'Mise à jour',
            'Actualización',
            '更新',
            'Aggiornamento',
            'Обновление',
          ]
        ],
        'refreshing' => [
          'static' => __('Refreshing'),
          'animated' => [
            '데이터 새로 고침',
            'Opdatering af data',
            'Refreshing Data',
            'Daten auffrischen',
            'Actualisation des données',
            'Actualizar datos',
            'データのリフレッシュ',
            'Aggiornamento dei dati',
            'Обновление данных',
          ]
        ],
        'clearingCache' => [
          'static' => __('Clearing Cache'),
          'animated' => [
            '캐시 지우기',
            'Rydning af cache',
            'Clearing Cache',
            'Cache leeren',
            'Effacer le cache',
            'Borrar caché',
            'キャッシュの消去',
            'Cancellazione della cache',
            'Очистка кэша',
          ]
        ]
      ],
      'fieldConfiguration' => [
        'checkboxTitle' => __('Fluency Translation'),
        'checkboxLabel' => __('Disable translation for this field'),
      ],
      'errors' => [
        FluencyErrors::SERVICE_UNAVAILABLE => __('The translation service is not available, please try again later'),
        FluencyErrors::AUTHENTICATION_FAILED => __('Translation API authentication failed, check credentials'),
        FluencyErrors::AUTHORIZATION_FAILED => __('Translation API authorization failed, check that access is permitted'),
        FluencyErrors::RATE_LIMIT_EXCEEDED => __('Translation rate limit exceeded, please wait then try again'),
        FluencyErrors::BAD_REQUEST => __('The translation API request contains errors or is invalid.'),
        FluencyErrors::INTERNAL_SERVER_ERROR => __('The translation service is experiencing internal issues, please try again later'),
        FluencyErrors::NOT_FOUND => __('The the translation service resource requested was not found'),
        FluencyErrors::UNKNOWN_ERROR => __('An unknown error occurred while querying the translation service. Please try again later.'),
        FluencyErrors::FLUENCY_NOT_CONFIGURED => __('Translation is not ready, please configure the Fluency translation module'),
        FluencyErrors::FLUENCY_CLIENT_DISCONNECTED => __('Unable to connect. Please check your internet connection'),
        FluencyErrors::FLUENCY_BAD_REQUEST => __('Fluency API Error: Invalid Request'),
        FluencyErrors::FLUENCY_NOT_FOUND => __('Fluency API Error: Endpoint Does Not Exist'),
        FluencyErrors::FLUENCY_NOT_IMPLEMENTED => __('Fluency API Error: Feature Not Implemented'),
        FluencyErrors::FLUENCY_METHOD_NOT_ALLOWED => __('Fluency API Error: Method Not Allowed'),
        FluencyErrors::FLUENCY_UNKNOWN_SOURCE => __('The source language code was not recognized or is not available in the configured translation engine'),
        FluencyErrors::FLUENCY_UNKNOWN_TARGET => __('The target language code was not recognized or is not available in the configured translation engine'),
        FluencyErrors::FLUENCY_MODULE_ERROR => __('An module error occurred and Fluency could not process your request'),
      ]
    ]);

    return json_decode($values);
  }

  /**
   * Gets a set of translated strings
   *
   * @param  string $context  The key used to retrieve a set of translations
   * @return object           k/v translation associations
   */
  public static function getFor(string $context): object {
    return self::getAll()->$context;
  }

  /**
   * Gets multiple sets of translated strings
   *
   * @param  ...array<string> $contexts Names of contexts needed
   * @return array<object>
   */
  public static function getForMultiple(...$contexts): object {
    return (object) array_reduce($contexts, function($selected, $context) {
      $selected[$context] = self::getFor($context);

      return $selected;
    }, []);
  }

  /**
   * Gets a specific string from a specific context
   */
  public static function get(string $context, string $key): string {
    return self::getFor($context)->$key;
  }
}
