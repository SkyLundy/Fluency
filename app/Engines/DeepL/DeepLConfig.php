<?php

/**
 * Configuration for the DeepL translation engine
 */

declare(strict_types=1);

namespace Fluency\Engines\DeepL;

use Fluency\FluencyMarkup as Markup;
use Fluency\Engines\FluencyEngineConfig;
use ProcessWire\{Inputfield, InputfieldWrapper};
use Fluency\DataTransferObjects\FluencyConfigData;

use function ProcessWire\{__, wire};

final class DeepLConfig implements FluencyEngineConfig
{
    public function __construct(
        private FluencyConfigData $fluencyConfig
    ) {}

    /**
     * {@inheritdoc}
     */
    public static function getConfig(): array
    {
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
    public function renderConfigInputs(): ?InputfieldWrapper
    {
        $defaults = $this->getConfig();

        $credentialFieldVisibility = Inputfield::collapsedNever;

        if (
            $this->fluencyConfig->translation_api_ready &&
            $this->fluencyConfig->engine->deepl_api_key
        ) {
            $credentialFieldVisibility = Inputfield::collapsedYes;
        }

        return wire('modules')->get('InputfieldFieldset')->add([
            'deepl_account_credentials' => [
                'type' => 'InputfieldFieldset',
                'label' => __('API Credentials'),
                'notes' => __('Credentials can be found in your DeepL acocunt at the bottom of this page: https://www.deepl.com/account/summary'),
                'collapsed' => $credentialFieldVisibility,
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
                'description' => __('Add strings here that will not be translated. This is useful for values such as brand names.  Values are case sensitive.'),
                'notes' => __('Multiple strings may be added one per line or on a single line separated by a || (double pipe). Spaces before and after double pipes may be added for readability, e.g. foo || bar'),
                'themeBorder' => 'hide',
                'defaultValue' => $defaults['deepl_global_ignored_strings'],
            ],
            'deepl_additional_information' => [
                'type' => 'InputfieldMarkup',
                'label' => __('Additional Information About the DeepL API'),
                'themeBorder' => 'hide',
                'collapsed' => Inputfield::collapsedNever,
                'value' => Markup::concat(
                    '<style>.deepl-add-info {margin-top: 0;} .deepl-add-info li {margin-top: .5rem;}</style>',
                    Markup::ul([
                        Markup::li(__('In addition to declaring globally excluded strings here, you may manually add a translate="no" attribute, or class="notranslate" to HTML tags within content to selectively exclude from translation.')),
                        Markup::li(
                            __('When using the Fluency programatically, you may provide a string or an array of strings. DeepL supports translating up to 50 separate groups of text from one language to another in one request via an array. Arrays are returned in the same order as provided. Strings may have any type of content with or without HTML.')
                        ),
                        Markup::li(
                            __('If content is being split into an array, be mindful of where the text is split as translation accuracy is dependent on context between sentences.')
                        ),
                        Markup::li(__('DeepL requests may be up to ~130kb in size. This is roughly equivalent to 65,000 words. Texts larger than that must be chunked into multiple requests.'))
                    ], 'deepl-add-info'),
                ),
            ]
        ]);
    }
}
