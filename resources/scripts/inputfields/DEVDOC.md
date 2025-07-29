# JavaScript - Fluency FtInputfields

Each type of ProcessWire Inputfield has its own `FtInputfield` file. `FtInputfield` objects are
bound to each Inputfield individually and handle very simple I/O for each language within a
ProcessWire Inputfield.

The purpose of these objects is to create a per-Inputfield interface implementation with a limited
set of public interfaces. This encapsulates the complexity of manipulating values, setting
eventListeners, setting change states, etc. without needing to expose _how_ that behavior is
implemented on a per-Inputfield type basis.

**Please Note**
Not all Inputfield types require that a Fluency Inputfield file/code is written and implemented. Some fields will inherit the behavior of other fields, such as the ProFields Functional Fields. Fluency Inputfield objects must only be created if there are circumstances where subfields do not initialize.

`FtInputfield` files must:

- Handle the behavior of a single fieldtype
- Export a constructor function named `FtInputfield{name of field type}`
- Export a stateless function named `FtIsInputfield{name of field type`
- Check for the existence of a library/plugin and return `null` if not found, e.g. `CKEditor` or `tinymce` before attempting to initialize

`FtInputfield` objects must be registered in the main `FtInputfields.js` code. This main
`FtInputfields` object handles Inputfield type checking and object instantiation for all fields
present on the page. For a basic example please refer to `FtInputfieldText.js`, for a more complex
example please refer to `FtInputfieldTinyMCE.js`

Each `FtInputfield` object **MUST** implement the following **PUBLIC** methods:

`getSelf()` - This returns the main Inputfield element that was passed when the object was
instantiated

`getValueForDefaultLanguage()` - This returns the current value for the default language

`getValueForLanguage({ProcessWire language ID})` - Returns the current value for a language
specified by a ProcessWire language ID

`setValueForLanguage({ProcessWire language ID})` - Sets a new value for a language specified by a
ProcessWire language ID. This method must implement the following behavior:

- Set a new value for the language-specific field
- Ensure that the corresponding tab indicates changed content if different from page load
- Return `boolean` indicating whether the content has changed from page load or not

## Purpose

`FtInputfield` objects should know about their associated area where content is entered and associated language tab. They get and modify content. That's it.

The `FtInputfield` objects may be passed to other objects that need to get/set content such as translation triggers.

Recommendations:

- Use events to track changes to content
- Using events allows you to easily take actions such as memoizing the new field value, comparing
  the new field value to the original value, and updating the language tab to indicate changes
- Memoize elements and instances of editors to minimize DOM traversing and increase performance
