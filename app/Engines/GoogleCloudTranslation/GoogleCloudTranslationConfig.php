<?php

declare(strict_types=1);

namespace Fluency\Engines\GoogleCloudTranslation;

use Fluency\Engines\FluencyEngineConfig;
use ProcessWire\{Inputfield, InputfieldWrapper};
use Fluency\DataTransferObjects\FluencyConfigData;

use function ProcessWire\{__, wire};

/**
 * The configuration interface for Fluency
 */
final class GoogleCloudTranslationConfig implements FluencyEngineConfig
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
            'gcp_api_key' => ''
        ];
    }

    /**
     * {@inheritdoc}
     */
    public function renderConfigInputs(): ?InputfieldWrapper
    {
        $apiReady = $this->fluencyConfig->translation_api_ready;

        return wire('modules')->get('InputfieldFieldset')->add([
            'gcp_api_key' => [
                'type' => 'InputfieldText',
                'label' => __("Google Cloud API Key"),
                'required' => true,
                'themeBorder' => 'hide',
                'collapsed' => $apiReady ? true : Inputfield::collapsedNever,
            ]
        ]);
    }
}
