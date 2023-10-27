# Fluency - Integrated Translation for ProcessWire

Fluency is a module that brings third party translation services to the ProcessWire CMF/CMS.

Fluency can be added to new websites in development, existing websites adding multi-language abilities, or to websites that already have multi-language capabilities where it is desireable to have high quality translation built in.

**Please note, this is an beta release.** Please use in production after thorough testing for your own project and create Github issues for bugs found if possible.

Please help out by filing Github issues when bugs are found. _Your feedback will help a stable and
bug-free Fluency make it into the ProcessWire modules directory faster_.

## Requirements

Fluency has been developed and tested on ProcessWire 3.0.218

- Requires at least PHP 8.1 (is compatible with PHP 8.2+)
- Module dependencies: ProcessLanguage, LanguageSupport, LanguageTabs
- The UIKit or UIKit-based admin theme
- At least 2 languages configured in ProcessWire (the default, and at least one other, no limit on how many are added)
- An API key for the Translation Engine selected on the module config page

## Features

Fluency can translate content in any type of field on any page. These include:

- Plain textarea or text
- CKEditor content (Regular, Inline)
- TinyMCE content (Regular, Inline)
- Image/file descriptions
- Page names/URLs
- Tables
- Repeater/repeater matrix

Fluency also provides a standalone translation tool located as an item in the admin menu bar that can be accessed from any page, or by clicking the translation icon next to the translate buttons located under fields. This tool will translate from/to any language that the translation service offers, regardless of whether the languages have been configured in ProcessWire or Fluency.

Methods to render HTML markup for your front end are also provided to help make converting a website to a multi-language site faster and easier.
etc. can all be translated into the language the website is built in.

Translation service usage can be controlled by enabling the user permission requirement on the module config page and assigning the `fluency-translate` permission.

### Changes and Updates

Check out the `CHANGELOG.md` file for an always up-to-date list of features and changes.

## Translation Engines

Fluency is modular. It contains a framework for adding additional third party services as "Translation Engines". You can choose which Translation Engine you prefer and provide the credentials to connect via their API. Currently Fluency has the ability to use [DeepL](https://www.deepl.com) and [Google Cloud](https://cloud.google.com/translate)

This project is open source so contributions for new third party services via Translation Engines are welcome.

Developer documentation for integrating third party translation services as Translation Engines is located in Fluency/app/Engines/DEVDOC.md

### Third Party Translation Services

To use Fluency you must have credentials, such as an API key, for the third party service associated with a Translation Engine. When a Translation Engine is selected, service-specific information, settings, and necessary authentication details will be shown in the Fluency module config.

## Instructions

1. Download and unzip the contents into /site/modules
2. Install the module in the developer admin
3. Open the module configuration page, choose a Translation Engine and save
4. Complete the Translation Engine specific configs
5. Create language associations and save

All multi-language fields should now have click to translate buttons and a translator tool is available in the Admin menu bar.

If no langauges are present in ProcessWire or if languages are present and not configured with Fluency, it is still possible to use the translator tool in the Admin menu as long as a valid API key is present and the current user has permission to translate if permission restrictions are enabled in Fluency.

### Localizing the Fluency UI

All text for the Fluency UI elements can be translated including messages, errors, and elements users use to interact with Fluency. This is done through ProcessWire's language setup. In the Admin visit Setup->Languages, and the "Find Files To Translate" feature within the language management page.

All translatable texts are located in `Fluency/app/FluencyLocalization.php`

## Using Fluency Programatically

Fluency can be accessed anywhere in ProcessWire using the `$fluency` variable. The following are some simple examples. For more in-depth details, review the docblocks for each method in `Fluency.module.php`.

Fluency is fully documented and formatted for the API Explorer tool in the outstanding (and personally recommended) [ProDevTools](https://processwire.com/talk/store/product/22-prodevtools/) module.

All methods return [Data Transfer Objects](https://medium.com/@sjoerd_bol/how-to-use-data-transfer-objects-dtos-for-clean-php-code-3bbd47a2b3ab) that are immutable and predictable in structure and features. They can be converted to an array using the `toArray()` method, encoded to json directly using `json_encode()`, and translations can be counted using `count()`.

```php
// Translate content
//
$translation = $fluency->translate(
  string $sourceLanguageCode,        // Language code used by the translation service
  string $targetLanguageCode,        // Language code used by the translation service
  array|string $content,             // String or array of strings to translate
  array|null $options,               // Translation Engine specific options
  array|null $caching                // Substrings within content that should not be translated
);

// $translation->toArray(); Outputs the following:
// array(10) {
//   'sourceLanguage' => 'EN'
//   'targetLanguage' => 'DE'
//   'content' => [
//     'How do you do fellow developers?'
//   ],
//   'translations' => [
//     'Wie geht es Ihnen, liebe Entwickler?'
//   ],
//   'options' => [],
//   'fromCache' => true,
//   'cacheKey' => 'ff6050ab0d048f7296214bfb21f18af707954dabf4df8013f3f013bc7382a73f',
//   'retrievedAt' => '2023-09-17T17:16:25-07:00',
//   'error' => NULL,
//   'message' => NULL,
// }

```

## Known Limitations

- The browser plugin for Grammarly conflicts with Fluency. The immediate solution is to either disable Grammarly while using Fluency in the ProcessWire admin, or log into the admin in a private browser window where Grammarly may not be running. Consider disabling Grammarly for the website you are editing content on when in the admin. Instructions [here](https://support.grammarly.com/hc/en-us/articles/115000091612-Turn-off-Grammarly-on-one-or-more-websites).

## Cost

Fluency is free to use. There is no cost for this module and it can be used on any site that you build with ProcessWire.

## In Progress

This README is a work in progress.
