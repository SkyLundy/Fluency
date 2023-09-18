<?php

declare(strict_types=1);

namespace Fluency\Caching;

use Fluency\DataTransferObjects\EngineTranslatableLanguagesData;
use ProcessWire\{ ProcessWire, WireCache };

/**
 * This largely acts as a wrapper for ProcessWire's WireCache with added functionality and
 * feature implementations
 */

final class EngineLanguagesCache {

  public const CACHE_NAMESPACE = 'Fluency.EngineLanguages';

  private const CACHE_EXPIRY = WireCache::expireWeekly;

  private WireCache $cache;

  private function cache(): WireCache {
    return $this->cache ??= new WireCache();
  }

  public function getOrStoreNew(
    string $engineConfigId,
    callable $callback
  ): EngineTranslatableLanguagesData {
    $languageData = $this->get($engineConfigId);

    if (!$languageData) {
      $languageData = $callback();

      !$languageData->error && $this->store($languageData, $engineConfigId);
    }

    return $languageData;
  }

  /**
   * Saves translated content to cache. Will only store if there were no errors returned.
   * @return void
   */
  public function store(
    EngineTranslatableLanguagesData $languagesData,
    string $engineConfigId
  ): void {
    if (!$languagesData->languages || $languagesData->error) {
      return;
    }

    $this->cache()->saveFor(
      self::CACHE_NAMESPACE,
      $engineConfigId,
      serialize($languagesData),
      self::CACHE_EXPIRY
    );
  }

  /**
   * Attempts to retrieve previously translated engine response object from cache.
   */
  public function get(string $engineConfigId): ?EngineTranslatableLanguagesData {
    $languagesData = $this->cache()->getFor(self::CACHE_NAMESPACE, $engineConfigId);

    if (!$languagesData) {
      return null;
    }

    $languagesData = unserialize($languagesData);

    return EngineTranslatableLanguagesData::fromCache($languagesData);
  }

  /**
   * Returns a count of the number of translations cached
   * @return int
   */
  public function count(): int {
    return array_reduce(
      array_column($this->cache()->getInfo(), 'name'),
      fn($total, $name) => str_starts_with($name, self::CACHE_NAMESPACE) ? ++$total : $total,
      0
    );
  }

  /**
   * Clear all cached translations
   * @return int Returns the number of entries in cache, will be zero on success
   */
  public function clear(): int {
    $this->cache()->deleteFor(self::CACHE_NAMESPACE);

    return $this->count();
  }
}