# Fluency - The complete translation enhancement suite for ProcessWire

![fluency_welcome](https://github.com/SkyLundy/Fluency/assets/61801600/21a9a94d-2f70-4ba7-901f-ac85760d60ae)

Fluency is a feature-rich module for the [ProcessWire CMS/CMF](https://processwire.com/) that integrates third party translation services with a user-friendly interface for translating content in any multi-language field on any page. It also provides powerful tools to help developers create multi-language sites and apps faster.

Fluency can be used:

- While developing a new ProcessWire application
- When adding multi-language abilities to an existing ProcessWire application
- To add translation abilities to an existing multi-language ProcessWire application

You can help out by filing Github issues when bugs are found, or submit a pull request with fixes.

## Contents

- [Requirements](#requirements)
- [Installing](#installing)
  - [Configuring](#configuring)
  - [Translation Engines](#translation-engines)
  - [Localizing Fluency](#localizing-fluency)
  - [Upgrading or Removing](#upgrading-or-removing)
- [Features and Usage](#features-and-usage)
  - [Translating Inputfields](#translating-inputfields)
  - [Translating Templates and Modules](#translating-templates-and-modules)
  - [Disabling Translation For Individual Fields](#disabling-translation-for-individual-fields)
  - [Standalone Translator](#standalone-translator)
  - [Modified Content Indication](#modified-content-indication)
  - [Caching](#caching)
  - [Rendering Language Markup](#rendering-language-markup)
    - [Language ISO Codes](#language-iso-codes)
    - [Meta Link Tags](#meta-link-tags)
    - [Switch Page Language Select Element](#switch-page-language-select-element)
    - [Switch Page Language Links](#switch-page-language-links)
- [Using Fluency Programatically](#using-fluency-programatically)
  - [Translating Content](#translating-content)
  - [Get All Translation Service Languages](#get-all-translation-service-languages)
  - [Get All Configured Languages](#get-all-configured-languages)
  - [Translation Service API Usage](#translation-service-api-usage)
  - [Translation Engine Information](#translation-engine-information)
  - [Managing Cache](#managing-cache)
  - [Admin REST API Endpoints](#admin-rest-api-endpoints)
- [Error Handling and Logging](#error-handling-and-logging)
- [Known Issues](#known-issues)
- [Contributing](#contributing)
- [Cost](#cost)
- [Supporting Module Development](#supporting-module-development)

## Requirements

- ProcessWire >= 3.0.2
- PHP >= 8.1
- Module dependencies
  - LanguageSupport
  - LanguageTabs
  - ProcessLanguage
- UIKit admin theme
- At least 2 languages configured in ProcessWire to add translation to fields
- API key for the chosen third party translation service, free tiers are available

## Installing

You can install Fluency by adding the module to your ProcessWire project using any of the three following methods.

**Method 1**: Within ProcessWire using 'Add Module From Directory' and the class name `Fluency`

**Method 2**: Via Composer with `composer require firewire/fluency`

**Method 3**: Download from this repository or the [Modules directory](https://processwire.com/modules/fluency/) and unzip the contents into `/site/modules/`

After adding the module, install in ProcessWire.

## Configuring

1. Open the module configuration page, choose a Translation Engine, save
2. Complete the Translation Engine setup, save
3. Create language associations, save
4. Assign the `fluency-translate` permission where appropriate

That's it. All multi-language fields will now feature click to translate buttons and a translator tool available in the Admin menu bar. There is no limit on how many languages may be configured, and new languages can be added at any time.

If no langauges are present in ProcessWire or if languages are present and not configured with Fluency, it is still possible to use the translator tool in the Admin menu as long as a valid API key is present and the current user has the `fluency-translate` permission. Inputfield translation buttons will not render until languages have been configured in Fluency.

### Translation Engines

Fluency integrates third party translation services as "Translation Engines". When you configure Fluency, you'll choose which service to use. Currently the following translation services are availale:

- [DeepL](https://www.deepl.com/)
- [Google Cloud Translation](https://cloud.google.com/translate?hl=en)

Each translation service has their strengths, however not all features exist for all engines as Fluency relies on what abilities are available via each translation service, so review each and choose the one that is right for your project.

If you're interested in contributing to Fluency by building a Translation Engine, see [Contributing](#Contributing) below.

### Localizing Fluency

![fluency_localization](https://github.com/SkyLundy/Fluency/assets/61801600/2e0067a3-aaf3-42ea-89f5-e46994d478cd)

All text for the Fluency UI elements can be translated including messages, errors, and elements users use to interact with Fluency. This is done through ProcessWire's language setup. In the Admin visit Setup->Languages, and the "Find Files To Translate" feature within the language management page.

All translatable texts are located in `Fluency/app/FluencyLocalization.php`

### Upgrading Or Removing

Adding, upgrading, or removing Fluency from your ProcessWire application will not affect content. At most, you _may_ (but not always) need to update or reconfigure your Fluency module config. Settings are saved individually for each translation engine, so it is possible to switch between engines without losing your configurations for each.

When upgrading Fluency, check the Fluency config page to ensure that your settings are correct and to review any new features that may have been added.

Review the `CHANGELOG.md` file for an always up-to-date list of changes.

## Features and Usage

### Translating Inputfields

![fluency_translating_inputfields](https://github.com/SkyLundy/Fluency/assets/61801600/09345468-7e39-4287-8e9a-37291edd8e5f)

Fluency can translate content in any type of field on any page. These include:

- Plain textarea or text
- CKEditor content (Regular, Inline)
- TinyMCE content (Regular, Inline)
- Image/file descriptions
- Page names/URLs
- Tables
- Repeater/repeater matrix

Fluency is designed so that any multi-language field in any location or combination/nesting with other fields will be translatable.

When translating content within a TinyMCE or CKEditor field that contains links to other pages, the URLs will also be converted to links in that language automatically.

### Translating Templates and Modules

![fluency_templates_and_modules](https://github.com/SkyLundy/Fluency/assets/61801600/261dedb2-4c88-429b-81c8-96fbc7d16c2b)

Fluency integrates with ProcessWire's native translator pages where you can select files to translate. These include:

- Templates that contain strings are wrapped in the `__()` function
- Core modules
- Site modules that contain strings wrapped in the `__()` function

In your ProcessWire admin, navigate to a langauge page, use the "Find Files To Translate Button", select your files, and edit the translations. The field for each value will have a button which translates the string above the field to the language you are currently editing. For extra speed, use the "Click To Translate All" button at the top. This will translate all values on the page simultaneously in seconds.

**Note:** Please keep in mind that translating site and core modules _may_ be relatively expensive operations with respect to your API usage. It is recommended that you identify and prioritize the files/modules that are used in your ProcessWire site/app.

### Disabling Translation For Individual Fields

There may be individual fields that are multi-language but translation is not desired. These could be fields that need different values for each language but contain content not suitable for translating such as URLs, phone numbers, email addresses, etc. To disable translation individually, navigate to the Details tab of a multi-language field and check the "Disable translation for this field" checkbox. This can be modified at any time without affecting content or other functionality.

### Standalone Translator

![fluency_translator](https://github.com/SkyLundy/Fluency/assets/61801600/4e0e7ab8-41f8-4d5e-82b4-ad344b1c61b3)

Fluency also provides a standalone translation located as an item in the admin menu bar that can be accessed from any page, or by clicking the translation icon next to the translate buttons located under fields. This does not require that ProcessWire languages are configured in Fluency, only that the Translation Engine is configured to use a third party service.

To use the standalone translator, users must be assigned the `fluency-translate` permission.

### Modified Content Indication

When content in a ProcessWire field changes, Fluency italicizes and adds a green line on the language tab for that field. If the content is reverted to it's original value, the green line is removed. This lets users who are editing and translating content know which fields have been changed without clicking to another language tab. This assists content input and helps prevent content deviation between languages.

![fluency_modified_indicator](https://github.com/SkyLundy/Fluency/assets/61801600/bf6cb2e8-b27d-4cad-908e-ba3cb7f6e748)

### Caching

**Translations**

![fluency_translation_caching](https://github.com/SkyLundy/Fluency/assets/61801600/605aa092-5f72-4eab-9593-e72724892c40)

All translations are cached by default for a period of one month. This helps reduce API account usage where the same content is translated more than once and significantly increases translation speed. Caching can be toggled on/off on the Fluency module config page. The translation cache can also be manually cleared either on the module config page, via the [Fluency module API](#managing-cache), or via an AJAX request using the [Fluency admin REST API](#admin-rest-api-endpoints).

Translation caching relies on _exact_ value matching including punctuation, spelling, and capitalization. This ensures that an exact translation is always returned accurately. Translations that contain multiple strings are cached together.

**Translatable Languages**

![fluency_translatable_languages_caching](https://github.com/SkyLundy/Fluency/assets/61801600/dd1ecf51-92d1-4d63-8a9c-49c69ddd0da3)

Fluency uses lists of recognized languages from the selected third party translation service to determine what languages to make available when configuring and using Fluency.

**Note: This is cached forever until manually cleared** the first time that a translation engine is selected/configured to increase the speed of Fluency's operations.

Available languages are cached on a per-engine basis. This means that if a translation service adds additional translatable languages, this cache must be cleared on the module config page, via the [Fluency module API](#managing-cache), or via an AJAX request using the [Fluency admin REST API](#admin-rest-api-endpoints).

### Rendering Language Markup

Fluency provides tools to help make building websites with multi-language capabilities faster and easier. There are HTML best practices that help users with accessibility and improve SEO performance, many of these are available out of the box with Fluency.

Language names and ARIA attributes are automatically localized when you configure Fluency and use the ProcessWire core translation pages to translate the module.

#### Language ISO Codes

Returns the target language ISO code provided by the third party service.

```php
// Get the current language's ISO code
$fluency->getLanguageCode(); // => en-us

// Get the ISO code for another language using it's ProcessWire ID
$fluency->getLanguageCode(1034); // 'de'
```

_Tip:_ Use this to indicate the current language of the page including the `lang` attribute on the `<html>` tag.

```html
<!doctype html>
<html lang="<?= $fluency->getLanguageCode(); ?>">
  <!-- markup -->
</html>
```

#### Meta Link Tags

Fluency can render a list of languages `<link>` tags that you can use in the `<head>` of your HTML document. This helps users and search engines find the content for your page in all languages. The URLs will render as configured in ProcessWire.

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
    <title>Your Awesome Website</title>
    <link rel="alternate" hreflang="https://awesomewebsite.com/" href="x-default" />
    <link rel="alternate" hreflang="https://awesomewebsite.com/" href="en-us" />
    <link rel="alternate" hreflang="https://awesomewebsite.com/fr/" href="fr" />
    <link rel="alternate" hreflang="https://awesomewebsite.com/de/" href="de" />
    <link rel="alternate" hreflang="https://awesomewebsite.com/it/" href="it" />
    <link rel="alternate" hreflang="https://awesomewebsite.com/es/" href="es" />
  </head>
</html>
```

#### Switch Page Language Select Element

You can easily render a `<select>` element that will allow a user to choose the langauge that they are currently viewing the page in. By default, Fluency will also render inline JavaScript that will navigate to the page in the language selected but this can be disabled should you want to control that behavior yourself. All text/labels/values will render in the current language if translated and as configured in ProcessWire.

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

#### Switch Page Language Links

You can also render an unordered list of links to the current page in other languages.

```html
<div class="languages"><?= $fluency->renderLanguageLinks(); ?></div>
```

Output:

```html
<div class="languages">
  <ul>
    <li class="active">
      <a href="/">English</a>
    </li>
    <li>
      <a href="/fr/">French</a>
    </li>
    <li>
      <a href="/de/">German</a>
    </li>
    <li>
      <a href="/it/">Italian</a>
    </li>
    <li>
      <a href="/es/">Spanish</a>
    </li>
  </ul>
</div>
```

With options:

```html
<div class="languages">
  <?= $fluency->renderLanguageLinks( id: 'my-language-links', classes: ['my-class'], divider: '|',
  activeClass: 'current'); ?>
</div>
```

Output:

```html
<div class="languages">
  <ul id="my-language-links" class="my-class">
    <li class="current">
      <a href="/">English</a>
    </li>
    <li class="divider">|</li>
    <li>
      <a href="/fr/">French</a>
    </li>
    <li class="divider">|</li>
    <li>
      <a href="/de/">German</a>
    </li>
    <li class="divider">|</li>
    <li>
      <a href="/it/">Italian</a>
    </li>
    <li class="divider">|</li>
    <li>
      <a href="/es/">Spanish</a>
    </li>
  </ul>
</div>
```

## Using Fluency Programatically

Fluency can be accessed anywhere in ProcessWire using the `$fluency` variable. The following are some simple examples. For more in-depth details, review the docblocks for each method in `Fluency.module.php`.

Fluency is fully documented and formatted for the API Explorer tool in the outstanding (and personally recommended) [ProDevTools](https://processwire.com/talk/store/product/22-prodevtools/) module.

All methods return [Data Transfer Objects](https://medium.com/@sjoerd_bol/how-to-use-data-transfer-objects-dtos-for-clean-php-code-3bbd47a2b3ab) that are immutable and predictable in structure and features. All values can be accessed via:

- Object properties `$dtoObject->property`
- Be converted to an array using the `$dtoObject->toArray()` method
- Encoded to JSON directly using `json_encode($dtoObject)`

Data Transfer Objects also contain helper methods to access or find data within the DTO

### Translating Content

```php
$translation = $fluency->translate(
  sourceLanguage: 'EN',                         // Language code used by the translation service
  targetLanguage: 'DE',                         // Language code used by the translation service
  content: 'How do you do fellow developers?',  // String or array of strings to translate
  options: [],                                  // Translation Engine specific options (optional)
  caching: true                                 // Default is true, false disables, overrides module config
); // => EngineTranslationData

// Results may be accessed via properties on the return object, see toArray() example below for all
// properties present in the EngineTranslationData object
$translation->translations; // => ['Wie geht es Ihnen, liebe Entwickler?']
$translation->fromCache;    // => true

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

// Get the total number of translated strings returned
count($translation); // 1
```

Translate multiple strings simultaneously

```php
$translation = $fluency->translate(sourceLanguage: 'EN', targetLanguage: 'DE', content: [
  'Must it be?',
  'It must be.',
]); // => EngineTranslationData

// $translation->toArray(); Outputs the following:
//
// array(10) {
//   'sourceLanguage' => 'EN'
//   'targetLanguage' => 'DE'
//   'content' => [
//     'Must it be?',
//     'It must be.'
//   ],
//   'translations' => [
//     'Muss das sein?',
//     'Es muss sein.'
//   ],
//   'options' => [],
//   'fromCache' => true,
//   'cacheKey' => '18af707954dabf4df8013f3f013bc7382a73fff6050ab0d048f7296214bfb21f',
//   'retrievedAt' => '2023-09-17T17:16:25-07:00',
//   'error' => NULL,
//   'message' => NULL,
// }
//
// Get the total number of translated strings returned
count($translation); // 2
```

### Get All Translation Service Languages

This method returns all languages that the current translation service recognizes. This includes languages that aren't configured in Fluency.

The source/target language codes can be used when calling `$fluency->translate()`;

```php
$translatableLanguages = $fluency->getTranslatableLanguages(); // => EngineTranslatableLanguagesData

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
//     // ... ommitted for brevity
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

### Get All Configured Languages

Fluency provides robust data for languages configured in Fluency. In certain instances it may be preferrable to using ProcessWire's `$language` object when modifying state is not required.

```php
$configuredLanguages = $fluency->getConfiguredLanguages(); // => AllConfiguredLanguagesData

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

// Additional methods are available as well, each return their own DTO. Examples based on the return value shown above:

$configuredLanguages->getDefault();                         // => ConfiguredLanguageData for English
$configuredLanguages->getCurrent();                         // => ConfiguredLanguageData for English
$configuredLanguages->getByProcessWireId(1028)              // => ConfiguredLanguageData for French
$configuredLanguages->getBySourceCode('FR')                 // => ConfiguredLanguageData for French
$configuredLanguages->getByTargetCode('EN-US')              // => ConfiguredLanguageData for English
$configuredLanguages->getBySourceName('French')             // => ConfiguredLanguageData for French
$configuredLanguages->getByTargetname('English (American)') // => ConfiguredLanguageData for English

// Since these return ConfiguredLangaugeData objects, you can access very useful information quickly.

$currentLanguage = $configuredLanguages->getCurrent(); // => ConfiguredLanguageData for English
$currentLanguage->id;                                  // => 1017
$currentLanguage->title;                               // => 'English' (Returned localized if translated in ProcessWire)
$currentLanguage->default;                             // => true

// All properties under engineLanguage are provided by the Translation Engine
// The source/target language codes can be used when calling `$fluency->translate()`;

$currentLanguage->engineLanguage->sourceCode;          // => 'EN'
$currentLanguage->engineLanguage->targetCode;          // => 'EN-US'
$currentLanguage->engineLanguage->sourceName;          // => 'English'
$currentLanguage->engineLanguage->targetName;          // => 'English (American)'

// Get the number of ProcessWire langauges configured in Fluency
count($configuredLanguages); // => 6
```

### Translation Service API Usage

Note: not all translation services provide this information

```php
$usage = $fluency->getTranslationApiUsage(); // => EngineApiUsageData

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

### Translation Engine Information

```php
$engineInfo = $fluency->getTranslationEngineInfo(); // => EngineInfoData

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

### Managing Cache

```php
// Get the current number of cached translations:
$fluency->getCachedTranslationCount(); // Int

// Clear the translation cache:
$fluency->clearTranslationCache(); // 0 on success

// Check if the list of languages translatable by the translation engine are currently cached:
$fluency->translatableLanguagesAreCached(); // Bool

// Clear the translatable languages cache:
$fluency->clearTranslatableLanguagesCache(); // 0 on success
```

### Admin REST API Endpoints

AJAX calls can be made to endpoints in the ProcessWire admin to interact with Fluency. The current user must have the `fluency-translate` permission. Refer to `Fluency.module.php` method docblocks to review accepted methods and responses. Base admin URL will match your ProcessWire installation.

```php
$endpoints = $fluency->getApiEndpoints(); // => stdClass

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

## Error Handling and Logging

Fluency handles errors encountered when communicating with the translation API and errors experienced in ProcessWire. All Data Transfer Objects contain `error` and `message` properties.

`error` - Will contain an error type string defined as class constants in in `app/FluencyErrors.php`
`message` - Will contain a human-friendly message for the error type that occurred. These are located in `app/FluencyLocalization.php` and can be translated

Translation Engine and third party service errors are stored under the `fluency-engine` log. If there are issues with translating content, refer to that log first to check whether the translation service is experiencing issues.

## Known Issues

- The browser plugin for Grammarly may conflict with Fluency and is a known issue for many web apps. If you encounter issues, the solution is to either disable Grammarly while using Fluency in the ProcessWire admin, or log into the admin in a private browser window where Grammarly may not be running. Instructions provided by Grammarly [here](https://support.grammarly.com/hc/en-us/articles/115000091612-Turn-off-Grammarly-on-one-or-more-websites).

## Contributing

**Module Features**

Feature suggestions are welcome. In fact, Fluency has been made better thanks to great feedback by the ProcessWire community. If you have a suggestion, [file an issue in the Fluency GitHub repository](https://github.com/SkyLundy/Fluency/issues).

**Translation Engines**

Fluency is modular in that it contains a framework for adding additional third party services as "Translation Engines". You can choose which Translation Engine you prefer and provide the credentials to connect via their API. As this project is open source, contributions for new third party services as Translation Engines are welcome. If you would like to request a new third party service, [file an issue in the Fluency GitHub repository](https://github.com/SkyLundy/Fluency/issues)

If you'd like to develop one for yourself, feel free to fork Fluency, build a new Translation Engine, and create a pull request.

Developer documentation for integrating third party translation services as Translation Engines is located in `Fluency/app/Engines/DEVDOC.md`. _Documentation is a work in progress_. If you need help or more information, feel free to send me a PM on the [ProcessWire forum](https://processwire.com/talk/).

## Cost

Fluency is free to use. There is no cost for this module and it can be used on any site that you build with ProcessWire. This module is provided as a thank you to the outstanding ProcessWire community and as a contribution alongside other module developers who help everyone build great websites and applications.

## Supporting Module Development

Module development is both a lot of work and an important contribution to the ProcessWire ecosystem. Developers who offer both free and paid modules spend many hours creating and maintaining our favorite tools we all use for ProcessWire projects.

You can support module development by giving the Github repo a star, donating, or contributing to development with pull requests. If you find yourself reaching for a module that you can't live without, or if a module fulfills a need for a client request, consider donating or sponsoring a developer or their projects.

While this message is for the ProcessWire community on behalf of all module developers, if you've found Fluency useful and think it's worth a cup of coffee, you can [send me something via PayPal](https://paypal.me/noonesboy).
