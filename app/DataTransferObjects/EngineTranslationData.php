<?php

declare(strict_types=1);

namespace Fluency\DataTransferObjects;

use \InvalidArgumentException;
use Countable;
use Fluency\DataTransferObjects\Traits\CreatesRetrievedAtTimestampTrait;
use Fluency\DataTransferObjects\{ FluencyDTO, TranslationRequestData };

/**
 * Used to return a translation result from a translation engine
 */

final class EngineTranslationData extends FluencyDTO implements Countable {

  use CreatesRetrievedAtTimestampTrait;

  /**
   * @param string       $sourceLanguage  Language code translated from
   * @param string       $targetLanguage  Language code translated to
   * @param string|array $content         Content for translating
   * @param array        $translations    Indexed array of translations returned from
   *                                      translation API, not required when this object
   *                                      is passed to a translation engine as a request
   * @param array        $options         Options, unresStricted use by engines
   * @param string|null  $error           Error encountered, use App\FluencyErrors
   * @param string|null  $message         Message from error if present
   * @param bool         $fromCache       Whether a translation was returned from cache
   * @param string       $retrievedAt     Auto-generated date translation was retrieved
   *                                      from the translation service API
   */
  private function __construct(
    public readonly ?string $sourceLanguage,
    public readonly ?string $targetLanguage,
    public readonly array $content,
    public readonly array $translations,
    public readonly array $options,
    public readonly bool $fromCache,
    public readonly string $cacheKey,
    public readonly ?string $retrievedAt,
    public readonly ?string $error,
    public readonly ?string $message
  ) {}

  /**
   * {@inheritdoc}
   *
   * $data structure:
   * [
   *   'translations' => string|array
   *   'request' => TranslationRequestData
   * ]
   * @throws InvalidArgumentException
   */
  public static function fromArray(array $data): self {
    $request = $data['request'] ??= null;

    unset($data['request']);

    if (!is_a($request, TranslationRequestData::class, true)) {
      throw new InvalidArgumentException(
        "'request' property is required and must be an instance of TranslationRequestData"
      );
    }

    return new self(...[
      'error' => null,
      'translations' => [],
      ...$data,
      ...$request->toArray(),
      'fromCache' => false,
      'message' => self::getMessageIfErrorPresent($data),
      'retrievedAt' => self::newRetrievedAtTimestamp(),
    ]);
  }

  /**
   * Internal use only
   */
  public static function fromCache(EngineTranslationData $translation): self {
    return new self(...[...$translation->toArray(), 'fromCache' =>  true]);
  }

  /**
   * Countable interface method
   */
  public function count(): int {
    return count($this->translations);
  }
}