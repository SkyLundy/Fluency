<?php

declare(strict_types=1);

namespace Fluency\App;

/**
 * Definition of error types for error handling
 * Mimics a trait
 */

use Fluency\App\FluencyLocalization;
use InvalidArgumentException;
use \ReflectionClass;

final class FluencyErrors {

  /**
   * When an API HTTP call failed (not account or API key validity issues)
   */
  public const SERVICE_UNAVAILABLE = 'SERVICE_UNAVAILABLE';

  /**
   * API authentication failed
   */
  public const AUTHENTICATION_FAILED = 'AUTHENTICATION_FAILED';


  /**
   * API authorization failed
   */
  public const AUTHORIZATION_FAILED = 'AUTHORIZATION_FAILED';

  /**
   * Too many requests, API rate limit hit
   */
  public const RATE_LIMIT_EXCEEDED = 'RATE_LIMIT_EXCEEDED';

  /**
   * The service allocation for this account has been hit
   */
  public const QUOTA_EXCEEDED = 'QUOTA_EXCEEDED';

  /**
   * The translation service request failed
   */
  public const BAD_REQUEST = 'BAD_REQUEST';

  /**
   * The translation service request endpoint does not exist
   */
  public const NOT_FOUND = 'NOT_FOUND';

  /**
   * The translation service returned HTTP status 500
   */
  public const INTERNAL_SERVER_ERROR = 'INTERNAL_SERVER_ERROR';

  /**
   * Last resort error if no other errors fit condition, or if the API returns a useless error or
   * response
   */
  public const UNKNOWN_ERROR = 'UNKNOWN_ERROR';

  /**
   * If the Fluency module has not been configured
   */
  public const FLUENCY_NOT_CONFIGURED = 'FLUENCY_NOT_CONFIGURED';

  /**
   * A bad API request was made to the Fluency module
   */
  public const FLUENCY_BAD_REQUEST = 'FLUENCY_BAD_REQUEST';

  /**
   * An API request was made to an endpoint that does not exist
   */
  public const FLUENCY_NOT_FOUND = 'FLUENCY_NOT_FOUND';

  /**
   * An API request was made to an endpoint that does not exist
   */
  public const FLUENCY_NOT_IMPLEMENTED = 'FLUENCY_NOT_IMPLEMENTED';

  /**
   * A bad API request was made to the Fluency module
   */
  public const FLUENCY_METHOD_NOT_ALLOWED = 'FLUENCY_METHOD_NOT_ALLOWED';

  /**
   * The module cannot connect to the ProcessWire web server
   */
  public const FLUENCY_CLIENT_DISCONNECTED = 'FLUENCY_CLIENT_DISCONNECTED';

  /**
   * Invalid source language provided
   */
  public const FLUENCY_UNKNOWN_SOURCE = 'FLUENCY_UNKNOWN_SOURCE';

  /**
   * Invalid target language provided
   */
  public const FLUENCY_UNKNOWN_TARGET = 'FLUENCY_UNKNOWN_TARGET';

  /**
   * An error occurred during a Fluency module operation, check the logs, report a bug or suggest
   * an improvement if appropriate.
   */
  public const FLUENCY_MODULE_ERROR = 'FLUENCY_MODULE_ERROR';


  /**
   * Attempting to translate ProcessWire files to the default language
   */
  public const FLUENCY_PW_FILE_TO_DEFAULT_LANGUAGE = 'FLUENCY_PW_FILE_TO_DEFAULT_LANGUAGE';

  /**
   * Attempting to translate files to invalid target languages
   */
  public const FLUENCY_PW_FILE_INVALID_TARGET_LANGUAGE = 'FLUENCY_PW_FILE_INVALID_TARGET_LANGUAGE';

  /**
   * Returns an error message based on the provided error type.
   *
   * @param  string       $error A FluencyErrors constant value
   * @param  string|null  $append    A message to append
   * @return string
   */
  public static function getMessage(string $error): string {
    !in_array($error, self::getDefinedErrors()) && throw new InvalidArgumentException(
      "{$error} is not a valid Fluency Error, reference FluencyErrors.php"
    );

    return FluencyLocalization::getFor('errors')->$error;
  }

  /**
   * Returns all errors as an array of strings
   *
   * @return array<string>
   */
  public static function getDefinedErrors(): array {
    return (new ReflectionClass(self::class))->getConstants();
  }
}