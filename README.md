# Fluency - The complete translation enhancement suite for ProcessWire

Fluency is a module that brings third party translation services to the ProcessWire CMF/CMS with a user friendly interface for translating content in any multi-language field on any page. It also provides powerful tools to help developers create multilanguage sites and apps faster.

Fluency can be added to new websites in development, existing websites adding multi-language abilities, or to websites that already have multi-language capabilities where it is desireable to have high quality translation built in.

You can help out by filing Github issues when bugs are found, or submit a pull request with fixes.

## Requirements

- ProcessWire >= 3.0.2
- PHP >= 8.1
- Module dependencies: ProcessLanguage, LanguageSupport, LanguageTabs
- UIKit admin theme
- At least 2 languages configured in ProcessWire (the default, and at least one other, no limit on how many are added) to add translation to fields
- An API key for the Translation Engine selected on the module config page

## Features & Module Details

Fluency can translate content in any type of field on any page. These include:

- Plain textarea or text
- CKEditor content (Regular, Inline)
- TinyMCE content (Regular, Inline)
- Image/file descriptions
- Page names/URLs
- Tables
- Repeater/repeater matrix

Fluency also provides a standalone translation tool located as an item in the admin menu bar that can be accessed from any page, or by clicking the translation icon next to the translate buttons located under fields. This tool will translate from/to any language that the translation service offers, regardless of whether the languages have been configured in ProcessWire or Fluency. This is also accessible by clicking the language icon next to any field translate button;

Methods to render HTML markup for your front end are also provided to help make converting a website to a multi-language site faster and easier.
etc. can all be translated into the language the website is built in.

Translation service usage can be controlled by enabling the user permission requirement on the module config page and assigning the `fluency-translate` permission.

### Modified Content Indication

When content in a ProcessWire field changes, Fluency adds a green line will the top of the language tab for that field. If the content is reverted to it's original value, the indicating line is removed. This lets users who are editing and translating content know which fields have been changed without clicking to another language tab to see that it has changed to help prevent content deviation between langauges.

### Site & Core Translation Files

Translating your files, such as templates using the `__()` function, site modules, and core modules is very easy with Fluency. In your ProcessWire admin, navigate to a langauge page, use the "Find Files To Translate Button", select your files, and edit the translations. The field for each value will have a button which translates the string above the field to the language you are currently editing.

For extra speed, use the "Click To Translate All" button at the top. This will translate all values on the page simultaneously in seconds.

Using these methods, it is possible for you to translate the ProcessWire admin, as well as your template language strings, in minutes rather than hours.

Please keep in mind that translating site and core modules _may_ be relatively expensive operations with respect to your API usage. It is recommended that you identify the module files that are in use and that the end user will interact with then prioritize those first.

### Caching

#### Caching - Translations

All translations are cached by default for a period of one month. This helps reduce API account usage where the same content is translated more than once and significantly increases translation speed. Caching can be toggled on/off on the Fluency module config page. The translation cache can also be manually cleared either on the module config page, via the Fluency API using `$fluency` in your code, or via an AJAX request to the Fluency admin REST API- usage is documented below.

Translation caching relies on _exact_ value matching including punctuation, spelling, and capitalization. This ensures that an exact translation is always returned accurately.

#### Caching - Translatable Languages

Fluency uses lists of recognized languages from the selected third party translation service to determine what languages to make available when configuring and using Fluency.

PLEASE NOTE: **This is cached forever until manually cleared** the first time that a translation engine is selected/configured to increase the speed of Fluency's operations.

Available languages are cached on a per-engine basis. This means that if a translation service adds additional translatable languages, this cache must be cleared on the module config page, via the Fluency API using `$fluency` in your code, or via an AJAX request to the Fluency admin REST API- usage is documented below.

### Changes and Upgrades

Adding, upgrading, or removing Fluency from your ProcessWire application will not affect or remove content. At most, you _may_ (but not always) need to reconfigure your translation settings. Settings are saved individually for each translation engine, so it is possible to switch between engines without losing your configurations for each. Be sure to review the Fluency module config page after upgrading to configure new features and ensure that your existing settings were not affected.

Review the `CHANGELOG.md` file for an always up-to-date list of features and changes.

## Translation Engines

