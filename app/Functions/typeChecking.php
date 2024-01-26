<?php

declare(strict_types=1);

namespace Fluency\Functions;

use InvalidArgumentException;
use TypeError;

/**
 * Functions used to check/verify types
 */

/**
 * Determines if an array contains only one specified type
 * @param  array        $array            Array to check
 * @param  string       $class            Class name
 * @param  string|null  $exceptionMessage If provided a TypeError exception may be thrown with this
 * @return bool|null                      Null if array is empty
 * @throws TypeError
 */
function arrayContainsOnlyInstancesOf(
  array $array,
  string $class,
  ?string $exceptionMessage = null
): ?bool {
  if (!$array) {
    return null;
  }

  $result = array_filter($array, fn($item) => $item instanceof $class);

  $passes = count($result) === count($array);

  !$passes && $exceptionMessage && throw new TypeError($exceptionMessage);

  return $passes;
}

/**
 * Determines if an array contains only one specified type
 * @param  array        $array            Array to check
 * @param  string       $type             Value type
 * @param  string|null  $exceptionMessage If provided a TypeError exception may be thrown with this
 * @return bool|null                      Null if array is empty
 * @throws InvalidArgumentException, TypeError
 */
function arrayContainsOnlyType(
  array $array,
  string $type,
  ?string $exceptionMessage = null
): ?bool {
  $types = ['boolean', 'integer', 'double', 'string', 'array', 'object', 'resource', 'NULL'];

  !in_array($type, $types) && throw new InvalidArgumentException(
    "{$type} is not a valid type. Expected one of " . implode(', ', $types)
  );

  if (!$array) {
    return null;
  }

  $result = array_filter($array, fn($item) => gettype($item) === $type);

  $passes = count($result) === count($array);

  !$passes && $exceptionMessage && throw new TypeError($exceptionMessage);

  return $passes;
}

