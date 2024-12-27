<?php

/**
 * This represents a language as configured in ProcessWire/Fluency
 * The source/target languages are an engine-recognized pair. This may be important when a service
 * may translate from one language to a specific dialect, but not between the dialects themselves.
 */

declare(strict_types=1);

namespace Fluency\DataTransferObjects;

use Fluency\DataTransferObjects\EngineInfoData;

final class FluencyEngineSelectData extends FluencyDTO
{
    private EngineInfoData $infoObject;

    /**
     * @param string $engineClass       Fully qualified Translation Engine class name
     * @param string $engineInfoClass   Fully qualified Translation Engine Info class name
     * @param string $engineConfigClass Fully qualified Translation Engine Config class name
     */
    private function __construct(
        public readonly string $engineClass,
        public readonly string $infoClass,
        public readonly string $configClass,
    ) {}

    /**
     * {@inheritdoc}
     */
    public static function fromArray(array $data): self
    {
        return new self(...$data);
    }

    public function info(): EngineInfoData
    {
        return $this->infoObject ??= (new $this->infoClass)();
    }
}
