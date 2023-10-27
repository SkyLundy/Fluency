<?php

declare(strict_types=1);

namespace Fluency\DataTransferObjects;

use Countable;
use Fluency\DataTransferObjects\FluencyDTO;
use Fluency\DataTransferObjects\Traits\ValidatesObjectInstancesTrait;

/**
 * Contains all configured languages as an array of ConfiguredLanguageData
 *
 * Adds additional methods that provide a better interface for working with configured languages
 * than a simple array
 */

final class AllConfiguredLanguagesData extends FluencyDTO implements Countable {

  use ValidatesObjectInstancesTrait;


  /**
   * @param array<ConfiguredLanguageData> $languages All languages configured in ProcessWire
   */
  private function __construct(
    public readonly array $languages
  ) {}

  /**
   * {@inheritdoc}
   */
  public static function fromArray(array $data): self {
    $languages = $data['languages'] ?? [];

    self::validateArrayConainsOnlyInstancesOf($languages, ConfiguredLanguageData::class);

    return new self(languages: $languages);
  }

  public function getDefault(): ?ConfiguredLanguageData {
    return array_reduce(
      $this->languages,
      fn($match, $lang) => $match = $lang->default ? $lang : $match
    );
  }

  public function getByProcessWireId(int $id): ?ConfiguredLanguageData {
    return array_reduce(
      $this->languages,
      fn($match, $lang) => $match = $lang->id === $id ? $lang : $match
    );
  }

  public function getByProcessWireTitle(string $title): ?ConfiguredLanguageData {
    return array_reduce(
      $this->languages,
      fn($match, $lang) => $match = $lang->title === $title ? $lang : $match
    );
  }

  public function getCurrent(): ?ConfiguredLanguageData {
    return array_reduce(
      $this->languages,
      fn($match, $lang) => $match = $lang->isCurrentLanguage ? $lang : $match
    );
  }

  public function getBySourceCode(string $code): ?ConfiguredLanguageData
  {
    return array_reduce(
      $this->languages,
      fn($match, $lang) => $match = $lang->engineLanguage->sourceCode == $code ? $lang : $match
    );
  }

  public function getByTargetCode(string $code): ?ConfiguredLanguageData
  {
    return array_reduce(
      $this->languages,
      fn($match, $lang) => $match = $lang->engineLanguage->targetCode == $code ? $lang : $match
    );
  }

  public function getBySourceName(string $name): ?ConfiguredLanguageData {
    return array_reduce(
      $this->languages,
      fn($match, $lang) => $match = $lang->engineLanguage->sourceName == $name ? $lang : $match
    );
  }

  public function getByTargetName(string $name): ?ConfiguredLanguageData {
    return array_reduce(
      $this->languages,
      fn($match, $lang) => $match = $lang->engineLanguage->targetName == $name ? $lang : $match
    );
  }

  /**
   * Countable interface method
   */
  public function count(): int {
    return count($this->languages);
  }
}