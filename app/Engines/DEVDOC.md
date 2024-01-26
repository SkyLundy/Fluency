# Fluency Translation Engines

**NOTE: In progress. Feel free to send me a private message on the ProcessWire forums**

Fluency is modular in that it provides a clean and organized method for implementing any translation
service. These are referred to as Translation Engines.

Translation Engines were given a place within the Fluency codebase to help provide a cohesive
development experience, consistent API, namespacing, and a well organized file structure.
Translation Engine contributions can be made using pull/merge requests and new Translation Engines
can be used in ProcessWire by updating the Fluency module.

The DeepL and Google Cloud Translate engines are well documented and should be great starting points
for developing new Translation Engines. The information here will help by explaining the way
Translation Engines are implemented and how Fluency's architecture works.

**A note on translation caching**
Translation caching is handled at the module level. Translation Engines should not implement any
caching behavior on their own, nor do they have to worry about it. Fluency takes care of it.

The DeepL Translation Engine currently implements the most Fluency features. For reference during
development, review the DeepL engine.

## What Does It Take Do Build A Translation Engine?

Fluency's Translation Engine implementation is designed to make development as easy as possible by
using interfaces to define what methods your engine must include and by transferring data using
[Data Transfer Objects](https://medium.com/@sjoerd_bol/how-to-use-data-transfer-objects-dtos-for-clean-php-code-3bbd47a2b3ab).

A familiarity with Object Oriented Programming (or an interest in learning!) is important. Some
experience creating ProcessWire modules can be of some help as well. This is because Fluency
Translation Engines are loosely modeled after ProcessWire modules. The configs for a
Translation Engine also include creating fields that will be inserted into Fluency's config page.
More on that below.

If you have any questions or need help, reach out via private message on the ProcessWire forums!

## Translation Engine Requirements

Fluency is designed with some feature parity between services in mind. At minimum a translation
engine must provide the ability to:

- Translate content
- Provide a list of languages that are recognized by the translation engine that includes ISO
  language codes
- Recognize and return errors appropriately

A translation engine may also provide usage data should the translation API implement an ability to
provide that information. This is optional.

## Translation Engine Files

Translation engines require three files, an engine file, a config file, and an info file. They are
contained in a dedicated directory within the `app/Engines` directory. A Translation Engine for a
(fictional example) translation service named "Super Awesome Translator" would look something like
this:

```
├── app
│   ├── Engines
│   │   │   ├── SuperAwesomeTranslator
│   │   │   │   ├── SuperAwesomeTranslatorEngine.php
│   │   │   │   ├── SuperAwesomeTranslatorConfig.php
│   │   │   │   ├── SuperAwesomeTranslatorInfo.php
```

Each file and their purpose is defined below.

### The Translation Engine

_implements FluencyEngine_

Each Translation Engine encapsulates all logic and code required to translate content and provide
data to Fluency. To make development more easy and predictable, all Translation Engines implement
interfaces that define the methods that Fluency requires and the objects used to transfer data to
and from Fluency.

A Translation Engine is only required to implement the `FluencyEngine` interface. All logic, API
authentication/calls, and data manipulation happen exclusively within a Translation Engine.

The Fluency module itself does not care how a translation is made, how it processes the data, the
private method structure, etc. It only requires that the methods defined in the interface are
implemented, accept appropriate Data Transfer Objects where applicable, and that each method return
the correct Data Transfer Object.

References:
`Fluency\app\Engines\FluencyEngine.php` - The interface that defines the required methods
`Fluency\app\Engines\DeepL\DeepLEngine.php` - A full example of implementation

A Translation Engine class and filename must end with `Engine.php`

### The Translation Engine Config

_implements FluencyEngineConfig_

The Translation Engine config file is used to declare the config variables that need to be present
and set on the Fluency config page. It also provides a method that allows for rendering a set of
custom config fields used for an engine. Each engine may render any configuration fields needed for
the engine to complete it's work. This includes things like authentication and engine-specific
options.

Example:

The DeepL API provides options to declare formality in translations, strings to exclude from
translation, and sentence structure correction. It also requires defining an API key for
authentication and specifying a "Pro" or "Free" account to form the proper API queries. So the
`DeepLConfig` class implements the `renderConfigInputs` method which returns an `InputFieldWrapper`
containing fields that collect the following data:

- `deepl_account_type`
- `deepl_api_key`
- `deepl_formality`
- `deepl_global_ignored_strings`,
- `deepl_preserve_formatting`

The values that are entered on the Fluency module config page, along with other core Fluency module
configs, are provided back to the Translation Engine in a `FluencyConfigData` object for use
during runtime.

#### Engine Specific Configurations

The Fluency module config page renders a config fieldset defined by a Translation Engine. It is
up to you what fields will be included, and allows for a fully customized config that integrates
natively with Fluency's config. When a Translation Engine is selected in Fluency, that engine's
config fieldset will render.

An instance of `FluencyConfigData` will be passed to the constructor of your Translation Engine. It
will contain all of Fluency's config data, and will also provide your custom config data in a
property called `engine`.

```php
final class SuperAwesomeTranslatorEngine implements FluencyEngine {

  public const __construct(FluencyConfigData $fluencyConfig) {
    // Get your custom engine config data
    $fluencyConfig->engine;

    // Or access it as an array
    $fluencyConfig->toArray()['engine'];
  }

}
```

References:
`Fluency\app\Engines\FluencyEngineConfig.php` - The interface that defines the required methods
`Fluency\app\Engines\DeepL\DeepLConfig.php` - A full example of implementation

A Translation Engine Config class and filename must end with `Config.php`

### Translation Engine Info

_implements FluencyEngineInfo_

The Translation Engine info file is used to provide information about the Translation Engine and the
third party service it uses to Fluency. This information will be displayed within the Fluency module
config page. These include:

- The name of the Fluency engine
- The engine version
- Author's name/website URL (optional)
- Name of the service provider
- Translation service API version
- Link to the translation service API docs
- Free form content that will be rendered as markup in the Fluency config. It can be used to provide
  details, engine specific instructions, etc.

References:
`Fluency\app\Engines\FluencyEngineInfo.php` - The interface that defines the required methods
`Fluency\app\Engines\DeepL\DeepLInfo.php` - A full example of implementation

A Translation Engine Info class and filename must end with `Info.php`

## Data Transfer Objects

To provide a stable and consistent interface between Fluency and Translation Engines, all
Fluency methods and all Translation Engine methods receive and return data using purpose-defined
Data Transfer Objects. By using DTOs Fluency and a Translation Engine can always expect the same
data format using the same property names and the same methods every time.

Data Transfer Objects also keep method signatures clean and code easy to grok as all of the
values and methods needed are encapsulated within the data structure itself. Rather than have a
method with 10 parameters, accept one DTO parameter.

Translation Engines should not implement their own DTOs and instead make use of those provided by
Fluency. Their structure and documentation make creating a Translation Engine significantly easier
because expected data and types are already declared- all a Translation Engine must do is read data
from DTOs passed to it and provide values when returning a DTO from it's methods.

All Data Transfer Objects have these characteristics:

- Are immutable, all data is accessed by `readonly` properties
- Implemented using the Factory pattern, they do not require instantiation using the `new` keyword
- Created using the `fromArray` method
- Can be converted to an array using the `toArray` method
- Can be directly encoded to JSON by passing the object to `json_encode`
- Are strictly typed in instantiation and return types
- Throw Exceptions where necessary
- Predefines required and optional data parameters
- May contain nested Data Transfer Objects where applicable

Data Transfer Objects inherit the `FluencyDTO` class and are located within the
`Fluency\DataTransferObjects` namespace. Those used by translation engines are noted below.

### Translation Requests _TranslationRequestData_

A translation request is the request that Fluency makes to a Translation Engine.

A Translation Engine's `translate()` method will be passed a `TranslationRequestData` DTO instance.
This contains all of the data required to complete a translation. You can access translation request
data either by the object's properties, or convert it to an array.

### Translated Content _EngineTranslationData_

Completed translation requests processed by a Translation Engine's `translate()` method return an
instance of `EngineTranslationData`.

## Error Handling

## Logging
