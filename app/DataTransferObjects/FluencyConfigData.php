<?php

declare(strict_types=1);

namespace Fluency\DataTransferObjects;

use stdClass;

/**
 * Provides an immunable object representing the current state of Fluency's configuration
 */

final class FluencyConfigData extends FluencyDTO {

  /**
   * @param bool                         $translation_api_ready     Whether that translation engine API is ready
   * @param bool                         $translation_cache_enabled Translation cache will be used
   * @param FluencyEngineSelectData|null $selected_engine           The engine selected in Fluency config
   * @param stdClass|null $engine                                   Current values for the translation
   *                                                                engine config variables
   * @param ?string $inputfield_translation_action translate_each_language or translate_to_all_languages
   */
  private function __construct(
    public readonly bool $translation_api_ready,
    public readonly bool $translation_cache_enabled,
    public readonly ?FluencyEngineSelectData $selected_engine,
    public readonly ?stdClass $engine,
    public readonly ?string $inputfield_translation_action,
  ) {}

  /**
   * {@inheritdoc}
   */
  public static function fromArray(array $config): self {
    return new self(
      translation_api_ready: (bool) $config['translation_api_ready'],
      translation_cache_enabled: (bool) $config['translation_cache_enabled'],
      engine: (object) $config['engine'] ??= [],
      selected_engine: $config['selected_engine'],
      inputfield_translation_action: $config['inputfield_translation_action'],
    );
  }

  /**
   * {@inheritdoc}
   */
  public function toArray(): array {
    $values = parent::toArray();

    $values['engine'] = (array) $values['engine'];
    $values['selected_engine'] = (array) $values['selected_engine'];

    return $values;
  }

}