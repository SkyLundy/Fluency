<?php

declare(strict_types=1);

namespace Fluency\Components;

use Fluency\App\{ FluencyErrors, FluencyLocalization, FluencyMarkup };
use Fluency\Components\Traits\GeneratesFieldsetsTrait;
use ProcessWire\{ FluencyConfig, Inputfield, InputfieldWrapper };

use function \ProcessWire\wire;

class FluencyStandaloneTranslatorFieldset {

  use GeneratesFieldsetsTrait;

  public static function render(bool $collapsed = false): InputfieldWrapper {
    $fluencyConfig = (new FluencyConfig())->getConfigData();
    $modules = wire('modules');
    $fluency = $modules->get('Fluency');
    $wrapper = $modules->get('InputfieldWrapper');

    // Bail early
    if (!$fluencyConfig || !$fluencyConfig->translation_api_ready) {
      return $wrapper->add([
        'type' => 'InputfieldMarkup',
        "label" => '!',
        "collapsed" => Inputfield::collapsedNever,
        "skipLabel" => Inputfield::skipLabelHeader,
        'value' => FluencyMarkup::h(3,
          FluencyErrors::getMessage(FluencyErrors::FLUENCY_NOT_CONFIGURED),
          'ft-error-not-configured'
        )
      ]);
    }

    $fluency->insertStandaloneTranslatorAssets();

    $uiText = FluencyLocalization::getFor('standaloneTranslator');

    // Get all languages, they don't have to be configured/associated with ProcessWire languages
    // in Fluency
    $languages = $fluency->getTranslatableLanguages()->languages;

    $sourceLanguageSelectOptions = self::createLanguageSelectOptions(
      'source',
      $languages,
      $fluency->getConfiguredLanguages()->getDefault()
    );

    $targetLanguageSelectOptions = self::createLanguageSelectOptions('target', $languages);

    return $wrapper->add([
      'ft_standalone_translator' => [
        'type' => 'InputfieldFieldset',
        'label' => "Fluency | {$uiText->description} {$fluency->getTranslationEngineInfo()->name}",
        'icon' => 'language',
        'attributes' => [
          'class' => self::appendInputfieldClasses('InputfieldFieldset',  'ft-standalone-translator-fieldset'),
        ],
        'collapsed' => $collapsed ? Inputfield::collapsedYes : Inputfield::collapsedNever,
        'children' => [
          'ft_source_language' => [
            'type' => 'InputfieldSelect',
            'label' => $uiText->fieldLabelFrom,
            'required' => true,
            'columnWidth' => 45,
            'collapsed' => Inputfield::collapsedNever,
            'themeBorder' => 'hide',
            'attributes' => [
              'class' => self::appendInputfieldClasses('InputfieldSelect', 'ft-source-language')
            ],
            'options' => $sourceLanguageSelectOptions->options,
            'optionAttributes' => $sourceLanguageSelectOptions->attributes,
          ],
          'ft_swap_languages' => [
            'type' => 'InputfieldMarkup',
            'label' => ' ',
            'collapsed' => Inputfield::collapsedNever,
            'columnWidth' => 10,
            'themeBorder' => 'hide',
            'children' => [
              [
                'type' => 'InputfieldButton',
                'collapsed' => Inputfield::collapsedNever,
                'name' => "swap_languages",
                'value' => 1,
                'attributes' => [
                  'icon' => 'exchange',
                  'class' => self::appendInputfieldClasses('InputfieldSubmit', 'js-ft-swap-languages')
                ]
              ],
            ]
          ],
          'ft_target_language' => [
            'type' => 'InputfieldSelect',
            'label' => $uiText->fieldLabelTo,
            'required' => true,
            'columnWidth' => 45,
            'collapsed' => Inputfield::collapsedNever,
            'themeBorder' => 'hide',
            'attributes' => [
              'class' => self::appendInputfieldClasses('InputfieldSelect', 'ft-target-language')
            ],
            'options' => $targetLanguageSelectOptions->options,
          ],
          'ft_source_content' => [
            'type' => 'InputfieldTextarea',
            'label' => $uiText->fieldLabelOriginal,
            'columnWidth' => 50,
            'collapsed' => Inputfield::collapsedNever,
            // 'themeInputSize' => 's',
            'themeBorder' => 'hide',
            'attributes' => [
              'id' => 'ft_source_content',
              'class' => self::appendInputfieldClasses('InputfieldTextarea', 'ft-source-content'),
              'rows' => 10,
              'value' => '',
            ]
          ],
          'ft_translated_content' => [
            'type' => 'InputfieldTextarea',
            'label' => $uiText->fieldLabelTranslated,
            'columnWidth' => 50,
            'collapsed' => Inputfield::collapsedNever,
            // 'themeInputSize' => 's',
            'themeBorder' => 'hide',
            'attributes' => [
              'id' => 'ft_translated_content',
              'class' => self::appendInputfieldClasses('InputfieldTextarea', 'ft-translated-content'),
              'rows' => 10,
              'value' => '',
            ]
          ],
          'ft_standalone_translator_submit' => [
            'type' => 'InputfieldSubmit',
            'text' => $uiText->buttonLabelTranslate,
            'value' => 'translate',
            'attributes' => [
              'icon' => 'chevron-circle-right',
              'class' => self::appendInputfieldClasses('InputfieldSubmit', 'js-ft-translate')
            ]
          ],
        ]
      ],
    ]);
  }

}