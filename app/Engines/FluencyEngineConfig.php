<?php

/**
 * Interface for option Fluency Engine configurations
 */

declare(strict_types=1);

namespace Fluency\Engines;

use Fluency\DataTransferObjects\FluencyConfigData;
use ProcessWire\InputfieldWrapper;

interface FluencyEngineConfig
{
    /**
     * This accepts an instance of FluencyConfigData. The FluencyConfigData is a DTO containing all
     * current module config values. You can use this to reference information such as whether the
     * engine has been configured and the API is ready. This is useful for conditionally changing
     * values in renderConfigInputs()
     *
     * Refer to Fluency/DataTransferObjects/FluencyConfigData for details
     *
     * @param FluencyConfigData $fluencyConfig Immutable object containing the current Fluency
     *                                               module configurations, including those of the
     *                                               engine itself
     */
    public function __construct(FluencyConfigData $fluencyConfig);

    /**
     * This returns a full array of all config properties used by an engine with default values.
     *
     * You can have these properties populated with user provided values by rendering Inputfields in
     * the InputfieldWrapper returned by renderConfigInputs()
     *
     * @return array<string, mixed>
     */
    public static function getConfig(): array;

    /**
     * Returns a set of engine-specific configuration fields that will be rendered on the Fluency
     * module configuration page
     *
     * This can be optionally omitted by returning null
     *
     * Inputfields that collect user input must be stored in config properties defined in the keys of
     * the array returned by getConfig().
     *
     * Configurations include engine specific items like:
     * - Service provider API keys
     * - Options that are available through the third party translation service
     * - User configured options for data handling
     *
     */
    public function renderConfigInputs(): ?InputfieldWrapper;
}
