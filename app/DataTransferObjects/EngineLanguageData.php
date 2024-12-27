<?php

/**
 * Represents a language understood/used by an engine's translation service API
 */

declare(strict_types=1);

namespace Fluency\DataTransferObjects;

final class EngineLanguageData extends FluencyDTO
{
    /**
     * @param string      $sourceName Name of source language
     * @param string      $sourceCode Language code (ISO, IETF, etc), engine dependent
     * @param string      $targetName Name of target language
     * @param string      $targetCode Language code (ISO, IETF, etc), engine dependent
     * @param mixed       $meta       Optional additional data payload, engine dependent
     * @param string|null $error      Error encountered, use App\FluencyErrors
     * @param string|null $message    Message from error if present
     */
    private function __construct(
        public readonly string $sourceName,
        public readonly string $sourceCode,
        public readonly string $targetName,
        public readonly string $targetCode,
        public readonly mixed $meta,
        public readonly ?string $error,
        public readonly ?string $message
    ) {}

    public static function fromArray(array $data): self
    {
        return new self(...[
            'error' => null,
            'meta' => null,
            ...$data,
            'message' => self::getMessageIfErrorPresent($data)
        ]);
    }
}
