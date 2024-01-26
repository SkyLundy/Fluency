import FtConfig from './FtConfig';

/**
 * Core module interface
 * Handles all interaction with the ProcessWire module backend
 * @return {object} Public interfaces
 */

const Fluency = (function () {
  /**
   * Localized error strings
   * @type {Object}
   */
  const errors = FtConfig.getUiTextFor('errors');

  /**
   * Data Request Methods
   */

  /**
   * Gets a translation from the Fluency module
   * @param  {String}       sourceLanguage ISO language code
   * @param  {String}       targetLanguage ISO langauge code
   * @param  {String|Array} content        Content to translate
   * @param  {Array}        options        Additional options
   * @param  {Bool|null}         caching        Enable/disable caching
   * @return {Promise}
   */
  const getTranslation = (
    sourceLanguage,
    targetLanguage,
    content,
    options = [],
    caching = null
  ) => {
    return postRequest(
      FtConfig.getApiEndpointFor('translation'),
      {
        sourceLanguage: sourceLanguage,
        targetLanguage: targetLanguage,
        content: content,
        options: options,
        caching: caching,
      },
      response => {
        return response;
      }
    );
  };

  /**
   * Gets the current translation service API usage
   * @return {Promise}
   */
  const getUsage = () => {
    return getRequest(FtConfig.getApiEndpointFor('usage'), response => {
      return response;
    });
  };

  /**
   * Get all language available for translation. Provides source/target lists from the translation
   * service API
   * @return {Promise}
   */
  const getAvailableLanguages = () => {
    return getRequest(FtConfig.getApiEndpointFor('languages'), response => {
      return response;
    });
  };

  /**
   * Clear all cached translations
   * @return {Promise}
   */
  const deleteTranslationCache = () => {
    return deleteRequest(FtConfig.getApiEndpointFor('translationCache'), response => {
      return response;
    });
  };

  /**
   * Clear cached list of translatable languages
   * @return {Promise}
   */
  const deleteTranslatableLanguagesCache = () => {
    return deleteRequest(FtConfig.getApiEndpointFor('translatableLanguagesCache'), response => {
      return response;
    });
  };

  /**
   * HTTP Requests
   */

  /**
   * Create headers for AJAX requests
   * @return {Object}
   */
  const requestHeaders = requestType => {
    const requestHeaders = {
      'X-Requested-With': 'XMLHttpRequest',
    };

    if (requestType === 'GET') {
      requestHeaders['Accept'] = 'application/json';
    }

    if (requestType === 'POST') {
      requestHeaders['Content-Type'] = 'application/json';
    }

    return requestHeaders;
  };

  /**
   * Executes a POST request to a given endpoint
   * @param  {String}    endpoint URL for AJAX request
   * @param  {Object}    data     Data for request
   * @param  {Callable}  data     Function to handle response body
   * @return {Promise}
   */
  const postRequest = (endpoint, data, responseHandler) => {
    return fetch(endpoint, {
      method: 'POST',
      cache: 'no-store',
      headers: requestHeaders,
      body: JSON.stringify(data),
    })
      .then(parseResponse)
      .then(responseHandler)
      .catch(handleFetchError);
  };

  /**
   * Executes a GET request to a given endpoint
   * @param  {String}   endpoint        URL for AJAX request
   * @param  {Callable} responseHandler Function to handle response body
   * @return {Promise}
   */
  const getRequest = (endpoint, responseHandler) => {
    return fetch(endpoint, {
      method: 'GET',
      cache: 'no-store',
      headers: requestHeaders('GET'),
    })
      .then(parseResponse)
      .then(responseHandler)
      .catch(handleFetchError);
  };

  /**
   * Executes a DELETE request to a given endpoint
   * @param  {String}   endpoint        URL for AJAX request
   * @param  {Callable} responseHandler Function to handle response body
   * @return {Promise}
   */
  const deleteRequest = (endpoint, responseHandler) => {
    return fetch(endpoint, {
      method: 'DELETE',
      headers: requestHeaders('GET'),
    })
      .then(parseResponse)
      .then(responseHandler)
      .catch(handleFetchError);
  };

  /**
   * Parses response
   * @param  {Object} response Fluency API response
   * @return {Object|Void}
   * @throws Error
   */
  const parseResponse = response => {
    if (response.status === 204) {
      return response;
    }

    if (response.ok) {
      return response.json();
    }

    throw new Error();
  };

  /**
   * Parses and returns results for a fetch error
   * These are network level errors that occur between ProcessWire and the hosting server
   * Any translation or service errors will be located within the response body itself
   * @param  {Error} error Fetch API error object
   * @return {Object}
   */
  const handleFetchError = error => {
    console.error('[Fluency module API failure]', error.message);

    const returnObject = {
      error: null,
      message: null,
    };

    switch (error.message.split(' ')[0]) {
      case 'NetworkError':
        returnObject.error = 'FLUENCY_CLIENT_DISCONNECTED';
        returnObject.message = errors['FLUENCY_CLIENT_DISCONNECTED'];
        break;
      default:
        returnObject.error = 'UNKNOWN_ERROR';
        returnObject.message = errors['UNKNOWN_ERROR'];
        break;
    }

    return returnObject;
  };

  return {
    deleteTranslatableLanguagesCache,
    deleteTranslationCache,
    getAvailableLanguages,
    getTranslation,
    getUsage,
  };
})();

export default Fluency;
