/**
 * MailtoUI - A simple way to enhance your mailto links with a convenient user interface.
 *
 * @link https://mailtoui.com
 * @author Mario Rodriguez - https://twitter.com/mariordev
 * @license MIT
 *
 * MailtoUI is a library that enhances your mailto links with a convenient user interface.
 * It gives your site visitors the flexibility to compose a new email message using a
 * browser-based email client or their default local email application.
 */

/**
 * Let's not step on anybody else's toes.
 */
var mailtouiApp = mailtouiApp || {};

(function(app) {
    /**
     * The html element.
     * @type {Element}
     */
    var html = document.getElementsByTagName('html')[0];

    /**
     * The body element.
     * @type {Element}
     */
    var body = document.getElementsByTagName('body')[0];

    /**
     * The active MailtoUI modal.
     * @type {Element}
     */
    var modal = null;

    /**
     * List of focusable elements within modal.
     * @type {String}
     */
    var focusable = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

    /**
     * The last document element to have focus before the modal was opened.
     * Focus is to be set back on this element after the modal is closed.
     * @type {Element}
     */
    var lastDocElementFocused = null;

    /**
     * The default svg icon for email client buttons.
     * @type {String}
     */
    var worldSvg = `<svg viewBox="0 0 24 24"><g class="nc-icon-wrapper" stroke-linecap="square" stroke-linejoin="miter" stroke-width="2" fill="currentColor" stroke="currentColor"><path data-cap="butt" data-color="color-2" fill="none" stroke-miterlimit="10" d="M5.704,2.979 c0.694,0.513,1.257,1.164,1.767,2.02C7.917,5.746,8.908,7.826,8,9c-1.027,1.328-4,1.776-4,3c0,0.921,1.304,1.972,2,3 c1.047,1.546,0.571,3.044,0,4c-0.296,0.496-0.769,0.92-1.293,1.234" stroke-linecap="butt"/> <path data-cap="butt" data-color="color-2" fill="none" stroke-miterlimit="10" d="M20.668,5.227 C18.509,6.262,15.542,6.961,15,7c-1.045,0.075-1.2-0.784-2-2c-0.6-0.912-2-2.053-2-3c0-0.371,0.036-0.672,0.131-0.966" stroke-linecap="butt"/> <circle fill="none" stroke="currentColor" stroke-miterlimit="10" cx="12" cy="12" r="11"/> <path data-cap="butt" data-color="color-2" fill="none" stroke-miterlimit="10" d="M19.014,12.903 C19.056,15.987,15.042,19.833,13,19c-1.79-0.73-0.527-2.138-0.986-6.097c-0.191-1.646,1.567-3,3.5-3S18.992,11.247,19.014,12.903z" stroke-linecap="butt"/></g></svg>`;

    /**
     * The default svg icon for default email app button.
     * @type {String}
     */
    var uiSvg = `<svg viewBox="0 0 24 24"><g class="nc-icon-wrapper" stroke-linecap="square" stroke-linejoin="miter" stroke-width="2" fill="currentColor" stroke="currentColor"><line data-color="color-2" fill="none" stroke-miterlimit="10" x1="5" y1="6" x2="6" y2="6"/> <line data-color="color-2" fill="none" stroke-miterlimit="10" x1="10" y1="6" x2="11" y2="6"/> <line data-color="color-2" fill="none" stroke-miterlimit="10" x1="15" y1="6" x2="19" y2="6"/> <line fill="none" stroke="currentColor" stroke-miterlimit="10" x1="1" y1="10" x2="23" y2="10"/> <rect x="1" y="2" fill="none" stroke="currentColor" stroke-miterlimit="10" width="22" height="20"/></g></svg>`;

    /**
     * The default svg icon for copy button.
     * @type {String}
     */
    var clipboardSvg = `<svg viewBox="0 0 24 24"><g class="nc-icon-wrapper" stroke-linecap="square" stroke-linejoin="miter" stroke-width="2" stroke="currentColor"><polyline fill="none" stroke="currentColor" stroke-miterlimit="10" points="20,4 22,4 22,23 2,23 2,4 4,4 "/> <path fill="none" stroke="currentColor" stroke-miterlimit="10" d="M14,3c0-1.105-0.895-2-2-2 s-2,0.895-2,2H7v4h10V3H14z"/> <line data-color="color-2" fill="none" stroke-miterlimit="10" x1="7" y1="11" x2="17" y2="11"/> <line data-color="color-2" fill="none" stroke-miterlimit="10" x1="7" y1="15" x2="17" y2="15"/> <line data-color="color-2" fill="none" stroke-miterlimit="10" x1="7" y1="19" x2="11" y2="19"/></g></svg>`;

    /**
     * User options to change MailtoUI's behavior and/or appearance.
     * @type {Object}
     */
    var options = new Object();

    /**
     * Allows for a custom class to namespace css classes.
     * @type {String}
     */
    options.linkClass = 'mailtoui';

    /**
     * When set to true, the modal is closed automatically when email client is clicked.
     * @type {Boolean}
     */
    options.autoClose = true;

    /**
     * When set to true, the modal is not displayed on mobile devices, and the local email app is used automatically.
     * @type {Boolean}
     */
    options.disableOnMobile = true;

    /**
     * The modal title.
     * @type {String}
     */
    options.title = 'Compose new email with';

    /**
     * Text for button 1.
     * @type {String}
     */
    options.buttonText1 = 'Gmail in browser';

    /**
     * Text for button 2.
     * @type {String}
     */
    options.buttonText2 = 'Outlook in browser';

    /**
     * Text for button 3.
     * @type {String}
     */
    options.buttonText3 = 'Yahoo in browser';

    /**
     * Text for button 4.
     * @type {String}
     */
    options.buttonText4 = 'Default email app';

    /**
     * URL of svg file used as icon for button 1.
     * @type {String}
     */
    options.buttonIcon1 = worldSvg;

    /**
     * URL of svg file used as icon for button 2.
     * @type {String}
     */
    options.buttonIcon2 = worldSvg;

    /**
     * URL of svg file used as icon for button 3.
     * @type {String}
     */
    options.buttonIcon3 = worldSvg;

    /**
     * URL of svg file used as icon for button 4.
     * @type {String}
     */
    options.buttonIcon4 = uiSvg;

    /**
     * URL of svg file used as icon for Copy button.
     * @type {String}
     */
    options.buttonIconCopy = clipboardSvg;

    /**
     * Text for Copy button.
     * @type {String}
     */
    options.buttonTextCopy = 'Copy';

    /**
     * Text for Copy button when clicked.
     * @type {String}
     */
    options.buttonTextCopyAction = 'Copied!';

    /**
     * Keep track of the page's scroll position.
     * @type {Number}
     */
    var scrollPosition = 0;

    /**
     * Keep track of the page's original scroll behavior.
     * @type {String}
     */
    var scrollBehavior = 'auto';

    /**
     * Build a style tag with default styling to be embedded on the page.
     *
     * @return {String}     The style tag markup.
     */
    app.buildStyleTag = function() {
        var styleTag = document.createElement('style');
        var css = `.mailtoui-modal{background-color:#000;background-color:rgba(0,0,0,.4);bottom:0;color:#303131;display:none;height:100%;left:0;margin:0;padding:0;position:fixed;right:0;top:0;width:100%;z-index:1000}.mailtoui-modal-content{-webkit-animation:mailtoui-appear .4s;animation:mailtoui-appear .4s;background-color:#f1f5f8;border-radius:8px;bottom:auto;-webkit-box-shadow:0 4px 8px 0 rgba(0,0,0,.2),0 6px 20px 0 rgba(0,0,0,.19);box-shadow:0 4px 8px 0 rgba(0,0,0,.2),0 6px 20px 0 rgba(0,0,0,.19);left:50%;max-height:calc(100% - 100px);overflow:auto;padding:0;position:fixed;right:-45%;top:50%;-webkit-transform:translate(-50%,-50%);transform:translate(-50%,-50%)}.mailtoui-modal-content:focus,.mailtoui-modal-content:hover{overflow-y:auto}@media only screen and (min-width:768px){.mailtoui-modal-content{right:auto}}.mailtoui-modal-head{-webkit-box-align:center;-ms-flex-align:center;align-items:center;background-color:#fff;clear:both;display:-webkit-box;display:-ms-flexbox;display:flex;min-width:0;padding:10px 20px}.mailtoui-modal-title{color:#303131;-webkit-box-flex:1;-ms-flex:1;flex:1;font-family:sans-serif;font-size:120%;font-weight:700;margin:0;overflow:hidden;padding:0;text-overflow:ellipsis;white-space:nowrap}.mailtoui-modal-close{color:#aaa;-webkit-box-flex:initial;-ms-flex:initial;flex:initial;font-size:38px;margin-left:20px;position:relative;text-align:right;text-decoration:none;top:-4px}.mailtoui-modal-close:focus,.mailtoui-modal-close:hover{color:#000;cursor:pointer;font-weight:700;outline:0}.mailtoui-modal-body{height:100%;padding:20px}.mailtoui-button{color:#333;text-decoration:none}.mailtoui-button:focus{outline:0}.mailtoui-button:focus .mailtoui-button-content{background-color:#555;color:#fff}.mailtoui-button-content{background-color:#fff;border:none;border-radius:8px;-webkit-box-shadow:0 2px 4px rgba(0,0,0,.18);box-shadow:0 2px 4px rgba(0,0,0,.18);margin-bottom:20px;overflow:hidden;padding:15px 20px;text-overflow:ellipsis;white-space:nowrap}.mailtoui-button-content:hover{background-color:#555;color:#fff}.mailtoui-button:last-child .mailtoui-button-content{margin-bottom:0}.mailtoui-button-icon{display:inline-block;font-weight:700;position:relative;top:4px}.mailtoui-button-icon svg{height:24px;width:24px}.mailtoui-button-text{display:inline-block;margin-left:5px;position:relative;top:-2px}.mailtoui-copy{border-radius:8px;-webkit-box-shadow:0 2px 4px rgba(0,0,0,.18);box-shadow:0 2px 4px rgba(0,0,0,.18);height:59px;margin-top:20px;position:relative}.mailtoui-button-copy{background-color:#fff;border:none;border-bottom-left-radius:8px;border-top-left-radius:8px;bottom:21px;color:#333;font-size:100%;height:100%;left:0;overflow:hidden;padding:15px 20px;position:absolute;text-overflow:ellipsis;top:0;white-space:nowrap;width:120px}.mailtoui-button-copy:focus,.mailtoui-button-copy:hover{background-color:#555;color:#fff;cursor:pointer;outline:0}.mailtoui-button-copy-clicked,.mailtoui-button-copy-clicked:focus,.mailtoui-button-copy-clicked:hover{background-color:#1f9d55;color:#fff}.mailtoui-button-copy-clicked .mailtoui-button-icon,.mailtoui-button-copy-clicked:focus .mailtoui-button-icon,.mailtoui-button-copy-clicked:hover .mailtoui-button-icon{display:none;visibility:hidden}.mailtoui-button-copy-clicked .mailtoui-button-text,.mailtoui-button-copy-clicked:focus .mailtoui-button-text,.mailtoui-button-copy-clicked:hover .mailtoui-button-text{color:#fff;top:2px}.mailtoui-email-address{background-color:#d8dcdf;border:none;border-radius:8px;-webkit-box-shadow:unset;box-shadow:unset;-webkit-box-sizing:border-box;box-sizing:border-box;color:#48494a;font-size:100%;height:100%;overflow:hidden;padding:20px 20px 20px 140px;text-overflow:ellipsis;white-space:nowrap;width:100%}.mailtoui-brand{color:#888;font-size:80%;margin-top:20px;text-align:center}.mailtoui-brand a{color:#888}.mailtoui-brand a:focus,.mailtoui-brand a:hover{font-weight:700;outline:0}.mailtoui-no-scroll{overflow:hidden;position:fixed;width:100%}.mailtoui-is-hidden{display:none;visibility:hidden}@-webkit-keyframes mailtoui-appear{0%{opacity:0;-webkit-transform:translate(-50%,-50%) scale(0,0);transform:translate(-50%,-50%) scale(0,0)}100%{opacity:1;-webkit-transform:translate(-50%,-50%) scale(1,1);transform:translate(-50%,-50%) scale(1,1)}}@keyframes mailtoui-appear{0%{opacity:0;-webkit-transform:translate(-50%,-50%) scale(0,0);transform:translate(-50%,-50%) scale(0,0)}100%{opacity:1;-webkit-transform:translate(-50%,-50%) scale(1,1);transform:translate(-50%,-50%) scale(1,1)}}`;
        css = css.replace(/mailtoui/g, app.prefix());

        styleTag.setAttribute('id', app.prefix('-styles'));
        styleTag.setAttribute('type', 'text/css');

        if (styleTag.styleSheet) {
            // Required for IE8 and below.
            styleTag.styleSheet.cssText = css;
        } else {
            styleTag.appendChild(document.createTextNode(css));
        }

        return styleTag;
    };

    /**
     * Embed style tag on the page.
     */
    app.embedStyleTag = function() {
        if (app.styleTagExists()) {
            return;
        }

        var firstHeadChild = document.head.firstChild;

        document.head.insertBefore(app.buildStyleTag(), firstHeadChild);
    };

    /**
     * Check if style tag has already been embedded on the page.
     *
     * @return {Boolean}    True if style tag is already embedded.
     */
    app.styleTagExists = function() {
        if (document.getElementById(app.prefix('-styles'))) {
            return true;
        }

        return false;
    };

    /**
     * Build the modal markup.
     *
     * @return {String}     The modal markup.
     */
    app.buildModal = function() {
        var modal = document.createElement('div');

        var markup = `<div class="mailtoui-modal-content"><div class="mailtoui-modal-head"><div id="mailtoui-modal-title" class="mailtoui-modal-title">${
            options.title
        }</div><a id="mailtoui-modal-close" class="mailtoui-modal-close" href="#">&times</a></div><div class="mailtoui-modal-body"><div class="mailtoui-clients"><a id="mailtoui-button-1" class="mailtoui-button" href="#"><div class="mailtoui-button-content"><span id="mailtoui-button-icon-1" class="mailtoui-button-icon">${
            options.buttonIcon1
        }</span> <span id="mailtoui-button-text-1" class="mailtoui-button-text">${
            options.buttonText1
        }</span></div></a><a id="mailtoui-button-2" class="mailtoui-button" href="#"><div class="mailtoui-button-content"><span id="mailtoui-button-icon-2" class="mailtoui-button-icon">${
            options.buttonIcon2
        }</span> <span id="mailtoui-button-text-2" class="mailtoui-button-text">${
            options.buttonText2
        }</span></div></a><a id="mailtoui-button-3" class="mailtoui-button" href="#"><div class="mailtoui-button-content"><span id="mailtoui-button-icon-3" class="mailtoui-button-icon">${
            options.buttonIcon3
        }</span> <span id="mailtoui-button-text-3" class="mailtoui-button-text">${
            options.buttonText3
        }</span></div></a><a id="mailtoui-button-4" class="mailtoui-button" href="#"><div class="mailtoui-button-content"><span id="mailtoui-button-icon-4" class="mailtoui-button-icon">${
            options.buttonIcon4
        }</span> <span id="mailtoui-button-text-4" class="mailtoui-button-text">${
            options.buttonText4
        }</span></div></a></div><div id="mailtoui-copy" class="mailtoui-copy"><div id="mailtoui-email-address" class="mailtoui-email-address"></div><button id="mailtoui-button-copy" class="mailtoui-button-copy" data-copytargetid="mailtoui-email-address"><span id="mailtoui-button-icon-copy" class="mailtoui-button-icon">${
            options.buttonIconCopy
        }</span> <span id="mailtoui-button-text-copy" class="mailtoui-button-text">${
            options.buttonTextCopy
        }</span></button></div><div class="mailtoui-brand"><a href="https://mailtoui.com?ref=ui" target="_blank">Powered by MailtoUI</a></div></div></div>`;

        markup = markup.replace(/mailtoui/g, app.prefix());

        modal.setAttribute('id', app.prefix('-modal'));
        modal.setAttribute('class', app.prefix('-modal'));
        modal.setAttribute('style', 'display: none;');
        modal.setAttribute('aria-hidden', true);
        modal.innerHTML = markup;

        return modal;
    };

    /**
     * Embed modal on the page.
     */
    app.embedModal = function() {
        if (app.modalExists()) {
            return;
        }

        var modal = app.buildModal();
        var firstBodyChild = document.body.firstChild;

        document.body.insertBefore(modal, firstBodyChild);
    };

    /**
     * Check if modal markup has already been embedded on page.
     *
     * @return {Boolean}    True if modal markup ia already embedded.
     */
    app.modalExists = function() {
        if (document.getElementById(app.prefix('-modal'))) {
            return true;
        }

        return false;
    };

    /**
     * Get modal populated with data from the given link.
     *
     * @param   {Element} link  The link that was clicked.
     * @return  {Element}       The modal associated with the given link.
     */
    app.getModal = function(link) {
        app.hydrateModal(link);

        return document.getElementById(app.prefix('-modal'));
    };

    /**
     * Populate current modal with data from the link that was clicked.
     *
     * @param  {Element} link   The link that was clicked.
     */
    app.hydrateModal = function(link) {
        var email = app.getEmail(link);
        var subject = app.getLinkField(link, 'subject');
        var cc = app.getLinkField(link, 'cc');
        var bcc = app.getLinkField(link, 'bcc');
        var body = app.getLinkField(link, 'body');

        var gmail = document.getElementById(app.prefix('-button-1'));
        gmail.href =
            'https://mail.google.com/mail/?view=cm&fs=1&to=' +
            email +
            '&su=' +
            subject +
            '&cc=' +
            cc +
            '&bcc=' +
            bcc +
            '&body=' +
            body;

        var outlook = document.getElementById(app.prefix('-button-2'));
        outlook.href =
            'https://outlook.office.com/owa/?path=/mail/action/compose&to=' +
            email +
            '&subject=' +
            subject +
            '&body=' +
            body;

        var yahoo = document.getElementById(app.prefix('-button-3'));
        yahoo.href =
            'https://compose.mail.yahoo.com/?to=' +
            email +
            '&subject=' +
            subject +
            '&cc=' +
            cc +
            '&bcc=' +
            bcc +
            '&body=' +
            body;

        var defaultApp = document.getElementById(app.prefix('-button-4'));
        defaultApp.href = 'mailto:' + email + '?subject=' + subject + '&cc=' + cc + '&bcc=' + bcc + '&body=' + body;

        var emailField = document.getElementById(app.prefix('-email-address'));
        emailField.innerHTML = email;

        var buttonIcon1 = document.getElementById(app.prefix('-button-icon-1'));
        buttonIcon1.innerHTML = options.buttonIcon1;

        var buttonIcon2 = document.getElementById(app.prefix('-button-icon-2'));
        buttonIcon2.innerHTML = options.buttonIcon2;

        var buttonIcon3 = document.getElementById(app.prefix('-button-icon-3'));
        buttonIcon3.innerHTML = options.buttonIcon3;

        var buttonIcon4 = document.getElementById(app.prefix('-button-icon-4'));
        buttonIcon4.innerHTML = options.buttonIcon4;

        var buttonIconCopy = document.getElementById(app.prefix('-button-icon-copy'));
        buttonIconCopy.innerHTML = options.buttonIconCopy;

        app.toggleHideCopyUi(email);
    };

    /**
     * When the modal is displayed, the "no-scroll" class sets the body's position to fixed. This has the
     * side effect of the page getting scrolled to the top. To counter that, we need to save the scroll
     * position when the modal is displayed, so it can be restored later on when the modal is closed.
     */
    app.savePageScrollPosition = function() {
        scrollPosition = window.pageYOffset;
        body.style.top = -scrollPosition + 'px';
    };

    /**
     * When the modal is closed, we need to reset the page scroll position. Needed due to
     * the position:fixed being set by the "no-scroll" class on the body element when
     * the modal is open. Refer to savePageScrollPosition() method for details.
     */
    app.restorePageScrollPosition = function() {
        window.scrollTo(0, scrollPosition);
        body.style.top = 0;
    };

    /**
     * Save the page's current scroll behavior AND set it to auto, in case the current
     * scroll behavior is set to smooth. This prevents smooth scrolling from showing
     * when scrollPosition is restored via restorePageScrollPosition() method.
     */
    app.saveScrollBehavior = function() {
        scrollBehavior = html.style.scrollBehavior;
        html.style.scrollBehavior = 'auto';
    };

    /**
     * Restore the original page scroll behavior saved by saveScrollBehavior().
     */
    app.restoreScrollBehavior = function() {
        html.style.scrollBehavior = scrollBehavior;
    };

    /**
     * Save the last doc element to have focus before displaying modal,
     * so that we can reset focus to it when the modal is closed.
     */
    app.saveLastDocElementFocused = function() {
        lastDocElementFocused = document.activeElement;
    };

    /**
     * Open modal.
     *
     * @param  {Object} event   The object created by the event.
     */
    app.openModal = function(event) {
        if (options.disableOnMobile && app.isMobileDevice()) {
            return;
        }

        event.preventDefault();

        app.saveLastDocElementFocused();
        app.savePageScrollPosition();
        app.saveScrollBehavior();

        app.displayModal(event);

        app.hideModalFromScreenReader(false);
        app.enablePageScrolling(false);
        app.modalFocus();
        app.triggerEvent(modal, 'open');
    };

    /**
     * Display modal and carry out other tasks needed when modal is open.
     *
     * @param  {Object} event   The object created by the event.
     */
    app.displayModal = function(event) {
        var link = app.getParentElement(event.target, 'a');
        modal = app.getModal(link);
        modal.style.display = 'block';
    };

    /**
     * Set focus on the first button in the modal.
     */
    app.modalFocus = function() {
        modal.focusableChildren = Array.from(modal.querySelectorAll(focusable));
        modal.focusableChildren[1].focus();
    };

    /**
     * Close modal.
     *
     * @param  {Object} event   The object created by the event.
     */
    app.closeModal = function(event) {
        event.preventDefault();

        app.hideModal();

        app.enablePageScrolling(true);
        app.restorePageScrollPosition();
        app.restoreScrollBehavior();
        app.docRefocus();
        app.triggerEvent(modal, 'close');
    };

    /**
     * Hide modal.
     */
    app.hideModal = function() {
        app.hideModalFromScreenReader(true);

        if (app.isDefined(modal)) {
            modal.style.display = 'none';
        }
    };

    /**
     * Set aria attributes to hide modal from screen readers.
     *
     * @param {Boolean}     hidden  True to hide modal from screen reader. False otherwise.
     */
    app.hideModalFromScreenReader = function(hidden) {
        if (app.isDefined(modal)) {
            modal.setAttribute('aria-hidden', hidden);
        }
    };

    /**
     * Toggle a css class to enable/disable page scrolling.
     *
     * @param  {Boolean} enabled    True to enable page scrolling. False to disable it.
     */
    app.enablePageScrolling = function(enabled) {
        if (enabled) {
            body.classList.remove(app.prefix('-no-scroll'));
            html.classList.remove(app.prefix('-no-scroll'));
        } else {
            body.classList.add(app.prefix('-no-scroll'));
            html.classList.add(app.prefix('-no-scroll'));
        }
    };

    /**
     * Set focus back on the last element focused on the page.
     */
    app.docRefocus = function() {
        lastDocElementFocused.focus();
    };

    /**
     * Open the given client link element.
     *
     * @param  {Element}    element     The client link that was clicked.
     * @param  {Object}     event       The object created by the event.
     */
    app.openClient = function(element, event) {
        var target = '_blank';

        if (app.isDefaultEmailAppButton(element)) {
            target = '_self';
        }

        window.open(element.href, target);

        app.triggerEvent(element, 'compose');

        if (options.autoClose) {
            app.closeModal(event);
        }
    };

    /**
     * Determine if the given element is the Default Email App button.
     *
     * @param {Element}     element     The element to be checked.
     * @return {Boolean}                True if the given element's id corresponds to button 4.
     */
    app.isDefaultEmailAppButton = function(element) {
        return element.id == app.prefix('-button-4');
    };

    /**
     * When an anchor tag (<a>) contains other elements, the element returned can vary
     * depending on where you click. We need to search up the DOM tree until we find
     * the parent anchor tag, which is the element that was intended to be clicked.
     *
     * @param   {Element}   element     The element that was clicked.
     * @return  {Element}               The parent anchor tag of the element that was clicked.
     */
    app.getParentElement = function(element, parentTag) {
        while (element !== null) {
            if (element.tagName.toUpperCase() == parentTag.toUpperCase()) {
                return element;
            }

            element = element.parentNode;
        }

        return null;
    };

    /**
     * Fire up an event for the given element.
     *
     * @param  {Element}    element     Trigger event for this element.
     * @param  {String}     eventName   The name of the event to be triggered.
     */
    app.triggerEvent = function(element, eventName) {
        var event = new Event(eventName);

        element.dispatchEvent(event);
    };

    /**
     * Check if device is a mobile phone or tablet.
     */
    app.isMobileDevice = function() {
        var check = false;

        (function(a) {
            if (
                /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(
                    a
                ) ||
                /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(
                    a.substr(0, 4)
                )
            ) {
                check = true;
            }
        })(navigator.userAgent || navigator.vendor || window.opera);
        return check;
    };

    /**
     * Listen for events.
     */
    app.listenForEvents = function() {
        app.listenForClickOnLink();
        app.listenForClickOnClient();
        app.listenForClickOnCopy();
        app.listenForClickOnClose();
        app.listenForClickOnWindow();
        app.listenForKeys();
    };

    /**
     * Listen for click event on mailto links.
     */
    app.listenForClickOnLink = function() {
        var links = document.getElementsByClassName(app.prefix());

        for (var i = 0; i < links.length; i++) {
            links[i].addEventListener(
                'click',
                function(event) {
                    app.openModal(event);
                },
                false
            );
        }
    };

    /**
     * Listen for click event on client links.
     */
    app.listenForClickOnClient = function() {
        var clients = document.getElementsByClassName(app.prefix('-button'));

        for (var i = 0; i < clients.length; i++) {
            clients[i].addEventListener(
                'click',
                function(event) {
                    event.preventDefault();
                    event.stopPropagation();

                    var client = app.getParentElement(event.target, 'a');

                    app.openClient(client, event);
                },
                false
            );
        }
    };

    /**
     * Listen for click event on Copy button.
     */
    app.listenForClickOnCopy = function() {
        var copyButton = document.getElementById(app.prefix('-button-copy'));

        copyButton.addEventListener(
            'click',
            function(event) {
                app.copy(event);
            },
            false
        );
    };

    /**
     * Listen for click event on Close button.
     */
    app.listenForClickOnClose = function() {
        var closeButton = document.getElementById(app.prefix('-modal-close'));

        closeButton.addEventListener(
            'click',
            function(event) {
                app.closeModal(event);
            },
            false
        );
    };

    /**
     * Listen for click event on window (to close modal).
     */
    app.listenForClickOnWindow = function() {
        window.addEventListener(
            'click',
            function(event) {
                var element = event.target;

                if (element !== null && element.classList.contains(app.prefix('-modal'))) {
                    app.closeModal(event);
                }
            },
            false
        );
    };

    /**
     * Listen for keydown events to escape modal or tab within it.
     */
    app.listenForKeys = function() {
        document.addEventListener(
            'keydown',
            function(event) {
                app.escapeModal(event);
                app.trapTabWithinModal(event);
            },
            false
        );
    };

    /**
     * Close modal when Esc key is pressed.
     *
     * @param {KeyboardEvent}   event   The event generated by pressing a key.
     */
    app.escapeModal = function(event) {
        if (event.keyCode === 27) {
            app.closeModal(event);
        }
    };

    /**
     * Should not be able to tab outside the modal. Pressing the tab
     * key moves focus to the next focusable element within modal.
     *
     * @param {KeyboardEvent}   event     The event generated by pressing a key.
     */
    app.trapTabWithinModal = function(event) {
        if (event.keyCode === 9 && modal !== null) {
            var currentFocus = document.activeElement;
            var totalFocusable = modal.focusableChildren.length;
            var focusedIndex = modal.focusableChildren.indexOf(currentFocus);

            if (event.shiftKey) {
                if (focusedIndex === 0) {
                    event.preventDefault();
                    modal.focusableChildren[totalFocusable - 1].focus();
                }
            } else {
                if (focusedIndex == totalFocusable - 1) {
                    event.preventDefault();
                    modal.focusableChildren[0].focus();
                }
            }
        }
    };

    /**
     * Get all "mailtoui" links on the page.
     *
     * @return {HTMLCollection}     All links with the class "mailtoui" (default).
     */
    app.getLinks = function() {
        return document.getElementsByClassName(app.prefix());
    };

    /**
     * Split the URL scheme of given link in two strings: the email address, and the
     * key-value query string. Also remove 'mailto:' to get nice clean values.
     *
     * @param  {Element}    link    The link element clicked.
     * @return {Array}              The two parts of the link scheme separated at '?'.
     */
    app.splitLink = function(link) {
        var scheme = link.href.replace('mailto:', '').trim();
        var parts = scheme.split('?', 1);

        if (parts !== null && parts.length > 0) {
            parts[1] = scheme.replace(parts[0] + '?', '').trim();
        }

        return parts;
    };

    /**
     * Extract the value of the given field from the link.
     *
     * @param   {Element}   link    The link element clicked.
     * @param   {String}    field   The name of the field we want to get.
     * @return  {String}            The value corresponding to the given field.
     */
    app.getLinkField = function(link, field) {
        var parts = app.splitLink(link);
        var query = '';
        var terms = [];
        var keyValues = [];
        var value = '';

        if (parts !== null && parts.length > 0) {
            query = parts[1];
        }

        if (query !== null && query.length > 0) {
            // Encode any instance of ' & ' inside field values to prevent spliting at the wrong place.
            query = query.replace('%20&%20', '%20%26%20');

            terms = query.split('&');
        }

        for (var i = 0; i < terms.length; i++) {
            // Encode any instance of ' = ' inside field values to prevent spliting at the wrong place.
            terms[i] = terms[i].replace('%20=%20', '%20%3D%20');

            keyValues = terms[i].split('=');

            for (var n = 0; n < keyValues.length; n++) {
                if (keyValues[0] == field) {
                    return keyValues[1];
                }
            }
        }

        return value;
    };

    /**
     * Extract email address from mailto string.
     *
     * @param  {Element}    link    The link element clicked.
     * @return {String}             The email address.
     */
    app.getEmail = function(link) {
        var parts = app.splitLink(link);
        var email = '';

        if (parts !== null && parts.length > 0) {
            email = parts[0];
        }

        return decodeURIComponent(email);
    };

    /**
     * Build and return the class name used to hide the Copy UI.
     *
     * @return {String}     The CSS class name needed to hide the Copy UI.
     */
    app.getClassHideCopyUi = function() {
        return app.prefix('-is-hidden');
    };

    /**
     * Show or hide the Copy UI based on email address presence.
     *
     * @param {String} email    The email address to be checked.
     */
    app.toggleHideCopyUi = function(email) {
        var copyUi = document.getElementById(app.prefix('-copy'));

        if (email.length == 0) {
            copyUi.classList.add(app.getClassHideCopyUi());
        } else {
            copyUi.classList.remove(app.getClassHideCopyUi());
        }
    };

    /**
     * Set copy button text to indicate the email address has been copied.
     */
    app.toggleCopyButton = function() {
        button = document.getElementById(app.prefix('-button-copy'));
        buttonText = document.getElementById(app.prefix('-button-text-copy'));
        buttonText.innerHTML = options.buttonTextCopyAction;
        button.classList.add(app.prefix('-button-copy-clicked'));

        setTimeout(function() {
            buttonText.innerHTML = options.buttonTextCopy;
            button.classList.remove(app.prefix('-button-copy-clicked'));
        }, 600);
    };

    /**
     * Copy email address to the clipboard.
     *
     * @param {String}  event   The event generated by clicking on Copy button.
     */
    app.copy = function(event) {
        event.preventDefault();

        var targetId = app.getParentElement(event.target, 'button').getAttribute('data-copytargetid');
        var email = document.getElementById(targetId);
        var range = document.createRange();

        range.selectNodeContents(email);

        var selection = window.getSelection();
        selection.removeAllRanges();
        selection.addRange(range);

        document.execCommand('copy');
        app.triggerEvent(email, 'copy');

        app.toggleCopyButton();
    };

    /**
     * Check if device is running iOS.
     *
     * @return {Boolean}    True if device runs iOS.
     */
    app.isiOSDevice = function() {
        return navigator.userAgent.match(/ipad|iphone/i);
    };

    /**
     * Get user options provided as an object parameter in the run
     * method, or as a JSON string provided in a data attribute
     * of the script tag. Save all in the options object.
     *
     * @param {Object}  optionsObj  An object containing user options.
     */
    app.setOptions = function(optionsObj) {
        if (optionsObj) {
            var userOptions = JSON.stringify(optionsObj);
        } else {
            var userOptions = app.getOptionsFromScriptTag();
        }

        if (userOptions && userOptions.trim().length > 0) {
            userOptions = JSON.parse(userOptions);

            for (var name in options) {
                if (userOptions.hasOwnProperty(name)) {
                    options[name] = app.sanitizeUserOption(name, userOptions[name]);
                }
            }
        }
    };

    /**
     * Clean up given user options.
     *
     * @param  {String} name    The name of the user option to be sanitized.
     * @param  {mixed} value    The value of the user option.
     * @return {mixed}          The sanitized value when applicable, or the original value.
     */
    app.sanitizeUserOption = function(name, value) {
        if (app.stringContains(name, 'icon')) {
            return app.validateSvg(name, value);
        }

        if (app.isString(value)) {
            return app.stripHtml(value);
        }

        return value;
    };

    /**
     * Check svg file for possible problems or tampering.
     *
     * @param   {String} name   The name of an 'icon' user option (must exist in options array).
     * @param   {String} url    The url to an svg file.
     */
    app.validateSvg = function(name, url) {
        app.getSvg(name, url)
            .then(function(promise) {
                if (!app.stringIsSvg(promise.responseText)) {
                    throw new Error(name + ': ' + url + ' is not an SVG file.');
                }

                if (app.stringHasScript(promise.responseText)) {
                    throw new Error(name + ': ' + url + ' is an invalid SVG file.');
                } else {
                    options[name] = promise.responseText;
                }
            })
            .catch(function(error) {
                if (name == 'buttonIconCopy') {
                    options[name] = clipboardSvg;
                } else {
                    options[name] = worldSvg;
                }
                console.log(error);
            });
    };

    /**
     * Load an svg file from the given url.
     *
     * @param   {String} name   The name of an 'icon' user option (must exist in options array).
     * @param   {String} url    The url to an svg file.
     * @return  {Promise}       The resolved or rejected promise after ajax call to load svg file.
     */
    app.loadSvg = function(name, url) {
        return new Promise((resolve, reject) => {
            var ajax = new XMLHttpRequest();

            ajax.open('GET', url, true);

            ajax.onload = function(event) {
                if (ajax.status == 200) {
                    resolve(ajax);
                } else {
                    reject(ajax);
                }
            };

            ajax.send();
        });
    };

    /**
     * Async method to load svg file from given url.
     *
     * @param  {String} name    The name of an 'icon' user option (must exist in options array).
     * @param  {String} url     The url to an svg file.
     * @return {Promise}        The Promise with the result returned by loadSvg().
     */
    app.getSvg = async function(name, url) {
        return await app.loadSvg(name, url);
    };

    /**
     * Check if given value is a string.
     *
     * @param  {mixed}  value   The value to be checked.
     * @return {Boolean}        True if value is a string. False otherwise.
     */
    app.isString = function(value) {
        return typeof value === 'string';
    };

    /**
     * Remove html tags from given string.
     *
     * @param  {String} text    The string to be stripped.
     * @return {String}         The given string stripped off markup tags.
     */
    app.stripHtml = function(text) {
        return text.replace(/(<([^>]+)>)/g, '');
    };

    /**
     * Check if a string contains another string ("needle in a haystack").
     *
     * @param  {String} haystack    The string where to search.
     * @param  {String} needle      The string to search for.
     * @return {Boolean}            True if needle is found in haystack. False otherwise.
     */
    app.stringContains = function(haystack, needle) {
        return haystack.toLowerCase().indexOf(needle.toLowerCase()) !== -1;
    };

    /**
     * Check if given string is an svg file.
     *
     * @param  {String} text    The string to be checked.
     * @return {Boolean}        True if string starts with '<svg'. False otherwise.
     */
    app.stringIsSvg = function(text) {
        return text.startsWith('<svg');
    };

    /**
     * Check if given string contains an embedded <script> tag.
     *
     * @param  {String} text    The string to be checked.
     * @return {Boolean}        True if given string contains <script>. False otherwise.
     */
    app.stringHasScript = function(text) {
        return app.stringContains(text, '<script');
    };

    /**
     * Check if the given item is defined.
     *
     * @param {mixed}      item    The item to be checked.
     * @return {Boolean}            True if the given item is defined. False otherwise.
     */
    app.isDefined = function(item) {
        return typeof item !== 'undefined';
    };

    /**
     * Read options passed in the data-options attribute of the script tag.
     *
     * @return {String}     Options string provided in JSON format.
     */
    app.getOptionsFromScriptTag = function() {
        var scripts = document.getElementsByTagName('script');
        var scriptName = scripts[scripts.length - 1];

        return scriptName.getAttribute('data-options');
    };

    /**
     * Append the linkClass user option to the given string.
     *
     * @param   {String}  text      The string to which the linkClass will be appended.
     * @return  {String}            The linkClass user option appended to the given string.
     */
    app.prefix = function(text = '') {
        return options.linkClass + text;
    };

    /**
     * Let's kick things off.
     * @param {Object}  optionsObj  An object containing user options.
     */
    app.run = function(optionsObj = null) {
        app.setOptions(optionsObj);

        app.embedModal();

        app.embedStyleTag();

        app.listenForEvents();
    };
})(mailtouiApp);

/**
 * Are we loaded in the browser? If so, run MailtoUI automatically.
 * Otherwise, make MailtoUI available to the outside world so
 * it can be triggered (run) manually when appropriate.
 */
if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    // We're not in the browser.
    module.exports = {
        run: mailtouiApp.run
    };
} else {
    // We're in the browser.
    mailtouiApp.run();
}
