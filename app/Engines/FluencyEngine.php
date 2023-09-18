<?php

declare(strict_types=1);

namespace Fluency\Engines;

/**
 * All Fluency translation engines must implement this class and define required methods that
 * return defined data structures.
 *
 * For details on each Data Transfer Object, refer to Fluency\DataTransferObjects\* classes
 *
 * All methods must take/return Data Transfer Objects.
 */

use Fluency\DataTransferObjects\{
  EngineApiUsageData,
  EngineTranslatableLanguagesData,
  EngineTranslationData,
  FluencyConfigData,
  TranslationRequestData
};

interface FluencyEngine {

  /**
   * @param FluencyConfigData $fluencyConfig An immutable object containing the current Fluency
   *                                               module and engine config values
   */
  public function __construct(FluencyConfigData $fluencyConfig);

  /**
   * Receives a request and returns translation result
   *
   * @param EngineTranslationData $translationRequest Engine Translation DTO, refer to class for details
   */
  public function translate(TranslationRequestData $translationRequest): EngineTranslationData;

  /**
   * Gets all languages that can be translated from and to via the translation service
   * This is used to list the available languages in the Fluency config page and also serves to
   * verify that translation API authentication is configured and valid.
   *
   */
  public function getLanguages(): EngineTranslatableLanguagesData;

  /**
   * Gets translation API usage
   *
   * If this feature is not available, an EngineApiUsageData object must be returned with an
   * error value of FluencyErrors::FLUENCY_NOT_IMPLEMENTED
   *
   * @return EngineApiUsageData
   */
  public function getApiUsage(): EngineApiUsageData;

}