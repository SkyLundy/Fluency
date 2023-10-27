<?php

declare(strict_types=1);

namespace Fluency\DataTransferObjects;

use \BadMethodCallException;
use \InvalidArgumentException;
use Fluency\App\FluencyErrors;
use JsonSerializable;


/**
 * Data transfer objects are immutable representations of data that are passed between methods
 * which return consumable data. All methods have return value type hinting and are strictly
 * checked. This creates predictability when extending or creating from the Fluency module
 */

abstract class FluencyDTO implements JsonSerializable {

  /**
   * The correct way to instantiate a DataTransferObject
   *
   * Reference the inheriting class' constructor for specific values expected, their types, and
   * which are required/optional
   *
   * @param array<string, mixed> $values
   * @return self
   */
  abstract public static function fromArray(array $values): self;

  /**
   * Returns object data as an array intended for consumption determined on the DTO's role
   * When a DTO object is converted to JSON, the array that this returns will be used
   *
   * This can be overridden by inheriting objects to return structured data, it is recommended that
   * static::toArray() is called to recursively convert all nested FluencyDTO objects to
   * arrays
   *
   * @return array<string, mixed>
   */
  public function toArray(): array {
    return array_map(
      fn($property) => $property instanceof self ? $property->toArray() : $property,
      get_object_vars($this)
    );
  }

  /**
   * Implements JsonSerializable
   */
  #[\ReturnTypeWillChange]
  public function jsonSerialize(): array {
    return $this->toArray();
  }

  /**
   * Equivalency check. Compares class instance and array
   * Override for more specific behavior on a per-DTO basis
   *
   * @param  FluencyDTO $object Object to compare to
   */
  public function equals(FluencyDTO $object): bool {
    $thisObjectsValues = $this->toArray();
    $thatObjectsValues = $object->toArray();

    ksort($thisObjectsValues);
    ksort($thatObjectsValues);

    return $thisObjectsValues == $thatObjectsValues && $object instanceof $this;
  }


  /**
   * Checks that an error passed to a DataTransferObject uses a constant value defined in FluencyErrors
   * @param  array  $data Data transfer object data
   * @param  string $key  Array key that should be analyzed as an error
   * @return void
   * @throws InvalidArgumentException If error is not defined in FluencyErrors
   */
  protected static function getMessageIfErrorPresent(array $data): ?string {
    $error = $data['error'] ?? null;

    if (!$error) {
      return null;
    }

    !in_array($error, FluencyErrors::getDefinedErrors(), true) && throw new InvalidArgumentException(
      "Errors must be defined in FluencyErrors. '{$error}' not found."
    );

    return FluencyErrors::getMessage($error);
  }
}