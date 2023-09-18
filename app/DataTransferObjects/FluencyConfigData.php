<?php

declare(strict_types=1);

namespace Fluency\DataTransferObjects;

use JsonSerializable;

/**
 * Provides an immutable and filtered config interface for translation engines
 */

final class FluencyConfigData extends FluencyDTO {

  /**
   * Mixed type parameters will be cast to boolean
   *
   * @param bool    $translation_api_ready                Whether that translation engine API is ready
   * @param bool    $translation_ready                    Languages configured in Fluency & engine API
   *                                                      is ready
   * @param bool    $translation_cache_enabled            Translation cache will be used
   * @param bool    $translatable_languages_cache_enabled Translatable Languages  cache will be used
   * @param ?object $selected_engine                      The engine selected in Fluency config
   * @param ?object $engine                               Current values for the translation engine
   *                                                      config variables
   */
  private function __construct(
    public readonly bool $translation_api_ready,
    public readonly bool $translation_ready,
    public readonly bool $translation_cache_enabled,
    public readonly bool $translatable_languages_cache_enabled,
    public readonly ?object $selected_engine,
    public readonly ?object $engine
  ) {}

  /**
   * {@inheritdoc}
   */
  public static function fromArray(array $config): self {
    $config['selected_engine'] ??= null;
    $config['selected_engine'] && $config['selected_engine'] = unserialize($config['selected_engine']);

    return new self(...[
      'translation_api_ready' => (bool) $config['translation_api_ready'],
      'translation_ready' => (bool) $config['translation_ready'],
      'translation_cache_enabled' => (bool) $config['translation_cache_enabled'],
      'translatable_languages_cache_enabled' => (bool) $config['translatable_languages_cache_enabled'],
      'engine' => (object) $config['engine'] ??= [],
      'selected_engine' => $config['selected_engine']
    ]);
  }

  /**
   * {@inheritdoc}
   */
  public function toArray(): array {
    $values = parent::toArray();

    $values['engine'] = (array) $values['engine'];

    return $values;
  }

}