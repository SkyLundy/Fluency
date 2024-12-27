<?php

declare(strict_types=1);

namespace Fluency\Engines\DeepL;

use Fluency\DataTransferObjects\EngineInfoData;
use Fluency\Engines\FluencyEngineInfo;
use Fluency\FluencyMarkup as Markup;

use function ProcessWire\__;

final class DeepLInfo implements FluencyEngineInfo
{
    /**
     * {@inheritdoc}
     */
    public function __invoke(): EngineInfoData
    {
        return EngineInfoData::fromArray([
            'name' => 'DeepL',
            'version' => '1.1',
            'authorName' => 'FireWire',
            'authorUrl' => 'https://processwire.com/talk/profile/3976-firewire/',
            'provider' => 'DeepL',
            'providerApiVersion' => '2.0',
            'providerApiDocs' => 'https://www.deepl.com/docs-api/',
            'providesUsageData' => true,
            'configId' => '6559e628-c6d9-426a-8c86-21f0c095c7a6',
            'details' => Markup::concat(
                Markup::h(3, __('DeepL Translation Engine')),
                Markup::p(
                    __('This is the default translation engine for Fluency. It provides both high quality machine learning driven translation and a reference codebase for the development of other Fluency engines.')
                )
            )
        ]);
    }
}
