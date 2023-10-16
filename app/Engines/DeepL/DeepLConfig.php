<?php

declare(strict_types=1);

namespace Fluency\Engines\DeepL;

use Fluency\App\FluencyMarkup as Markup;
use Fluency\Engines\FluencyEngineConfig;
use ProcessWire\{ Inputfield, InputfieldWrapper };
use Fluency\DataTransferObjects\FluencyConfigData;

use function ProcessWire\{ __, wire };

/**
 * The configuration interface for Fluency
 */
final class DeepLConfig implements FluencyEngineConfig {

  public function __construct(
    private FluencyConfigData $fluencyConfig
  ) {}

  /**
   * {@inheritdoc}
   */
  public static function getConfig(): array {
    return [
      'deepl_account_type' => '',
      'deepl_api_key' => '',
      'deepl_formality' => 'default',
      'deepl_global_ignored_strings' => '',
      'deepl_preserve_formatting' => true,
    ];
  }

  /**
   * {@inheritdoc}
   */
  public function renderConfigInputs(): ?InputfieldWrapper {
    $defaults = $this->getConfig();

    $hideCredentialFields = $this->fluencyConfig
                                 ->translation_api_ready ? true : Inputfield::collapsedNever;

    return wire('modules')->get('InputfieldFieldset')->add([
      'deepl_account_credentials' => [
        'type' => 'InputfieldFieldset',
        'label' => __('API Credentials'),
        'notes' => __('Credentials can be found in your DeepL acocunt at the bottom of this page: https://www.deepl.com/de/account/summary'),
        'collapsed' => $hideCredentialFields,
        'children' => [
          'deepl_account_type' => [
            'type' => 'InputfieldSelect',
            'label' => __('DeepL Account Type'),
            'description' => __('Select your account type'),
            'required' => true,
            'themeBorder' => 'hide',
            'columnWidth' => 50,
            'collapsed' => Inputfield::collapsedNever,
            'options' => [
              'free' => 'Free',
              'pro' => 'Pro',
            ]
          ],
          'deepl_api_key' => [
            'type' => 'InputfieldText',
            'label' => __("DeepL API Key"),
            'description' => __('Ensure that your API key and account type match.'),
            'columnWidth' => 50,
            'required' => true,
            'collapsed' => Inputfield::collapsedNever,
            'themeBorder' => 'hide',
          ],
        ]
      ],
      // Preserve formatting
      'deepl_preserve_formatting' => [
        'type' => 'InputfieldSelect',
        'label' => __('Preserve Formatting'),
        'required' => true,
        'columnWidth' => 50,
        'defaultValue' => $defaults['deepl_preserve_formatting'],
        'themeBorder' => 'hide',
        'description' => __('By default, DeepL will attempt to correct some aspects of content. This includes punctuation at the beginning/end of sentences, and upper/lower case at the beginning of the sentence. Choosing "Yes" means that the content will be changed as provided without automatic formatting.'),
        'options' => [
          1 => 'Yes (Recommended)',
          0 => 'No (DeepL default)',
        ]
      ],
      // Preserve formatting
      'deepl_formality' => [
        'type' => 'InputfieldSelect',
        'label' => __('Formality'),
        'description' => __("DeepL has the ability to adjust formality for some languages. This can change the tone of the translation and may help better suit how it is used in your website or application. Languages that don't support formality will not be affected. For a list of supported langauges, visit the service documentation link above."),
        'required' => true,
        'columnWidth' => 50,
        'themeBorder' => 'hide',
        'defaultValue' => $defaults['deepl_formality'],
        'options' => [
          'default' => __('Default'),
          'prefer_more' => __('More Formal'),
          'prefer_less' => __('Less Formal'),
        ]
      ],
      // Strings not translated
      'deepl_global_ignored_strings' => [
        'type' => 'InputfieldTextarea',
        'label' => __('Global Non-Translated Strings'),
        'notes' => __('Provide multiple strings separated with a || (double pipe). Values are case sensitive. Spaces before and after double pipes can be added for readability, e.g. foo || bar'),
        'themeBorder' => 'hide',
        'defaultValue' => $defaults['deepl_global_ignored_strings'],
        'description' => __('Add strings here that will not be translated. This is useful for things like brand names.')
      ],
      'deepl_additional_information' => [
        'type' => 'InputfieldMarkup',
        'label' => __('Additional Information About the DeepL API'),
        'themeBorder' => 'hide',
        'collapsed' => Inputfield::collapsedNever,
        'value' => Markup::concat(
          '<style>.deepl-add-info {margin-top: 0;} .deepl-add-info li {margin-top: .5rem;}</style>',
          Markup::ul([
            Markup::li(__('In addition to declaring excluded strings here on the module config page, you may also add a translate="no" attribute, or class="notranslate" to HTML within content to selectively exclude from translation.')),
            Markup::li(__('DeepL supports translating up to 50 separate groups of text from one language to another in one request. Each group can have full content, markup, and multiple sentences. When translating using the Fluency translate() method, you may provide an array of content that will be returned in the same order as it was provided.')
            ),
            Markup::li(__('DeepL requests may be up to ~130kb in size. This is roughly equivalent to 65,000 words. Texts larger than that must be chunked into multiple requests.'))
          ], 'deepl-add-info')
        ),
      ]
    ]);
  }

}
