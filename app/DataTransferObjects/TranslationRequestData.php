<?php

declare(strict_types=1);

namespace Fluency\DataTransferObjects;

use Fluency\DataTransferObjects\FluencyDTO;

/**
 * Used to transfer translation request data to the translation engine
 */

class TranslationRequestData extends FluencyDTO {

  /**
   * @param string       $sourceLanguage  Language code translated from
   * @param string       $targetLanguage  Language code translated to
   * @param string|array $content         Content for translating
   * @param array        $translations    Indexed array of translations returned from
   *                                      translation API, not required when this object
   *                                      is passed to a translation engine as a request
   * @param array        $options         Options, used per-engine
   * @param string       $cacheKey        Unique key generated to identify a cached translation
   */
  private function __construct(
    public readonly ?string $sourceLanguage,
    public readonly ?string $targetLanguage,
    public readonly string|array $content,
    public readonly array $options,
    public readonly string $cacheKey
  ) {}

  /**
   * {@inheritdoc}
   */
  public static function fromArray(array $data): self {
    return new self(...[
      ...$data,
      'content' => (array) $data['content'],
      'cacheKey' => self::createCacheKey($data)
    ]);
  }


  /**
   * @param  array<string, mixed> $data
   */
  private static function createCacheKey(array $data): ?string {
    $keyParameters = serialize([
      $data['sourceLanguage'],
      $data['targetLanguage'],
      $data['content'],
      $data['options']
    ]);

    return hash('sha256', $keyParameters);
  }

}