# Fluency for ProcessWire Changelog

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
