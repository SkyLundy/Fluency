# Fluency for ProcessWire Changelog

## 1.0.7 2024-25-01

### Enhancements, Documentation, Bugfixes, Code Improvement, Recommended for all users

- Add ability to have both 'Translate From Default Language' and 'Translate To All Languages'
  buttons added to inputfields
- Add ability to translate any file used by ProcessWire directly where the `__()` string translation
  method is used from the filesystem in any directory. See `Fluency::translateProcessWireFiles()`
  method for documentation and usage
- Translation results can now be casted to a string. Casting `EngineTranslationData` objects to
  string now outputs the first item in the `translations` property array which is useful when
  translating individual strings. Credit to @BernhardBaumrock for the feature suggestion
- Add source/target language swapping and clear field contents buttons to the standalone translator,
  translated content field is now readonly, various improvements
- Add cache clearing on module delete, because it's polite.
- Fix issue where when creating a page, translating page titles would not populate the URLs of other
  languages
- Fix improper return value for `Fluency::translate()` method when pre-translation error occurs
- Add methods to `AllConfiguredLanguageData` object where filtering and finding
  `ConfiguredLanguageData` objects is improved
- Remove 'Click To Translate All' button on the 'Find Files To Translate' page where it did nothing
- Add `Fluency::clearAllCaches()` method and matching Fluency API endpoint
- Improve documentation
- Moved PHP array value type checking to importable functions
- Fluency now makes recommendations for actions where necessary when upgrading
- Improve messaging when Fluency experiences issues during module configuration. Credit to
  @BernhardBaumrock for recommending
- Fix issue where 'Translate to all languages' button would also translate the default content which
  would unnecessarily increase API usage (sorry)
- Add `TranslationCache::getAllCachedTranslations()` method to... do what the method name says
- Add `TranslationCache::deleteByCacheKey()` method to... also do what the method name says
- Clean up namespace registration in `Fluency.module.php`
- Remove unused class imports
- Remove legacy JavaScripts
- Fix UI issue where translate buttons for page name fields were next to the inputs rather than
  under them
- Fix issue where translations may include encoded HTML entities. Bug caused by translating links in
  content. Credit to @BernhardBaumrock for finding/reporting
- Fix issue with handling entities via mbstring now errors in PHP 8.2 causing translations with
  ProcessWire page links to fail, credit to @BernhardBaumrock for finding and reporting.
- Fix issue where `FluencyErrors::FLUENCY_UNKNOWN_TARGET` showed a message indicating that the
  source language was the issue. Credit to @BernhardBaumrock for finding and reporting

## 1.0.6 2023-12-26

### Bugfix, Internal Updates, Recommended for all users

- Move initializations to `init()` method so that Fluency can be used prior to `ready()` which to
  allow functionality to be extended beyond the page context. Allows Fluency to be accessed and
  used by other modules.
- Removed call to previously removed method in module

## 1.0.5 2023-12-22

### _Critical update_, Bugfix upgrade recommended for all users.

