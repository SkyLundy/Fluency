<?php

declare(strict_types=1);

namespace Fluency\Functions;

/**
 * Functions used to create, parse, and check Translation Engine config names that are used by
 * Fluency to create unique configs for each Engine separately
 *
 * Kept here in a general file to manage how the names are created and what their structure is
 */

use Fluency\DataTransferObjects\EngineInfoData;
use UnexpectedValueException;

/**
 * Creates a language config name that is used for per-Translation Engine configs within Fluency
 */
function createLanguageConfigName(int $processWireId, EngineInfoData $engineInfo): string {
  preg_match('/([^A-Za-z0-9-_])/', $engineInfo->configId, $invalidChars);

  if ($invalidChars) {
    throw new UnexpectedValueException(
      "Engine config keys must only contain alphanumeric characters, hyphens, and underscores"
    );
  }

  return "pw_language_{$processWireId}_{$engineInfo->configId}";
}

/**
 * Parses a language config property name and returns it's components
 * Returns null if the config name is not a language config name
 */
function parseLanguageConfigName(string $configProperty): ?array {
  $configComponents = explode('_', $configProperty);
  $componentCount = count($configComponents);

  if ($componentCount > 3 || $componentCount > 3 || substr_count($configProperty, '_') !== 2) {
    return null;
  }

  [$prefix, $id, $engineConfigId] = $configComponents;

  $id = (int) $id;

  if ($id === 0 || $prefix !== 'pw_language') {
    return null;
  }

  return [
    'prefix' => $prefix,
    'processWireId' => $id,
    'engineConfigId' => $engineConfigId
  ];
}

/**
 * Parses a given config property name to determine if it is a language config name
 *
 * @param  mixed  $configProperty Config name
 * @return boolean
 */
function isLanguageConfigName(mixed $configProperty): bool {
  if (!is_string($configProperty)) {
    return false;
  }

  return (bool) parseLanguageConfigName($configProperty);
}