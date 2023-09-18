<?php

declare(strict_types=1);

namespace Fluency\Components\Traits;

use Fluency\DataTransferObjects\ConfiguredLanguageData;

use function \ProcessWire\wire;

trait GeneratesFieldsetsTrait {

  /**
   * Gets the default class string for a given inputfield by name, appends additional class string
   */
  protected static function appendInputfieldClasses(
    string $inputfieldName,
    string|array ...$classes
  ): string {
    $classes = implode(' ', (array) $classes);

    return wire('modules')->get($inputfieldName)->getAttribute('class') . " {$classes}";
  }

  /**
   * Create an object containing options and attributes arrays. Use for creating fields from array
   * @param  string                   $type       'source' or 'target'
   * @param array<EngineLanguageData> $languages  List of languages from translation engine
   * @param ConfiguredLanguageData    $default    Default language to determine 'selected' attribute, optional
   */
  protected static function createLanguageSelectOptions(
    string $type,
    array $languages,
    ?ConfiguredLanguageData $default = null,
  ): object {
    return (object) array_reduce($languages, function($opts, $language) use ($default, $type) {
      $codeType = $type === 'source' ? 'sourceCode' : 'targetCode';
      $nameType = $type === 'source' ? 'sourceName' : 'targetName';

      $opts['options'][$language->$codeType] = $language->$nameType;

      if ($default && $language->equals($default->engineLanguage)) {
        $opts['attributes'][$language->$codeType] = ['selected' => true];
      }

      return $opts;
    }, ['options' => [], 'attributes' => []]);
  }

}