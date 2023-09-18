<?php

declare(strict_types=1);

namespace Fluency\Caching;

use Fluency\DataTransferObjects\{ EngineTranslationData, TranslationRequestData };
use ProcessWire\{ ProcessWire, WireCache };

/**
 * This largely acts as a wrapper for ProcessWire's WireCache with added functionality and feature
 * implementations specific to translations
 */

final class TranslationCache {

  public const CACHE_NAMESPACE = 'Fluency.Translation';

  private const CACHE_EXPIRY = WireCache::expireMonthly;

  private ?WireCache $cache = null;

  private function cache(): WireCache {
    return $this->cache ??= new WireCache();
  }

  public function getOrStoreNew(
    TranslationRequestData $translationRequest,
    callable $callback
  ): EngineTranslationData {
    $translationData = $this->get($translationRequest);

    if (!$translationData) {
      $translationData = $callback();

      if (!$translationData->error) {
        $this->store($translationData);
      }
    }

    return $translationData;
  }

  /**
   * Saves translated content to cache. Will only store if there were no errors returned.
   * @return void
   */
  public function store(EngineTranslationData $translationData): void {
    if (!$translationData->translations || $translationData->error) {
      return;
    }

    $this->cache()->saveFor(
      self::CACHE_NAMESPACE,
      $translationData->cacheKey,
      serialize($translationData),
      self::CACHE_EXPIRY
    );
  }

  /**
   * Attempts to retrieve previously translated engine response object from cache.
   */
  public function get(TranslationRequestData $translationRequest): ?EngineTranslationData {
    $translation = $this->cache()->getFor(self::CACHE_NAMESPACE, $translationRequest->cacheKey);

    if (!$translation) {
      return null;
    }

    $translation = unserialize($translation);

    return EngineTranslationData::fromCache($translation);
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