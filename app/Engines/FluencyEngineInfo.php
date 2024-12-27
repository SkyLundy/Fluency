<?php

/**
 * All Fluency translation engine info classes must implement this interface
 */

declare(strict_types=1);

namespace Fluency\Engines;

use Fluency\DataTransferObjects\EngineInfoData;

interface FluencyEngineInfo
{
    /**
     * Implementing classes must contain an invoke method that immediately returns an EngineInfoData
     * object. Implementing class are required to type hint the return value as declared here.
     *
     * Reference Fluency\DataTransferObjects\EngineInfoData for details
     *
     * @return EngineInfoData
     */
    public function __invoke(): EngineInfoData;
}
