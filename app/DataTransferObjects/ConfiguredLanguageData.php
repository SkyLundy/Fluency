<?php

/**
 * Represents a language as configured in ProcessWire/Fluency
 */

declare(strict_types=1);

namespace Fluency\DataTransferObjects;

use Fluency\DataTransferObjects\Traits\ValidatesErrorsTrait;

final class ConfiguredLanguageData extends FluencyDTO
{
    use ValidatesErrorsTrait;

    /**
     * @param int                 $id                ProcessWire language ID
     * @param string              $title             ProcessWire language title
     * @param bool                $default           Is default language in ProcessWire
     * @param bool                $isCurrentLanguage Is the current user's language
     * @param EngineLanguageData  $engineLanguage    Translation engine language
     * @param string|null         $error             Error encountered, use App\FluencyErrors
     * @param string|null         $message           Message from error if present
     */
    private function __construct(
        public readonly int $id,
        public readonly string $title,
        public readonly bool $default,
        public readonly bool $isCurrentLanguage,
        public readonly EngineLanguageData $engineLanguage,
        public readonly ?string $error,
        public readonly ?string $message,
    ) {}

    /**
     * {@inheritdoc}
     */
    public static function fromArray(array $data): self
    {
        self::validateErrorIfPresent($data, 'error');

        return new self(...[
            'error' => null,
            ...$data,
            'message' => self::getMessageIfErrorPresent($data)
        ]);
    }
}
