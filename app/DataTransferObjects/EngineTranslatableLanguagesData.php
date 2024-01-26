<?php

declare(strict_types=1);

namespace Fluency\DataTransferObjects;

use Countable;
use Fluency\DataTransferObjects\{ FluencyDTO, EngineLanguageData };
use Fluency\DataTransferObjects\Traits\{ CreatesRetrievedAtTimestampTrait, ValidatesErrorsTrait };

require_once __DIR__ . '/../Functions/typeChecking.php';

use function Fluency\Functions\arrayContainsOnlyInstancesOf;

/**
 * Represents a full list of languages that a translation engine can translate from and too
 */

final class EngineTranslatableLanguagesData extends FluencyDTO implements Countable {

  use CreatesRetrievedAtTimestampTrait;

  use ValidatesErrorsTrait;

  /**
   * @param array<EngineLanguageData> $languages   List of translatable languages, type validated
   * @param bool                      $fromCache   Whether this data was cached
   * @param ?string                   $retrievedAt Date and time data was retrieved from the service API
   * @param string|null               $error       API error, must use App\Enums\FluencyErrors const
   * @param string|null               $message     Error message if present
   */
  private function __construct(
    public readonly array $languages,
    public readonly bool $fromCache,
    public readonly ?string $retrievedAt,
    public readonly ?string $error,
    public readonly ?string $message,
  ) {}

  /**
   * {@inheritdoc}
   */
  public static function fromArray(array $data): self {
    $data['languages'] ??= [];

    self::validateErrorIfPresent($data, 'error');

    arrayContainsOnlyInstancesOf(
      $data['languages'],
      EngineLanguageData::class,
      "Languages array must only contain instances of EngineLanguageData"
    );

    usort($data['languages'], fn($a, $b) => strcmp($a->targetName, $b->targetName));

    return new self(...[
      'error' => null,
      ...$data,
      'fromCache' => false,
      'retrievedAt' => self::newRetrievedAtTimestamp(),
      'message' => self::getMessageIfErrorPresent($data),
    ]);
  }

  /**
   * Internal use only
   */
  public static function fromCache(EngineTranslatableLanguagesData $translatableLanguages): self {
    return new self(...[
      ...$translatableLanguages->toArray(),
      'fromCache' =>  true
    ]);
  }

  public function bySourceCode(string $code): ?EngineLanguageData {
    return $this->getByCode('sourceCode', $code);
  }

  public function byTargetCode(string $code): ?EngineLanguageData {
    return $this->getByCode('targetCode', $code);
  }

  private function getByCode(string $codeType, string $code): ?EngineLanguageData {
    $code = strtolower($code);

    return array_reduce(
      $this->languages,
      fn($match, $language) => $match = strtolower($language->$codeType) === $code ? $language
                                                                                   : $match
    );
  }

  /**
   * Countable interface method
   */
  public function count(): int {
    return count($this->languages);
  }
}