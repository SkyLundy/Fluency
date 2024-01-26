<?php

declare(strict_types=1);

namespace Fluency\DataTransferObjects;

use Fluency\DataTransferObjects\FluencyDTO;
use Fluency\DataTransferObjects\Traits\ValidatesErrorsTrait;

final class EngineApiUsageData extends FluencyDTO {

  use ValidatesErrorsTrait;

  /**
   * @param int         $used        Amount used
   * @param int         $limit       Usage limit
   * @param string      $unit        Unit of usage measure (characters, words, etc.)
   * @param string      $percentUsed Usage as a percentage of total
   * @param string      $remaining   Remaining
   * @param string|null $error       Error encountered, use App\FluencyErrors
   * @param string|null $message     Error message if present
   */
  private function __construct(
    public readonly int $used,
    public readonly int $limit,
    public readonly int|string $remaining,
    public readonly string $percentUsed,
    public readonly string $unit,
    public readonly ?string $error,
    public readonly ?string $message,
  ) {}

  /**
   * {@inheritdoc}
   */
  public static function fromArray(array $data): self {
    self::validateErrorIfPresent($data, 'error');

    return new self(...[
      'error' => null,
      'used' => 0,
      'limit' => 0,
      ...$data,
      'percentUsed' => self::calculatePercentUsed($data),
      'remaining' => self::calculateRemaining($data),
      'message' => self::getMessageIfErrorPresent($data)
    ]);
  }

  /**
   * Gets the remaining number of characters calculated from usage
   */
  private static function calculateRemaining(array $data): int {
    return empty($data['limit']) ? 0 : $data['limit'] - $data['used'];
  }

  /**
   * Calculates the percentage of usage
   */
  private static function calculatePercentUsed(array $data): string {
    return empty($data['limit']) ? 'N/A' :  round($data['used'] / $data['limit'] * 100) . '%';
  }

}