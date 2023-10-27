<?php

declare(strict_types=1);

namespace Fluency\DataTransferObjects\Traits;

use \InvalidArgumentException;

trait ValidatesObjectInstancesTrait {

  /**
   * @param array<mixed> $data Array of data that should only contain instances of a given class
   * @param string       $type Name of instance parent class
   * @throws InvalidArgumentException
   */
  protected static function validateArrayConainsOnlyInstancesOf(?array $data, string $type): void {
    if (!$data) {
      return;
    }

    $result = array_filter($data, fn($item) => $item instanceof $type);

    count($result) !== count($data) && throw new InvalidArgumentException(
      "Array must only contain instances of {$type}"
    );
  }
}