<?php

declare(strict_types=1);

namespace Fluency\Engines;

/**
 * Interface for option Fluency Engine configurations
 */

use Fluency\DataTransferObjects\FluencyConfigData;
use ProcessWire\InputfieldWrapper;

interface FluencyEngineConfig {

  /**
   * Engine config classes are provided a config object created for consumption by classes outside
   * of FluencyConfig. When an engine is selected on the Fluency config page, the properties defined
   * in FluencyEngineConfig::getConfig() will be populated, defaults will be replaced with user
   * selections when made. Refer to Fluency/DataTransferObjects/FluencyConfigData for details
   *
   * @param FluencyConfigData $fluencyConfig Immutable object containing the current Fluency
   *                                               module configurations, including those of the
   *                                               engine itself
   */
  public function __construct(FluencyConfigData $fluencyConfig);

  /**
   * This returns a full array of all config properties used by an engine with default values. These
   * will be made available, along with all other Fluency config properties at runtime via the
   * constructor FluencyConfigData instance
   *
   * Please reference FluencyConfigData::getConfigData() for data and structure
   *
   * NOTE:
   * All config properties used must be unique to this engine. Consider prefixing them with the
   * engine name in snake case.
   *
   * @return array<string, mixed>
   */
  public static function getConfig(): array;

  /**
   * Returns a set of engine-specific  configuration fields that will be rendered on the Fluency
   * module configuration page
   *
   * Kept optional by allowing a null value to be returned, but likely needs to be present.
   *
   * NOTE:
   * Default values
   *
   * Configurations include engine specific items like:
   * - Service provider API keys
   * - User configurable translation features
   * - User configured options for data handling
   *
   */
  public function renderConfigInputs(): ?InputfieldWrapper;

}