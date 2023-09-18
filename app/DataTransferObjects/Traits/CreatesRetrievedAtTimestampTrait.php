<?php

declare(strict_types=1);

namespace Fluency\DataTransferObjects\Traits;

trait CreatesRetrievedAtTimestampTrait {

  /**
   * Creates a timestamp for retrieved data
   */
  protected static function newRetrievedAtTimestamp(): string {
    return date('c', time());
  }

}