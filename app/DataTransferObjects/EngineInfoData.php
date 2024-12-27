<?php

/**
 * Returned by a translation engines *Info.php file
 */

declare(strict_types=1);

namespace Fluency\DataTransferObjects;

use InvalidArgumentException;

final class EngineInfoData extends FluencyDTO
{
    /**
     * @param string      $name               Name of the Fluency Engine
     * @param string      $version            Fluency Engine version
     * @param string      $provider           Name of API provider
     * @param string      $providerApiVersion Version of the provider API
     * @param string      $providerApiDocs    URL of provider API documentation
     * @param string      $configId           ID to associate per-engine Fluency config properties
     *                                        like language associatins. Consider using a UUID
     * @param bool        $providesUsage      (optional) Whether this engine provides usage stats
     * @param string|null $details            (optional) Information to display in the Fluency module
     *                                                   If formatted text is desired, consider using
     *                                                   FluencyMarkup
     * @param string|null $authorName         (optional) Name of Fluency Engine author
     * @param string|null $authorUrl          (optional) URL for Fluency Engine author (optional)
     * @param string|null $error              Error encountered, use App\FluencyErrors
     * @param string|null $message            Message from error if present
     */
    private function __construct(
        public readonly string $name,
        public readonly string $version,
        public readonly string $provider,
        public readonly string $providerApiVersion,
        public readonly string $providerApiDocs,
        public readonly string $configId,
        public readonly bool $providesUsageData,
        public readonly ?string $details,
        public readonly ?string $authorName,
        public readonly ?string $authorUrl,
        public readonly ?string $error,
        public readonly ?string $message
    ) {}

    /**
     * {@inheritdoc}
     */
    public static function fromArray(array $data): self
    {
        if (
            !str_starts_with($data['providerApiDocs'], 'http') ||
            array_key_exists('authorUrl', $data) && !str_starts_with($data['providerApiDocs'], 'http')
        ) {
            throw new InvalidArgumentException('URLs in EngineInfo must begin with http/https');
        }

        return new self(...[
            'error' => null,
            'authorName' => null,
            'authorUrl' => null,
            'details' => null,
            'providesUsageData' => false,
            ...$data,
            'configId' => hash('sha256', $data['configId']),
            'message' => self::getMessageIfErrorPresent($data)
        ]);
    }
}