Fluency is modular in that it contains a framework for adding additional third party services as "Translation Engines". You can choose which Translation Engine you prefer and provide the credentials to connect via their API. Currently Fluency has the ability to use [DeepL](https://www.deepl.com) and [Google Cloud](https://cloud.google.com/translate). Each have their strengths, however not all features exist for all engines as Fluency relies on what abilities are available via each translation service, so review each and choose the one that is right for your project.

As this project is open source, contributions for new third party services as Translation Engines are welcome!

Developer documentation for integrating third party translation services as Translation Engines is located in `Fluency/app/Engines/DEVDOC.md`. Documentation is a WIP. If you are interested in developing a Translation Engine for Fluency and want more info, feel free to send me a PM on the ProcessWire forum.

### Third Party Translation Services

Fluency may require credentials, such as an API key, for the third party service associated with a Translation Engine. When a Translation Engine is selected, service-specific information, settings, and necessary authentication details will be shown on the Fluency module config page.

## Instructions

1. Download and unzip the contents into /site/modules, or install from the [ProcessWire Modules directory](https://processwire.com/modules/fluency/).
2. Install the module in the developer admin
3. Open the module configuration page, choose a Translation Engine and save
4. Complete the Translation Engine setup
5. Create language associations and save

All multi-language fields will now have click to translate buttons and a translator tool is available in the Admin menu bar.

If no langauges are present in ProcessWire or if languages are present and not configured with Fluency, it is still possible to use the translator tool in the Admin menu as long as a valid API key is present and the current user has the Fluency permission.

### Localizing the Fluency UI

All text for the Fluency UI elements can be translated including messages, errors, and elements users use to interact with Fluency. This is done through ProcessWire's language setup. In the Admin visit Setup->Languages, and the "Find Files To Translate" feature within the language management page.

All translatable texts are located in `Fluency/app/FluencyLocalization.php`

## Multi-Language Markup Rendering

Fluency provides tools to help make building websites with multi-language capabilities faster and easier. There are HTML best practices that help users with accessibility and improve SEO performance, many of these are available out of the box with Fluency.

### Current Language Code

An HTML best practice is to indicate the current language of the page including the `lang` attribute on the `<html>` tag. Fluency can output the code for the current language as provided by the Translation Engine.

Language names and ARIA attributes are automatically localized when you configure Fluency and use the ProcessWire core translation pages to translate the module.

To get the code for the language the page is currently being viewed in:

```html
<!doctype html>
<html lang="<?= $fluency->getLanguageCode(); ?>">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title><?php $page->title; ?></title>
  </head>
</html>
```

You can also get the language code for another language that is configured in Fluency by passing it's ProcessWire ID:

```php
$fluency->getLanguageCode(1034); // 'de'
```

### Language Meta Tags

Fluency van render a list of languages `<link>` tags that you can use in the `<head>` of your HTML document. This helps users and search engines find the content for your page in all languages. The URLs will render as configured in ProcessWire.

To render the tags:

```html
<!doctype html>
<html lang="<?= $fluency->getLanguageCode(); ?>">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title><?php $page->title; ?></title>
    <?= $fluency->renderAltLanguageMetaLinkTags(); ?>
  </head>
</html>
```

Output:

```html
<!doctype html>
<html lang="en-us">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title><?= $page->title; ?></title>
    <link rel="alternate" hreflang="https://awesomewebsite.com/" href="x-default" />
    <link rel="alternate" hreflang="https://awesomewebsite.com/" href="en-us" />
    <link rel="alternate" hreflang="https://awesomewebsite.com/fr/" href="fr" />
    <link rel="alternate" hreflang="https://awesomewebsite.com/de/" href="de" />
    <link rel="alternate" hreflang="https://awesomewebsite.com/it/" href="it" />
    <link rel="alternate" hreflang="https://awesomewebsite.com/es/" href="es" />
  </head>
</html>
```

### Language Select Element

You can easily render a `<select>` element that will allow a user to choose the langauge that they are currently viewing the page in. By default, Fluency will also render inline JavaScript that will navigate to the page in the language selected but this can be disabled should you want to control that behavior yourself. All text/labels/values will render if translated in the current language.

```html
<div class="language-select"><?= $fluency->renderLanguageSelect() ?></div>
```

Output:

```html
<div class="language-select">
  <select
    id=""
    class="ft-language-select "
    aria-label="Select Language"
    onchange="(function(el){window.location=el.value})(this)"
  >
    <option value="/" selected="">English</option>
    <option value="/fr/">French</option>
    <option value="/de/">German</option>
    <option value="/it/">Italian</option>
    <option value="/es/">Spanish</option>
  </select>
</div>
```

With options:

```html
<div class="language-select">
  <?= $fluency->renderLanguageSelect( addInlineJs: false, id: 'my-custom-id', classes: ['some',
  'classes'] ) ?>
</div>
```

Output:

```html
<div class="language-select">
  <select id="my-custom-id" class="ft-language-select some classes" aria-label="Select Language">
    <option value="/" selected="">English</option>
    <option value="/fr/">French</option>
    <option value="/de/">German</option>
    <option value="/it/">Italian</option>
    <option value="/es/">Spanish</option>
  </select>
</div>
```

### Language Links

You can also render an unordered list of links to the current page in other languages.

```html
<div class="language-list"><?= $fluency->renderLanguageLinks(); ?></div>
```

Output:

```html
<div class="language-list">
  <ul>
    <li><a class="active" href="/">English</a></li>
    <li><a href="/fr/">French</a></li>
    <li><a href="/de/">German</a></li>
    <li><a href="/it/">Italian</a></li>
    <li><a href="/es/">Spanish</a></li>
  </ul>
</div>
```

With options:

```html
<div class="my-element">
  <?= $fluency->renderLanguageLinks( id: 'my-language-links', classes: ['my-class'], divider: '|',
  activeClass: 'current'); ?>
</div>
```

Output:

```html
<div class="my-element">
  <ul id="my-language-links" class="my-class">
    <li><a class="current" href="/">English</a></li>
    <li>|</li>
    <li><a href="/fr/">French</a></li>
    <li>|</li>
    <li><a href="/de/">German</a></li>
    <li>|</li>
    <li><a href="/it/">Italian</a></li>
    <li>|</li>
    <li><a href="/es/">Spanish</a></li>
  </ul>
</div>
```

## Using Fluency Programatically

Fluency can be accessed anywhere in ProcessWire using the `$fluency` variable. The following are some simple examples. For more in-depth details, review the docblocks for each method in `Fluency.module.php`.

Fluency is fully documented and formatted for the API Explorer tool in the outstanding (and personally recommended) [ProDevTools](https://processwire.com/talk/store/product/22-prodevtools/) module.

All methods return [Data Transfer Objects](https://medium.com/@sjoerd_bol/how-to-use-data-transfer-objects-dtos-for-clean-php-code-3bbd47a2b3ab) that are immutable and predictable in structure and features. All values can be accessed via:

- Object properties
- Be converted to an array using the `toArray()` method
- Encoded to json directly using `json_encode()`

### Translating Content

```php
$translation = $fluency->translate(
  string $sourceLanguage,  // Language code used by the translation service
  string $targetLanguage,  // Language code used by the translation service
  array|string $content,   // String or array of strings to translate
  array|null $options,     // Translation Engine specific options
  bool $caching            // Override default caching behavior, false disables caching
);

// This method returns an immutable EngineTranslationData object
//
// $translation->toArray(); Outputs the following:
//
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

count($translation); // 1
```

### Translatable Languages

This method returns all translatable languages that the current translation service recognizes. The codes for each language are used when calling `$fluency->translate()`;

```php
$translatableLanguages = $fluency->getTranslatableLanguages();

// This method returns an immutable EngineTranslatableLanguagesData object
//
// $translatableLanguages->toArray(); Outputs the following:
//
//array(5) {
//   ["languages"]=>
//   array(31) {
//     [0]=>
//     object(Fluency\DataTransferObjects\EngineLanguageData)#2667 (7) {
//       ["sourceName"]=>
//       string(6) "Danish"
//       ["sourceCode"]=>
//       string(2) "DA"
//       ["targetName"]=>
//       string(6) "Danish"
//       ["targetCode"]=>
//       string(2) "DA"
//       ["meta"]=>
//       array(1) {
//         ["supports_formality"]=>
//         bool(false)
//       }
//       ["error"]=>
//       NULL
//       ["message"]=>
//       NULL
//     }
//     [1]=>
//     object(Fluency\DataTransferObjects\EngineLanguageData)#2668 (7) {
//       ["sourceName"]=>
//       string(5) "Dutch"
//       ["sourceCode"]=>
//       string(2) "NL"
//       ["targetName"]=>
//       string(5) "Dutch"
//       ["targetCode"]=>
//       string(2) "NL"
//       ["meta"]=>
//       array(1) {
//         ["supports_formality"]=>
//         bool(true)
//       }
//       ["error"]=>
//       NULL
//       ["message"]=>
//       NULL
//     }
//     [2]=>
//     object(Fluency\DataTransferObjects\EngineLanguageData)#2669 (7) {
//       ["sourceName"]=>
//       string(7) "English"
//       ["sourceCode"]=>
//       string(2) "EN"
//       ["targetName"]=>
//       string(18) "English (American)"
//       ["targetCode"]=>
//       string(5) "EN-US"
//       ["meta"]=>
//       array(1) {
//         ["supports_formality"]=>
//         bool(false)
//       }
//       ["error"]=>
//       NULL
//       ["message"]=>
//       NULL
//     }
//     // ... Removed rest of languages for brevity
//   }
//   ["fromCache"]=>
//   bool(true)
//   ["retrievedAt"]=>
//   string(25) "2023-10-27T04:12:12-07:00"
//   ["error"]=>
//   NULL
//   ["message"]=>
//   NULL
// }

// Additional methods are available as well, each return their own DTO

$danish = $translatableLanguages->bySourceCode('DA');             // => EngineLanguageData for Danish
$americanEnglish = $translatableLanguages->byTargetCode('EN-US'); // => EngineLanguageData for English

// Get the total number of translatable languages
count($translatableLanguages); // => 31

```

### Configured Languages

Get all languages in ProcessWire that are configured in Fluency. This method packages all available
language data from both ProcessWire and Fluency, which in certain instances may make it valuable
to use in place of the ProcessWire `$languages` object.

```php
$configuredLanguages = $fluency->getConfiguredLanguages();

// Returns an immutable AllConfiguredLanguagesData instance
//
// $translatableLanguages->toArray(); Outputs the following:
//
// array(1) {
//   ["languages"]=>
//   array(6) {
//     [0]=>
//     object(Fluency\DataTransferObjects\ConfiguredLanguageData)#381 (7) {
//       ["id"]=>
//       int(1017)
//       ["title"]=>
//       string(7) "English"
//       ["default"]=>
//       bool(true)
//       ["isCurrentLanguage"]=>
//       bool(true)
//       ["engineLanguage"]=>
//       object(Fluency\DataTransferObjects\EngineLanguageData)#380 (7) {
//         ["sourceName"]=>
//         string(7) "English"
//         ["sourceCode"]=>
//         string(2) "EN"
//         ["targetName"]=>
//         string(18) "English (American)"
//         ["targetCode"]=>
//         string(5) "EN-US"
//         ["meta"]=>
//         array(1) {
//           ["supports_formality"]=>
//           bool(false)
//         }
//         ["error"]=>
//         NULL
//         ["message"]=>
//         NULL
//       }
//       ["error"]=>
//       NULL
//       ["message"]=>
//       NULL
//     }
//     [1]=>
//     object(Fluency\DataTransferObjects\ConfiguredLanguageData)#384 (7) {
//       ["id"]=>
//       int(1028)
//       ["title"]=>
//       string(6) "French"
//       ["default"]=>
//       bool(false)
//       ["isCurrentLanguage"]=>
//       bool(false)
//       ["engineLanguage"]=>
//       object(Fluency\DataTransferObjects\EngineLanguageData)#383 (7) {
//         ["sourceName"]=>
//         string(6) "French"
//         ["sourceCode"]=>
//         string(2) "FR"
//         ["targetName"]=>
//         string(6) "French"
//         ["targetCode"]=>
//         string(2) "FR"
//         ["meta"]=>
//         array(1) {
//           ["supports_formality"]=>
//           bool(true)
//         }
//         ["error"]=>
//         NULL
//         ["message"]=>
//         NULL
//       }
//       ["error"]=>
//       NULL
//       ["message"]=>
//       NULL
//     }
//     // ...omitted for brevity
//   }
// }

// Additional methods are available as well, each return their own DTO. Examples based on the return
// value above:

$configuredLanguages->getDefault();                         // => EngineLanguageData for English
$configuredLanguages->getCurrent();                         // => EngineLanguageData for English
$configuredLanguages->getByProcessWireId(1028)              // => EngineLanguageData for French
$configuredLanguages->getBySourceCode('FR')                 // => EngineLanguageData for French
$configuredLanguages->getByTargetCode('EN-US')              // => EngineLanguageData for English
$configuredLanguages->getBySourceName('French')             // => EngineLanguageData for French
$configuredLanguages->getByTargetname('English (American)') // => EngineLanguageData for English

// This makes it trivial to get the short code for a ProcessWire language
$configuredLanguages->getByProcessWireId(1028)->targetCode; // => FR

// Get the number of ProcessWire langauges configured in Fluency
count($configuredLanguages); // => 6
```

### API Usage

Get API usage (must be supported by the translation engine in use):

```php
$usage = $fluency->getTranslationApiUsage();

// Returns an immutable EngineApiUsageData instance
//
// $usage->toArray(); Outputs the following:
//
// array(7) {
//   ["used"]=>
//   int(222822)
//   ["limit"]=>
//   int(500000)
//   ["remaining"]=>
//   int(277178)
//   ["percentUsed"]=>
//   string(3) "45%"
//   ["unit"]=>
//   string(9) "Character"
//   ["error"]=>
//   NULL
//   ["message"]=>
//   NULL
// }
```

### Translation Engine

Get information about the current translation engine in use

```php
$engineInfo = $fluency->getTranslationEngineInfo();

// Returns an instance of EngineInfoData
//
// $engineInfo->toArray() outputs the following:
//
// array(12) {
//   ["name"]=>
//   string(5) "DeepL"
//   ["version"]=>
//   string(3) "1.1"
//   ["provider"]=>
//   string(5) "DeepL"
//   ["providerApiVersion"]=>
//   string(3) "2.0"
//   ["providerApiDocs"]=>
//   string(31) "https://www.deepl.com/docs-api/"
//   ["configId"]=>
//   string(64) "f71ee845229943abd3e5863227d5706600f472b3d31b4de4768878a072b681f1"
//   ["providesUsageData"]=>
//   bool(true)
//   ["details"]=>
//   string(645) "{Engine description as shown on the Fluency config page}"
//   ["authorName"]=>
//   string(8) "FireWire"
//   ["authorUrl"]=>
//   string(51) "https://processwire.com/talk/profile/3976-firewire/"
//   ["error"]=>
//   NULL
//   ["message"]=>
//   NULL
// }
```

### Caching

Get the current number of cached translations:

```php
$fluency->getCachedTranslationCount(); // Int
```

Clear the translation cache:

```php
$fluency->clearTranslationCache(); // 0 on success
```

Check if the list of languages translatable by the translation engine are cached:

```php
$fluency->translatableLanguagesAreCached(); // Boolean
```

Clear the translatable languages cache:

```php
$fluency->clearTranslatableLanguagesCache(); // 0 on success
```

### Admin Fluency REST API Endpoints

AJAX calls can be made to endpoints in the ProcessWire admin to interact with Fluency. The current user must have the `fluency-translate` permission. Refer to `Fluency.module.php` method docblocks to review accepted methods and responses. Base admin URL will match your ProcessWire installation.

```php
$endpoints = $fluency->getApiEndpoints();

// Returns a stdClass object
//
// object(stdClass)#376 (6) {
//   ["endpoints"]=>
//   string(19) "/processwire/fluency/api/"
//   ["usage"]=>
//   string(25) "/processwire/fluency/api/usage/"
//   ["translation"]=>
//   string(31) "/processwire/fluency/api/translation/"
//   ["languages"]=>
//   string(29) "/processwire/fluency/api/languages/"
//   ["translationCache"]=>
//   string(37) "/processwire/fluency/api/cache/translations"
//   ["translatableLanguagesCache"]=>
//   string(34) "/processwire/fluency/api/cache/languages"
// }
```

## Known Limitations

- The browser plugin for Grammarly may conflict with Fluency and is a known issue for many web apps. If you encounter issues, the solution is to either disable Grammarly while using Fluency in the ProcessWire admin, or log into the admin in a private browser window where Grammarly may not be running. Consider disabling Grammarly for the website you are editing content on when in the admin. Instructions provided by Grammarly [here](https://support.grammarly.com/hc/en-us/articles/115000091612-Turn-off-Grammarly-on-one-or-more-websites).

## Cost

Fluency is free to use. There is no cost for this module and it can be used on any site that you build with ProcessWire. This module is provided as a thank you to the outstanding ProcessWire community and as a contribution alongside other module developers who help everyone build great websites and applications.

## Supporting Module Development

Module development is both a lot of work and an important contribution to the ProcessWire ecosystem. Developers who offer both free and paid modules spend many hours creating and maintaining our favorite tools we all use for ProcessWire projects.

You can support module development by giving the Github repo a star, donating, or contributing to development with pull requests. If you find yourself reaching for a module that you can't live without, or if a module fulfills a need for a client request, consider donating or sponsoring a developer or their projects.

While this message is for the ProcessWire community on behalf of all module developers, if you've found Fluency useful and think it's worth a cup of coffee, you can [send me something via PayPal](https://paypal.me/noonesboy).
