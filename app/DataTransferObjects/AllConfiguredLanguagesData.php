<?php

/**
 * Contains all configured languages as an array of ConfiguredLanguageData
 *
 * Adds additional methods that provide a better interface for working with configured languages
 * than a simple array
 */

declare(strict_types=1);

namespace Fluency\DataTransferObjects;

use Countable;

// Not working with pure namespace 'use' statements
require_once __DIR__ . '/../Functions/typeChecking.php';

use function Fluency\Functions\arrayContainsOnlyInstancesOf;

final class AllConfiguredLanguagesData extends FluencyDTO implements Countable
{
    /**
     * @param array<ConfiguredLanguageData> $languages All languages configured in ProcessWire
     */
    private function __construct(
        public readonly array $languages
    ) {}

    /**
     * {@inheritdoc}
     */
    public static function fromArray(array $data): self
    {
        $languages = $data['languages'] ?? [];

        arrayContainsOnlyInstancesOf(
            $languages,
            ConfiguredLanguageData::class,
            "Languages array must only contain instances of ConfiguredLanguageData"
        );

        return new self(languages: $languages);
    }

    /**
     * Gets the default language configured in Fluency
     * @return ConfiguredLanguageData|null
     */
    public function getDefault(): ?ConfiguredLanguageData
    {
        return array_reduce(
            $this->languages,
            fn($match, $lang) => $match = $lang->default ? $lang : $match
        );
    }

    /**
     * Set the default language by ID
     */
    public function setDefault(int|string $processWireIdOrName): self
    {
          $languages = array_map(function($language) use ($processWireIdOrName) {
            // If this language is currently the default language, create a new language data object and
            // set isDefault to false
            if ($language->default) {
              return ConfiguredLanguageData::fromArray([
                    ...$language->toArray(),
                    'default' => false,
                    'engineLanguage' => $language->engineLanguage,
                ]);
            }

            // Assuming you want this language to be the default language
            // This is assuming the name of your language in ProcessWire is 'french'
            if ($language->id === $processWireIdOrName || $language->name === $processWireIdOrName) {
              return ConfiguredLanguageData::fromArray([
                    ...$language->toArray(),
                    'default' => true,
                    'engineLanguage' => $language->engineLanguage,
                ]);
            }

            return $language;
          }, $this->languages);

          return self::fromArray(['languages' => $languages]);
    }

    /**
     * Gets the current language if it's configured in Fluency
     * @return ConfiguredLanguageData|null
     */
    public function getCurrent(): ?ConfiguredLanguageData
    {
        return array_reduce(
            $this->languages,
            fn($match, $lang) => $match = $lang->isCurrentLanguage ? $lang : $match
        );
    }

    /**
     * Returns all languages excluding the default languages
     * @return AllConfiguredLanguagesData
     */
    public function withoutDefault(): self
    {
        $languages = array_filter($this->languages, fn($language) => !$language->default);

        return new self($languages);
    }

    /**
     * Gets a configured language by it's title in ProcessWire, case insensitive
     * Will return null if an ID exists in ProcessWire but is not configured in Fluency is passed
     * @param  string $title One or more titles of ProcessWire languages
     * @return ConfiguredLanguageData|array|null  Language data object or null if string passed,
     *                                            otherwise array
     */
    public function getByProcessWireId(int|array $id): ConfiguredLanguageData|null|array
    {
        $ids = (array) $id;

        $result = array_filter($this->languages, fn($language) => in_array($language->id, $ids));

        if (is_array($id)) {
            return array_values($result);
        }

        return count($result) ? end($result) : null;
    }

    /**
     * Gets configured languages by one or more ProcessWire titles, case insensitive
     * Will return null if a title exists in ProcessWire but is not configured in Fluency is passed
     * @param  string $title One or more titles of ProcessWire languages
     * @return ConfiguredLanguageData|array|null  Language data object or null if string passed,
     *                                            otherwise array
     */
    public function getByProcessWireTitle(string|array $title): ConfiguredLanguageData|null|array
    {
        $titles = array_map('strtolower', (array) $title);

        $result = array_filter(
            $this->languages,
            fn($language) => in_array(strtolower($language->title), $titles)
        );

        if (is_array($title)) {
            return array_values($result);
        }

        return count($result) ? end($result) : null;
    }

    /**
     * Gets one or more configured languages source language codes, case insensitive
     * @param  string $code                       Language code used by translation engine,
     * @return ConfiguredLanguageData|array|null  Language data object or null if string passed,
     *                                            otherwise array
     */
    public function getBySourceCode(string|array $code): ConfiguredLanguageData|null|array
    {
        $codes = array_map('strtolower', (array) $code);

        $result = array_filter(
            $this->languages,
            fn($language) => in_array(strtolower($language->engineLanguage->sourceCode), $codes)
        );

        if (is_array($code)) {
            return array_values($result);
        }

        return count($result) ? end($result) : null;
    }

    /**
     * Get a configured language by one or more target language codes, case insensitive
     * @param  string|array<string> $code Language code(s) used by translation engine
     * @return ConfiguredLanguageData|array|null  Language data object or null if string passed,
     *                                            otherwise array
     */
    public function getByTargetCode(string|array $code): ConfiguredLanguageData|null|array
    {
        $codes = array_map('strtolower', (array) $code);

        $result = array_filter(
            $this->languages,
            fn($language) => in_array(strtolower($language->engineLanguage->targetCode), $codes)
        );

        if (is_array($code)) {
            return array_values($result);
        }

        return count($result) ? end($result) : null;
    }

    /**
     * Get one or more configured languages by translation engine source name or array of names
     * Case insensitive
     * @param  string|array<string> $name Translation engine language name(s)
     * @return ConfiguredLanguageData|array|null  Language data object or null if string passed,
     *                                            otherwise array
     */
    public function getBySourceName(string|array $name): ConfiguredLanguageData|null|array
    {
        $names = array_map('strtolower', (array) $name);

        $result = array_filter(
            $this->languages,
            fn($language) => in_array(strtolower($language->engineLanguage->sourceName), $names)
        );

        if (is_array($name)) {
            return array_values($result);
        }

        return count($result) ? end($result) : null;
    }

    /**
     * Get a configured language by one or more target translation engine names, case insensitive
     * @param  string|array<string> $name Target translation engine name or array of names
     * @return ConfiguredLanguageData|array|null  Language data object or null if string passed,
     *                                            otherwise array
     */
    public function getByTargetName(string|array $name): ConfiguredLanguageData|null|array
    {
        $names = array_map('strtolower', (array) $name);

        $result = array_filter(
            $this->languages,
            fn($language) => in_array(strtolower($language->engineLanguage->targetName), $names)
        );

        if (is_array($name)) {
            return array_values($result);
        }

        return count($result) ? end($result) : null;
    }

    /**
     * Countable interface method
     */
    public function count(): int
    {
        return count($this->languages);
    }
}