- Fix return type error when Fluency attempts to get configured languages in some instances credit
  to @jacmaes for finding and reporting. Closes [issue 3](https://github.com/SkyLundy/Fluency/issues/3).
- Fix bug where rendering langauge links appended an extra divider after list if a divider was
  passed to the method

## 1.0.4 2023-12-19

### Enhancement, Documentation

- Added TOC to README
- Reorganized/clarified text of README for easier reading
- Fixed speling mistakes in README
- Expanded README to include Contributing section
- Expanded README to include documentation for translating multiple strings in one call
- Expanded README to include documentation for DTO methods and helpers
- FluencyMarkup now accepts `null` for `$classes` parameter
- FluencyMarkup now removes empty HTML attributes on render
- The module method `renderLanguageLinks` now adds active class to `<li>` element containing the
  current page language rather than the `<a>` element contained within it.
- When when a divider value is passed to `renderLanguageLinks`, the `<li>` element is given a
  `divider` class
- Added missing parameter description to docblock for `renderLanguageLink`

## 1.0.3 2023-12-18

### Enhancement, Documentation

- Can now get number of engine translatable languages by passing the EngineTranslatableLangauages
  instance to `count()`
- Expanded README to include information about site & core translation files
- Expanded README to include additional detaila about caching
- Expanded README to include additional details and examples on module methods
- Spelling errors in docblocks fixed
- Add additional work to Translation Engine DEVDOC (WIP)

## 1.0.2 2023-12-17

### Enhancement, Documentation, Bugfix

- Added single-click translation for ProcessWire core translation pages. Any module or file using
  `__()` can be translated with one click.
- Expanded README to include documentation on using the markup output features for front end HTML
- Expanded README to include additional details on interacting with Fluency programmatically
- Expanded README to include additional information on caching, performance, and usage
- Fixed issue where separators in language link list markup were not rendering correctly

## 1.0.1 2023-12-12

### Documentation & Fixes

- Updated README.md with current module information
- Fix spelling errors in Fluency module docblock
- Remove JS debug logging from development

## 1.0.0 2023-12-02

### Enhancement, Bugfixes, Potential breaking changes

- Added the ability to enable a "Translate to all languages" button for inputfields. This enables
  cross-language translation to all languages with one click. The old style of per-field buttons
  is still available. The option can be chosen on the Fluency module config page.
- Links to ProcessWire pages in translated content are changed to pages in that language
- Add AllConfiguredLanguagesData Data Transfer Object, see Potential Breaking Changes
- Empty fields cannot be translated. This fixes an issue where translating an empty field may lead
  to data loss in other fields where an empty translation would overwrite content that is already
  present.
- Fix issue where translation buttons inside InputfieldTable and FieldsetPage did not work, or
  worked inconsistently. Credit to @romaincazier for finding/reporting.

### Potential Breaking Changes

These module API changes may break code that interacts with the Fluency module directly.

- Return type of `Fluency::getConfiguredLanguages()` is now a Data Transfer Object rather than an
  array. This DTO adds many helper methods to working with all languages and is in line with the
  return types of most other Fluency module methods.
- `Fluency::getConfiguredLanguageByProcessWireId()` is now private. To find a configured langauge
  by it's ProcessWire ID, call `Fluency::getConfiguredLanguages()->getLangaugeByProcessWireId()`,
- Removed `Fluency::getDefaultConfiguredLanguage()`. To get the default configured langauge call
  `Fluency::getConfiguredLanguages()->getDefaultLanguage()`

### Misc.

- Code cleanup, remove unused imported classes
- Update API Explorer documentation

## 0.9.1b 2023-10-17

### Bugfixes, enhancement

- Removed hard-coded color for click to copy links. Credit to @BernhardBaumrock for finding the issue
- Added UIKit tooltip for translation tool button icon next to translation triggers. Credit to
  @BernhardBaumrock for the suggesion
- Version bumped to 0.9.1 beta

## 0.9.0b 2023-10-17

### _Complete Rewrite_, upgrade recommended for all users.

- Version bumped to 0.9.0 beta
- Support for additional Inputfields added, all types are now supported
- Support for both TinyMCE and CKEditor fields
- Field for entering excluded strings for the DeepL translation engine on the
  module config page now uses || (double pipe) to separate strings rather
  that a comma since that is punctuation that could exist in an excludes string
- Language tabs/fields now indicate content change status by adding a
  colored highlight to more easily determine that all fields have had
  content updated/translated
- Front-end markup rendering added. Dropdown to select language/navigate to
  a language can be rendered, JS can be added to automatically handle
  functionality. Meta/link tags can be rendered in the `<head>`
  element for better SEO and standards adherence. The current language code
  can be rendered for use in the `<html lang="">` property. A list of links
  to languages can be rendered.
- All requests to Fluency from the admin client are made to a RESTful module
  API that provides multiple endpoints
- Translation services are now modular and added as "Translation Engines" new
  third party translation services can be added using a built in framework
  that makes use of Data Transfer Objects to standardize interfaces and
  provide a better development experience
- Add Google Cloud Translator to available Translation Engines
- Translation engines provide individual versioning information and developer
  credits
- Translations can now be cached to speed up repeated requests and lower
  API usage where possible
- Translatable languages are now permanently cached until cleared on the module
  config page
- The translation icon next to translate buttons now opens the translation
  tool overlay when clicked. Credit to @BernhardBaumrock for the suggesion
- Translate buttons below fields are now links that are styled with the admin
  rather than button elements with specified styles. Credit to @BernhardBaumrock
  for the suggestion.
- Additional methods added to the module for additional functionality,
  signatures for existing methods changed to more stable structures to work
  with more translation services
- Full support for DeepL's formality feature
- Strict PHP typing and use of PHP 8.1 syntax and features
- Full module/method documentation that adhere's to the [ProcessWire API
  Explorer ProDevTools module](https://processwire.com/store/pro-dev-tools/api-explorer/)
- JavaScript rewritten using ES modules
- All styles written in Sass
- Development tools implemented, Gulp, Prettier, Babel, etc.
- Full localization for all Fluency interface strings
- Full error handling and client side messaging
- Developed using ProcessWire 3.0.218
- Updated README.md

**UPGRADE INFORMATION**
Upgrading will require that you configure the module again. This
includes adding your translation API key and configuring language
pairing. All content is safe and there is no risk of data loss.
Just install the new module, configure, and done.

## 0.3.2 2021-07-03

### Bugfixes, enhancement

- Fixed issue where translation length was limited becauses calls to DeepL API
  were being made using GET rather than POST.
- Testing using a DeepL Pro developer account allowed for reliable translation
  of 20,000+ words at once. Note: the time taken to translate this much content
  is very noticeable.

## 0.3.1 2021-06-22

### Bugfixes, feature added

- Fixed issue with improper string interpolation when excluding strings as
  defined in the config.
- Updated excluded words to handle strings with special characters such as Hanna
  codes.

## 0.3.0 2021-06-19

### New feature. Alpha version change.

- Fluency now supports DeepL Free Developer accounts. Adds feature request made
  in [Github issue #3](https://github.com/SkyLundy/Fluency-Translation/issues/3)
- Fluency module configuration now requires that an account type be specified.
- DeepL class interface updated and now requires an account type when called
  programmatically. See updated documentation
- Various refactoring and cleanup

## 0.2.5 2021-06-16

### _Critical update_, upgrade recommended for all users.

- Fixed issue where non-CKEditors/plain text fields would not reliably translate.
  Addresses [Github issue #2](https://github.com/SkyLundy/Fluency-Translation/issues/2)

## 0.2.4 2021-02-08

### Bugfixes. Upgrade recommended for all users

- Updated js that handles CKEditor field translation and population. Fixes an
  issue where some fields may not received translated content and other fields
  may not allow for translating content until the page/fields are saved at least
  once.
- Learned that a space before end of sentence punctuation is a thing in French
  and troubleshooting the module after first noticing that was a waste of time.
  Not relative to module update, just complaining.

## 0.2.3 2020-12-19

### _Critical update_, upgrade recommended for all users

- Critical update to AJAX calls. Previously, calls to the module were made using
  a GET request which ran into URL length problems on large bodies of text,
  notably in CKEditor content. Admin AJAX calls are now made using POST.
- Using Fluency now requires the `fluency-translate` permission which allows for
  more granular control over the use of a paid service. All users that will use
  Fluency must be given this permission after upgrading to this version
- Made all Fluency methods public. Translation, usage, and DeepL supported
  languages can now be called directly from the module. Now matches capabilities
  of using the DeepL class directly. Full documentation in README.md
- Added a 5th parameter to Fluency->translate() method that allows for full API
  usage without restrictions. Takes an array with key/value API parameters. Full
  documentation for Fluency API usage added to README.md
- All AJAX calls made in ProcessWire admin now return consistently structured
  object that contain proper HTTP codes to support future full error handling
- Fluency source is now hosted at Github to adhere to ProcessWire module
  directory standards
- Removed bd() debugging function left in master as oversight.
- Internal code cleanup/refactoriing.
- Reformatted CHANGELOG.md

## 0.2.2

### Bugfixes

- Added ability for page-edit roles to use translation
- Updated README.md to include inline CKEditor as not yet supported (is on the roadmap)

## 0.2.1

### _Critical update_, Upgrade recommended

- Fixed critical failing issue in Chrome where text containing newlines were
  rejected on reason of security.[Now in compliance with this feature](https://www.chromestatus.com/feature/5735596811091968)
- Added the ability to configure globally ignored strings that will not be
  translated. Adding words/phrases in the module's configuration page will have
  them ignored and always remain in the original langauge.
- Refactored API key validity storage. Module checks and stores whether API key
  is valid
- Updated README.md with known Grammarly plugin conflict

## 0.2.0 2020-11-06

### _Critical update_, Upgrade recommended. Alpha version change.

This fixes an issue that can cause the translator to not function and display an
error. Also significant updates to the UI. All users should update.

- Translator tool can now be used if API key is present & valid but no languages
  are configured
- Translator tool now has click to copy ability
- UI properly shows triggers/messaging when some languges configured vs. all
  languages configured
- UI doesn't initialize fields if no languages are configured. No messages, no
  triggers
- Reduced number of assets loaded in Admin with combined CSS files
- Updated README to reflect availability of translator tool under instructions
- Module no longer initializes if on login screen
- Added license

## 0.1.1 2020-11-04

### Bugfixes, Upgrade recommended

- Various bugfixes and improvements
- Contains better user-facing admin UI when module is not yet configured
- Fixed issued where textarea fields did not get a translation trigger on the
  'Translate File' page
- Code refactored to have assets delivered to page depending on the page/context

## 0.1.0

### 2020-11-01 Initial release

- Alpha release
