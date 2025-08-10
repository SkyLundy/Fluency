import FtConfig from '../global/FtConfig';

/**
 * Creates, inserts, and controls the actions the activity overlay for the provided
 * targetContainer
 * @param {object} targetContainer An instantiated object for an inputfield or fieldset
 * @param {string} type       The type of activity for this overlay. 'translate' or 'update'
 */
const FtActivityOverlay = function (targetContainer, activityType = 'translating') {
  const elClasses = {
    parent: 'ft-activity-overlay-container',
    overlay: 'ft-activity-overlay',
    error: 'error',
    message: 'message',
    flash: 'flash',
    success: 'success',
    activity: 'activity',
    visible: 'visible',
    activityContainer: 'ft-activity',
    activityStaticText: 'ft-activity-text',
    activityAnimationContainer: 'ft-activity-animation-container',
    activityAnimationItem: 'ft-activity-animation-item',
    messageContainer: 'ft-activity-message',
  };

  /**
   * Will contain the activityOverlay Element for this targetContainer
   * @type {Element}
   */
  let activityOverlay;

  /**
   * Will contain the message Element for this targetContainer's activityOverlay
   * @type {Element}
   */
  let messageContainer;

  /**
   * Will contain the animation container Element for this targetContainer's activityOverlay
   * @type {Element}
   */
  let activityContainer;

  /**
   * Control Methods
   */

  /**
   * This shows the overlay's activity animation that was created at instantiation
   * Must be manually hidden with the hide() method
   *
   * @return {void}
   */
  this.showActivity = () => {
    this.setActivityActive();
    this.setOverlayVisible();
  };

  /**
   * Shows a message in the overlay (neutral background)
   * @param  {String} message     Text to display
   * @param  {Number} displayTime Length of time in ms before hiding overlay after shown
   * @return {void}
   */
  this.showMessage = (message, displayTime = 5000) => {
    this.setMessageContent(message);
    this.setActivityInactive();
    this.setMessageActive();
    this.setOverlayVisible();
    this.hide(displayTime);
  };

  /**
   * Shows a success message (success color background)
   *
   * @param  {String} message     Text to display
   * @param  {Number} displayTime Length of time in ms before hiding overlay after shown
   * @return {[type]}             [description]
   */
  this.flashSuccess = (message, displayTime = 500) => {
    this.setSuccessActive();
    this.setFlashActive();
    this.showMessage(message, displayTime);
  };

  /**
   * Shows a success message (error color background)
   *
   * @param  {String} message     Text to display
   * @param  {Number} displayTime Length of time in ms before hiding overlay after shown
   * @return {[type]}             [description]
   */
  this.flashError = (message, displayTime = 500) => {
    this.setFlashActive();
    this.setErrorActive();
    this.showMessage(message, displayTime);
  };

  /**
   * Shows an error message in a visible overlay (error background)
   *
   * @param  {String} message     Message to show in overlay error
   * @param  {Number} displayTime Length of time in ms before hiding overlay after shown
   * @return {void}
   */
  this.showError = (message, displayTime = 7000) => {
    this.setErrorActive();
    this.showMessage(message, displayTime);
  };

  /**
   * Hide an overlay immediately or after a preset amount of time
   *
   * @param {Number} delay Length of time in ms before hiding overlay
   */
  this.hide = (delay = 0) => {
    setTimeout(() => {
      this.setOverlayInvisible();
    }, delay);

    // Ensures the animation is finished before modifying content
    setTimeout(() => {
      this.setActivityInactive();
      this.setMessageInactive();
      this.setErrorInactive();
      this.setFlashInactive();
      this.setMessageContent('');
    }, delay + 500);
  };

  /**
   * Private Methods
   */

  /**
   * Shows the activity element
   *
   * @access Private
   */
  this.setActivityActive = () => {
    activityOverlay.classList.add(elClasses.activity);
  };

  /**
   * Hides the activity element
   *
   * @access Private
   */
  this.setActivityInactive = () => {
    activityOverlay.classList.remove(elClasses.activity);
  };

  /**
   * Shows the message element
   *
   * @access Private
   */
  this.setMessageActive = () => {
    activityOverlay.classList.add(elClasses.message);
  };

  /**
   * Hides the activity element
   *
   * @access Private
   */
  this.setMessageInactive = () => {
    activityOverlay.classList.remove(elClasses.message);
  };

  /**
   * Sets the content of the overlay message
   *
   * @access Private
   */
  this.setMessageContent = content => {
    messageContainer.innerText = content;
  };

  /**
   * Adds flashing overlay behavior
   *
   * @access Private
   */
  this.setFlashActive = content => {
    activityOverlay.classList.add(elClasses.flash);
  };

  /**
   * removes flashing overlay behavior
   *
   * @access Private
   */
  this.setFlashInactive = content => {
    activityOverlay.classList.remove(elClasses.flash);
  };

  /**
   * Sets message to success
   *
   * @access Private
   */
  this.setSuccessActive = () => {
    activityOverlay.classList.add(elClasses.success);
  };

  /**
   * Unsets message error
   *
   * @access Private
   */
  this.setSuccessInactive = () => {
    activityOverlay.classList.remove(elClasses.success);
  };

  /**
   * Sets message to error
   *
   * @access Private
   */
  this.setErrorActive = () => {
    activityOverlay.classList.add(elClasses.error);
  };

  /**
   * Unsets message error
   *
   * @access Private
   */
  this.setErrorInactive = () => {
    activityOverlay.classList.remove(elClasses.error);
  };

  /**
   * Shows this activity overlay
   *
   * @access Private
   */
  this.setOverlayVisible = () => {
    activityOverlay.classList.add(elClasses.visible);
  };

  this.setOverlayInvisible = () => {
    activityOverlay.classList.remove(elClasses.visible);
  };

  /**
   * Creates and returns an activity overlay element
   *
   * @return {HTMLElement}
   */
  this.create = () => {
    activityOverlay = this.buildOverlayEl();
    activityContainer = this.buildActivityEl();
    messageContainer = this.buildMessageEl();

    activityOverlay.appendChild(activityContainer);
    activityOverlay.appendChild(messageContainer);

    return activityOverlay;
  };

  /**
   * Creates the parent overlay element
   *
   * @return {Element}
   * @access Private
   */
  this.buildOverlayEl = () => {
    const overlay = document.createElement('div');

    // overlay.setAttribute('data-gradient-1', 'rgba(62, 185, 152, .85)');
    overlay.setAttribute('class', elClasses.overlay);

    return overlay;
  };

  /**
   * Creates container for animation and contents of animation
   *
   * @return {Element}
   * @access Private
   */
  this.buildActivityEl = () => {
    let text = this.getActivityTexts();

    let activityAnimationContainer = document.createElement('div');
    activityAnimationContainer.setAttribute('class', elClasses.activityAnimationContainer);

    // Add all animation items to the animation container
    activityAnimationContainer = text.animated.reduce((el, string) => {
      let activityText = document.createElement('span');

      // Add text items
      activityText.setAttribute('class', elClasses.activityAnimationItem);
      activityText.innerHTML = string;

      el.appendChild(activityText);

      return el;
    }, activityAnimationContainer);

    // Create static text element
    let staticText = document.createElement('div');
    staticText.setAttribute('class', elClasses.activityStaticText);
    staticText.innerText = text.static;

    // Create activity container and append children
    activityContainer = document.createElement('div');
    activityContainer.setAttribute('class', elClasses.activityContainer);

    activityContainer.appendChild(staticText);
    activityContainer.appendChild(activityAnimationContainer);

    return activityContainer;
  };

  /**
   * Gets activity overlay texts and shuffles the animated array
   * No purpose really other than to add some uniqueness to overlay animations and prevent looking
   * like one language was preferred by me over another.
   *
   * Fisher-Yates algorithm, for the curious
   *
   * @return {Array} Randomized array of the activity animation texts for this instance
   * @access Private
   */
  this.getActivityTexts = () => {
    let uiTexts = FtConfig.getUiTextFor('activityOverlay')[activityType];
    let animationTexts = uiTexts.animated;

    for (let i = animationTexts.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1));
      let temp = animationTexts[i];

      animationTexts[i] = animationTexts[j];
      animationTexts[j] = temp;
    }

    uiTexts.animated = animationTexts;

    return uiTexts;
  };

  /**
   * Builds the element that will hold messages in the overlay
   *
   * @return {Element}
   * @access Private
   */
  this.buildMessageEl = () => {
    messageContainer = document.createElement('div');
    messageContainer.setAttribute('class', elClasses.messageContainer);

    return messageContainer;
  };

  (() => {
    const targetContainerContainer = targetContainer.getSelf();

    activityOverlay = this.create();

    targetContainerContainer.classList.add(elClasses.parent);
    targetContainerContainer.appendChild(activityOverlay);
  })();
};

export default FtActivityOverlay;
