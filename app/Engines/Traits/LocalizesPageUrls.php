<?php

declare(strict_types=1);

namespace Fluency\Engines\Traits;

use DOMDocument;

use function \ProcessWire\wire;

trait LocalizesPageUrls {

  /**
   * Localizes URLs in an array of translated texts
   * @param  array   $translations       Translated content
   * @param  string  $targetLanguageCode Language to translate to
   * @return array                Translated content with localized ProcessWire page URLs
   */
  protected function localizePageUrlsInTranslations(
    array $translations,
    string $targetLanguageCode
  ): array {
    return array_map(
      fn($translation) => $this->localizePageUrlsInTranslation($translation, $targetLanguageCode),
      $translations
    );
  }

  /**
   * Localizes URLs in a translated string
   * @param  string $translation Translated content
   * @return string              Translated content with localized ProcessWire page URLs
   */
  protected function localizePageUrlsInTranslation(
    string $translation,
    string $targetLanguageCode
  ): string {
    // Don't bother with an empty string
    if (!$translation) {
      return $translation;
    }

    $dom = new DOMDocument();

    // https://stackoverflow.com/questions/61995451/how-to-prevent-domdocument-from-wrapping-result-in-p-tags
    $translation = "<div>{$translation}</div>";

    // Suppressing errors with @ is bad, but prevents odd errors from unduely killing the party
    @$dom->loadHTML(
      mb_convert_encoding($translation, 'HTML-ENTITIES', 'UTF-8'),
      LIBXML_HTML_NOIMPLIED | LIBXML_HTML_NODEFDTD
    );

    foreach ($dom->getElementsByTagName('a') as $link) {
      $localizedLinkUrl = $this->getLocalizedLinkUrlIfExists(
        $targetLanguageCode,
        $link->getAttribute('href')
      );

      if ($localizedLinkUrl) {
        $link->setAttribute('href', $localizedLinkUrl);
      }
    }

    $output = '';

    // See reference to StackOverflow post above where content is wrapped in a <div>
    foreach ($dom->documentElement->childNodes as $childNode) {
      $output .= $dom->saveHTML($childNode);
    }

    return $output;
  }

  private function getLocalizedLinkUrlIfExists(
    string $targetLanguageCode,
    ?string $url = null
  ): ?string {
    if (!$url) {
      return null;
    }

    $parsedUrl = parse_url($url);

    // ProcessWire converts links with the site domain to relative URLs
    if (array_key_exists('scheme', $parsedUrl) || array_key_exists('host', $parsedUrl)) {
      return null;
    }

    $pageLink = wire('pages')->get($parsedUrl['path']);

    $targetLanguageId = wire('modules')->get('Fluency')
                          ->getConfiguredLanguages()
                          ->getByTargetCode($targetLanguageCode)
                          ?->id;

    if (!$pageLink || !$targetLanguageId) {
      return null;
    }

    $localizedUrl = $pageLink->localUrl($targetLanguageId);

    array_key_exists('query', $parsedUrl) && $localizedUrl .= "?{$parsedUrl['query']}";

    return $localizedUrl;
  }
}