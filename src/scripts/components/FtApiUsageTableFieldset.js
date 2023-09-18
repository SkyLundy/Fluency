import Fluency from '../global/Fluency';
import FtConfig from '../global/FtConfig';
import FtActivityOverlay from '../ui/FtActivityOverlay';

/**
 * Primary initialization object
 * This initializes all tables available in markup in the event there are multiple but some not
 * visible
 *
 * @return {Object} Public methods
 */
const FtApiUsageTableFieldset = (function () {
  /**
   * Attribute present on initialized instances
   * @type {String}
   */
  const initializedAttr = 'data-ft-initialized';

  /**
   * Initialize all API usage tables on page
   *
   * @return {void}
   */
  const init = () => {
    if (!FtConfig.getEngineProvidesUsageData()) {
      return;
    }

    const translationApiUsageTables = document.querySelectorAll(
      `.ft-api-usage-table-fieldset:not([${initializedAttr}])`
    );

    [...translationApiUsageTables].forEach(el => {
      new initializeApiUsageTableFieldset(el);
    });
  };

  return {
    init,
    initializedAttr,
  };
})();

/**
 * Creates a bound object for an API Usage Table
 * @param  {Element} fieldset Fieldset that contains all of the API Usage Table Element
 * @return {void}
 */
const initializeApiUsageTableFieldset = function (fieldset) {
  /**
   * Contains the activityOverlay
   * @type {Object}
   */
  let activityOverlay;

  /**
   * Values are classes that will be replaced with their associated HTML element on initialization
   * @type {Object}
   */
  const usageTableElements = {
    unit: 'ft-usage-unit',
    limit: 'ft-usage-limit',
    used: 'ft-usage-used',
    remaining: 'ft-usage-remaining',
    total: 'ft-usage-total',
    refreshButton: 'js-ft-refresh-usage',
  };

  this.getSelf = () => fieldset;

  /**
   * Updates translation API usage table with data from API
   * @return {Void}
   */
  this.updateView = () => {
    activityOverlay.showActivity();

    Fluency.getUsage().then(result => {
      if (result.error) {
        activityOverlay.showError(result.message);
        return;
      }

      usageTableElements.unit.innerText = result.unit;
      usageTableElements.limit.innerText = result.limit;
      usageTableElements.remaining.innerText = result.remaining;
      usageTableElements.used.innerText = result.used;
      usageTableElements.total.innerText = result.percentUsed;

      activityOverlay.hide();
    });
  };

  /**
   * Binds behavior to refresh button
   * @return {void}
   */
  this.bindRefreshButton = () => {
    usageTableElements.refreshButton.addEventListener('click', e => {
      e.preventDefault();

      this.updateView();
    });
  };

  (() => {
    for (let [elType, className] of Object.entries(usageTableElements)) {
      usageTableElements[elType] = fieldset.querySelector(`.${className}`);
    }

    activityOverlay = new FtActivityOverlay(this, 'refreshing');

    this.bindRefreshButton();

    fieldset.setAttribute(FtApiUsageTableFieldset.initializedAttr, true);
  })();
};

export default FtApiUsageTableFieldset;
