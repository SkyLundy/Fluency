<?php

declare(strict_types=1);

namespace Fluency\DataTransferObjects;

use Fluency\DataTransferObjects\{ EngineInfoData, FluencyDTO };
use Fluency\Engines\FluencyEngineInfo;

/**
 * This represents a language as configured in ProcessWire/Fluency
 * The source/target languages are an engine-recognized pair. This may be important when a service
 * may translate from one language to a specific dialect, but not between the dialects themselves.
 */

final class FluencySelectedEngineData extends FluencyDTO {

  private const ENGINE_NAMESPACE = 'Fluency\Engines\%{DIRECTORY}\%{CLASS_NAME}';

  private EngineInfoData $infoObject;

  /**
   * @param string $engineClass       The fully qualified Translation Engine class name
   * @param string $engineInfoClass   The fully qualified Translation Engine Info class name
   * @param string $engineConfigClass The fully qualified Translation Engine Config class name
   */
  private function __construct(
    public readonly string $engineClass,
    public readonly string $infoClass,
    public readonly string $configClass
  ) {}

  /**
   * {@inheritdoc}
   */
  public static function fromArray(array $data): self {
    $directory = $data['directory'];

    return new self(...[
      'engineClass' => self::createClassFromFilename($data['engineFile'], $directory),
      'infoClass' => self::createClassFromFilename($data['infoFile'], $directory),
      'configClass' => self::createClassFromFilename($data['configFile'], $directory)
    ]);
  }

  private static function createClassFromFilename(string $filename, string $directory): string {
    return strtr(self::ENGINE_NAMESPACE, [
      '%{DIRECTORY}' => $directory,
      '%{CLASS_NAME}' => explode('.', $filename)[0]
    ]);
  }

  public function info(): EngineInfoData {
    return $this->infoObject ??= (new $this->infoClass)();
  }

}