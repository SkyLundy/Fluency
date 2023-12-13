<?php

declare(strict_types=1);

namespace Fluency\App;

use Fluency\App\FluencyLocalization;

final class FluencyMarkup {

  /**
   * Helper method to concatenate markup to avoid needing to use PHP dot concatenation and
   * allowing passing multiple markup elements as arguments
   */
  public static function concat(string ...$elements): string {
    $markup = implode('', $elements);

    return trim($markup);
  }

  /**
   * Render a headline tag
   */
  public static function h(int $level, string $content, string|array $classes = []): string {
    $markup =<<<EOT
    <h%{LEVEL} class="%{CLASS}">%{CONTENT}</h%{LEVEL}>
    EOT;

    return self::render($markup, [
      'LEVEL' => $level,
      'CONTENT' => $content,
      'CLASS' => self::createAttributeValue($classes)
    ]);
  }

  /**
   * Render one or more <p> tags.
   */
  public static function p(string|array $values, string|array $classes = []): string {
    $markup =<<<EOT
    <p class="%{CLASS}">%{CONTENT}</p>
    EOT;

    $classes = self::createAttributeValue($classes);

    return array_reduce((array) $values, function($output, $value) use ($classes, $markup) {
      return $output .= self::render($markup, [
        'CONTENT' => $value,
        'CLASS' => $classes
      ]);
    }, '');
  }

  /**
   * Render an <a> tag.
   */
  public static function a(
    string $href,
    string $content,
    string|array|null $classes = [],
    string $target = '_self',
    string|array $rel = []
  ): string {
    $markup =<<<EOT
    <a href="%{HREF}" target="%{TARGET}" class="%{CLASS}" rel="%{REL}">%{CONTENT}</a>
    EOT;

    return self::render($markup, [
      'CONTENT' => $content,
      'HREF' => $href,
      'TARGET' => $target,
      'CLASS' => self::createAttributeValue($classes),
      'REL' => self::createAttributeValue($rel)
    ]);
  }

  /**
   * Render an <a> tag.
   */
  public static function img(
    string $source,
    ?string $alt = '',
    string|array|null $classes = []
  ): string {
    $markup =<<<EOT
    <img src="%{SOURCE}" class="%{CLASS}" alt="%{ALT}">
    EOT;

    return self::render($markup, [
      'SOURCE' => $source,
      'CLASS' => self::createAttributeValue($classes),
      'ALT' => $alt
    ]);
  }

  /**
   * Render a <ul> tag
   *
   * See FluencyMarkup::li() parameters for item structure if passed as an array of <li> configs
   *
   * @param string|array      $items May be a rendered <li> string or an array of arrays with
   *                                 properties passed to FluencyMarkup::li() as arguments
   * @param string|array|null $classes Classes added to <ul> element
   * @param string|null       $id      ID added to <ul> element
   */
  public static function ul(
    string|array $items,
    string|array|null $classes = '',
    string $id = null
  ): string {
    $markup =<<<EOT
    <ul id="%{ID}" class="%{CLASS}">
      %{ITEMS}
    </ul>
    EOT;

    $items = array_reduce((array) $items, function($markup, $item) {
      if (is_array($item)) {
        $item['classes'] ??= [];

        return $markup .= self::li(...$item);
      }

      return $markup .= $item;
    });

    return self::render($markup, [
      'ITEMS' => $items,
      'ID' => $id,
      'CLASS' => self::createAttributeValue($classes)
    ]);
  }

  /**
   * Render an <ol> tag
   *
   * See FluencyMarkup::li() parameters for item structure if passed as an array of <li> configs
   *
   * @param string|array $items May be a rendered <li> string or an array of arrays with properties
   *                            passed to FluencyMarkup::li() as arguments
   * @param string|array $classes Classes added to <ul> element
   * @param string|null  $id      ID added to <ul> element
   */
  public static function ol(
    string|array $items,
    string|array|null $classes = '',
    ?string $id = ''
  ): string {
    $markup =<<<EOT
    <ol id="%{ID}" class="%{CLASS}">
      %{ITEMS}
    </ol>
    EOT;

    $items = array_reduce((array) $items, function($markup, $item) {
      if (is_array($item)) {
        $item['classes'] ??= [];

        return $markup .= self::li(...$item);
      }

      return $markup .= $item;
    });

    return self::render($markup, [
      'ITEMS' => $items,
      'ID' => $id,
      'CLASS' => self::createAttributeValue($classes)
    ]);
  }

