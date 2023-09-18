# Fluency Translation Engines

**WORK IN PROGRESS**

Fluency is modular in that it provides a clean and organized method for implementing any translation
service. These are referred to as Translation Engines.

Translation Engines were given a place within the Fluency codebase to help provide a cohesive
development experience, consistent API, namespacing, and a well organized file structure.
Translation Engine contributions can be made using pull/merge requests and new Translation Engines
can be used in ProcessWire by updating the Fluency module.

The architecture of Fluency is a little more involved than some other modules, so more depth is
provided to help speed up development and explain within the context of ProcessWire.

The documentation below defines how Translation Engines are created, how they work with data, and
finally the architecture theory behind both Fluency and Translation Engines.

**A note on translation caching**
Translation caching is handled at the module level. Translation Engines must not implement any
caching behavior as it would not provide a method to manage that cache. Fluency has provided
caching that adheres to the module config settings, provides the ability to enumerate the number of
cached translations, as well as the ability to clear cached translations.

## Translation Engine Requirements

Fluency is designed with a level of parity between languages in mind

## Translation Engine Files

Translation engines require three files, an engine file, a config file, and an info file. They are
contained within their own directory within the `app/Engines` directory. A Translation Engine named
"Google Cloud Translation" would follow the following structure:

```
├── src
│   ├── Engines
│   │   │   ├── GoogleCloudTranslation
│   │   │   ├── GoogleCloudTranslationEngine.php
│   │   │   ├── GoogleCloudTranslationConfig.php
│   │   │   ├── GoogleCloudTranslationInfo.php
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
implemented, accept the defined DTO where applicable, and return data in the type necessary.

### The Translation Engine Config

_implements FluencyEngineConfig_

The Translation Engine config file is used to declare the config variables that need to be present
and set on the Fluency config page. It also provides a method that allows for rendering a set of
custom config fields used for an engine. Each engine may render any configuration fields needed for
the engine to complete it's work. This includes things like authentication and engine-specific
options. Example:

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
configs, are provided back to the Translation Engine in a `getConfigDataData` object for use
during runtime.

### The Translation Engine Info

_implements FluencyEngineInfo_

The Translation Engine info file is used to provide general information about thetranslation service
API as well as the Fluency engine itself. This information will be displayed within the Fluency
module config page. These include:

- The name of the Fluency engine
- The engine version
- Author's name/website URL (optional)
- Name of the service provider
- Translation service API version
- Link to the translation service API docs
- Free form content that will be rendered as markup in the Fluency config. It can be used to provide
  details, engine specific instructions, or provide a messagage to the developers that use a given
  engine.

A `configId` is required. This ensures that values configured for an engine remain unique to each
engine, including language associations. Use a string that can ensure it's uniqueness among all
engines, consider using a UUID.

All Translation Engine info classes must implement `TranslationEngineInfoInterface`. Refer to
`app/Engines/TranslationInfoInterface.php` for more documentation.

A Translation Engine info filename must end with `Info.php`

## Data Transfer Objects

To provide a stable and consistent transfer of data between Fluency and Translation Engines, all
Fluency methods and all Translation Engine methods receive and return data using purpose-defined
Data Transfer Objects. Using DTOs it can be expected that Fluency and a Translation Engine will
always expect the same data format using the same property names and the same methods every time.

All Data Transfer Objects have these characteristics:

- Are immutable, all data is accessed by `readonly` properties
- Implemented using the Factory pattern, they do not require instantiation using the `new` keyword
- Created using the `fromArray` method
- Can be converted to an array using the `toArray` method
- Can be directly encoded to JSON by passing the object to `json_encode`
- Are strictly typed both in data used to instantiate a DTO object and it's return types
- Throw Exceptions where necessary
- Predefines required and optional data parameters
- Well documented for a better developer experience
- Are namespaced under `Fluency\DataTransferObjects`
- May contain nested Data Transfer Objects where applicable

All Data Transfer Objects inherit the `FluencyDTO` class and are located within
the `Fluency\DataTransferObjects` namespace. Those used by translation engines are noted below.

### Translation Data _EngineTranslationData_

The `EngineTranslationData` DTO the object used to pass translation requests _to_ a Translation
Engine's `translate` method, and are also _returned_ by that method containing the translation or
appropriate errors when necessary. It is a complete encapsulation of translation data and is
returned by the Fluency `translate` module method, and then JSON encoded if the request was made to
the Fluency REST API. The translation DTO may contain the following

For a translation request from Fluency to a Translation Engine:

- The source language - provided as an `EngineLanguageData` DTO
- The target language - provided as an `EngineLanguageData` DTO

## The Fluency/Translation Engine Architecture

As described above, the files, methods, properties, and data structures make deep integration
possible, but with less overhead. Rather than rely on functions and methods that take several
parameters in different orders, or as vague array structures that can make data transport difficult,
an attempt was made to crate uniformity across Translation Engine creation.
