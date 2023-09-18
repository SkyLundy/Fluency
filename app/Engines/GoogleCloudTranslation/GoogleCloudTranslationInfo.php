<?php

declare(strict_types=1);

namespace Fluency\Engines\GoogleCloudTranslation;

use Fluency\DataTransferObjects\EngineInfoData;
use Fluency\Engines\FluencyEngineInfo;
use Fluency\App\FluencyMarkup as Markup;

final class GoogleCloudTranslationInfo implements FluencyEngineInfo {

  /**
   * {@inheritdoc}
   */
  public function __invoke(): EngineInfoData {
    return EngineInfoData::fromArray([
      'name' => 'Google Cloud Translation',
      'version' => '1.0',
      'authorName' => 'FireWire',
      'authorUrl' => 'https://processwire.com/talk/profile/3976-firewire/',
      'provider' => 'Google',
      'providerApiVersion' => '2.0',
      'providerApiDocs' => 'https://cloud.google.com/translate/docs/reference/rest/',
      'configId' => '21f97d32-f55b-459f-ae23-172e62639fc0',
      'details' => Markup::concat(
        Markup::h(3, 'Google Cloud Translation Engine'),
        Markup::p('This uses Google\'s Cloud API to provide translations for Fluency in ProcessWire and requires an active Google Cloud Platform account with translation API usage configured.')
      )
    ]);
  }

}