  /**
   * Render one or more <li> elements
   */
  public static function li(mixed $content, string|array $classes = []): string {
    $markup =<<<EOT
    <li class="%{CLASS}">%{CONTENT}</li>
    EOT;

    $classes = self::createAttributeValue($classes);

    return array_reduce((array) $content, function($output, $value) use ($classes, $markup) {
      return $output .= self::render($markup, [
        'CONTENT' => $value,
        'CLASS' => $classes
      ]);
    }, '');
  }

  /**
   * Render one or more <span> elements
   */
  public static function span(mixed $content, string|array $classes = []): string {
    $markup =<<<EOT
    <span class="%{CLASS}">%{CONTENT}</span>
    EOT;

    return array_reduce((array) $content, fn($markup, $item) => $markup .= self::render($item, [
      'CONTENT' => $content,
      'CLASS' => self::createAttributeValue($classes)
    ]), '');
  }

  /**
   * Render the markup an alternate language <link> meta tag
   */
  public static function altLanguageLink(string $hrefLang, string $href): string {
    $markup =<<<EOT
    <link rel="alternate" hreflang="%{HREFLANG}" href="%{HREF}" />
    EOT;

    return self::render($markup, [
      'HREFLANG' => $hrefLang,
      'HREF' => $href,
    ]);
  }

  /**
   * Render the markup an alternate language meta tag
   *
   * @param string|array $options       If a string, assumed to be rendered markup from
   *                                    FluencyMarkup::selectOption()
   *                                    An array may be:
   *                                    - An array of rendered FluencyMarkup::selectOption() string
   *                                    - An array of arrays each with properties/values passed to
   *                                      FluencyMarkup::selectOption() - use selectOption() parameter
   *                                      names as array property names
   * @param string|array|null $classes       Classes added to <select> element
   * @param string|null  $id            ID added to <select> element
   * @param bool|null $addInlineJs
   */
  public static function languageSelect(
    string|array $options,
    string|array|null $classes = [],
    ?string $id = null,
    ?bool $addInlineJs = true
  ): string {
    $markup =<<<EOT
    <select
      id="%{ID}"
      class="ft-language-select %{CLASS}"
      aria-label="%{ARIA_LABEL}"
      %{INLINE_JS}
    >
      %{OPTION_ELS}
    </select>
    EOT;

    $inlineJs =<<<EOT
    onchange="(function(el){window.location=el.value})(this)"
    EOT;

    // Create options from an array
    if (is_array($options)) {
      $options = array_reduce($options, function($markup, $option) {
        if (is_array($option)) {
          return $markup .= self::selectOption(
            value: $option['value'],
            label: $option['label'],
            selected: $option['selected'] ?? false,
            default: $option['default'] ?? false,
          );
        }

        return $markup .= $option;
      });
    }


    return self::render($markup, [
      'ID' => $id,
      'OPTION_ELS' => $options,
      'CLASS' => self::createAttributeValue($classes),
      'ARIA_LABEL' => FluencyLocalization::getFor('languageSelect')->label,
      'INLINE_JS' => $addInlineJs ? $inlineJs : ''
    ]);
  }

  /**
   * Render the markup an alternate language meta tag
   * @param  array  $tplVars Variables to insert into markup
   */
  public static function selectOption(
    string|int $value,
    string|int $label,
    bool $selected = false,
    bool $default = false
  ): string {
    $markup =<<<EOT
    <option value="%{VALUE}" %{SELECTED} %{DEFAULT}>%{LABEL}</option>
    EOT;

    return self::render($markup, [
      'VALUE' => $value,
      'LABEL' => $label,
      'SELECTED' => $selected ? 'selected' : '',
      'DEFAULT' => $default ? 'default' : ''
    ]);
  }

  /**
   * Helper method, just concatenates an array of strings or leaves a string alone
   */
  public static function createAttributeValue(string|array|null $value = []): string {
    return implode(' ', (array) $value);
  }

  /**
   * Gets a template file, fills in template variables, removes unused template variable placeholders
   *
   * @param  string $markup      Markup
   * @param  array  $variables   Key: VARIABLE_NAME Value: value to replace
   */
  private static function render(string $markup, ?array $variables = []): ?string {
    $variableKeys = array_keys($variables);
    $variableValues = array_values($variables);

    // Wrap each key with it's placeholder characters
    $variableKeys = array_map(fn($key) => '%{' . $key . '}', $variableKeys);

    // Re-combine modified keys and values into one array
    $variables = array_combine($variableKeys, $variableValues);

    // Get all template variable placeholders in the template that remain
    preg_match_all('/%{[^}]+}/', $markup, $templatePlaceholders);

    $emptyVars = array_fill_keys($templatePlaceholders[0], '');
    $variables = array_merge($emptyVars, $variables);

    return strtr($markup, $variables);
  }
}
