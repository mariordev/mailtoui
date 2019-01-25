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
     * The body element.
     */
    var body = window.document.getElementsByTagName('body')[0];

    /**
     * The active MailtoUI modal.
     */
    var modal = null;

    /**
     * List of focusable elements within modal.
     */
    var focusable = 'a[href], input:not([disabled]), button:not([disabled]), [tabindex]:not([tabindex="-1"])';

    /**
     * The last document element to have focus before the modal was opened.
     * Focus is to be set back on this element after the modal is closed.
     */
    var lastDocElementFocused = null;

    /**
     * User options to change MailtoUI's behavior.
     */
    var options = new Object();

    /**
     * Allows for a custom class to namespace css classes.
     */
    options.linkClass = 'mailtoui';

    /**
     * When set to true, the modal is closed automatically when email client is clicked.
     */
    options.autoClose = true;

    /**
     * Keep track of the page's scroll position.
     */
    scrollPosition = 0;

    /**
     * Build a style tag with default styling to be embedded on the page.
     *
     * @return {string} The style tag markup.
     */
    app.buildStyleTag = function() {
        var styleTag = window.document.createElement('style');
        var css = `.mailtoui-modal{background-color:#000;background-color:rgba(0,0,0,.4);bottom:0;color:#303131;display:none;height:100%;left:0;margin:0;padding:0;position:fixed;right:0;top:0;width:100%;z-index:1000}.mailtoui-modal-content{-webkit-animation:appear .4s;animation:appear .4s;background-color:#f1f5f8;border-radius:8px;bottom:auto;-webkit-box-shadow:0 4px 8px 0 rgba(0,0,0,.2),0 6px 20px 0 rgba(0,0,0,.19);box-shadow:0 4px 8px 0 rgba(0,0,0,.2),0 6px 20px 0 rgba(0,0,0,.19);left:50%;max-height:calc(100% - 100px);overflow:scroll;padding:0;position:fixed;right:-45%;top:50%;-webkit-transform:translate(-50%,-50%);transform:translate(-50%,-50%)}.mailtoui-modal-content:focus,.mailtoui-modal-content:hover{overflow-y:auto}@media only screen and (min-width :768px){.mailtoui-modal-content{right:auto}}.mailtoui-modal-head{background-color:#fff;clear:both;padding:20px}.mailtoui-modal-title{font-size:100%;font-weight:700;margin:0;padding:0}.mailtoui-modal-close{color:#aaa;float:right;font-size:38px;font-weight:700;position:relative;top:-12px}.mailtoui-modal-close:focus,.mailtoui-modal-close:hover{color:#000;cursor:pointer;text-decoration:none}.mailtoui-modal-body{height:100%;padding:20px}.mailtoui-client{color:#333;outline:0;text-decoration:none}.mailtoui-client:focus .mailtoui-label{background-color:#555;color:#fff}.mailtoui-label{background-color:#fff;border-radius:8px;-webkit-box-shadow:0 2px 4px rgba(0,0,0,.18);box-shadow:0 2px 4px rgba(0,0,0,.18);margin-bottom:20px;padding:15px 20px}.mailtoui-label:hover{background-color:#555;color:#fff}.mailtoui-client:last-child .mailtoui-label{margin-bottom:0}.mailtoui-label-icon{font-weight:700;position:relative;top:4px}.mailtoui-label-text{margin-left:5px}.mailtoui-copy{border-radius:8px;margin-top:20px;position:relative;-webkit-box-shadow:0 2px 4px rgba(0,0,0,.18);box-shadow:0 2px 4px rgba(0,0,0,.18);height:59px}.mailtoui-copy-button{background-color:#fff;border:none;border-top-right-radius:8px;border-bottom-right-radius:8px;bottom:21px;color:#303131;font-size:100%;height:100%;outline:0;position:absolute;right:0;top:0;width:100px}.mailtoui-copy-button:focus,.mailtoui-copy-button:hover{background-color:#555;color:#fff;cursor:pointer;outline:0}.mailtoui-copy-email-address{background-color:#d8dcdf;border-radius:8px;border:none;-webkit-box-sizing:border-box;box-sizing:border-box;color:#48494a;font-size:100%;height:100%;outline:0;overflow:hidden;padding:20px 120px 20px 20px;width:100%}.mailtoui-no-scroll{overflow:hidden;position:fixed;width:100%}.mailtoui-is-hidden{display:none;visibility:hidden}@-webkit-keyframes appear{0%{opacity:0;-webkit-transform:translate(-50%,-50%) scale(0,0);transform:translate(-50%,-50%) scale(0,0)}100%{opacity:1;-webkit-transform:translate(-50%,-50%) scale(1,1);transform:translate(-50%,-50%) scale(1,1)}}@keyframes appear{0%{opacity:0;-webkit-transform:translate(-50%,-50%) scale(0,0);transform:translate(-50%,-50%) scale(0,0)}100%{opacity:1;-webkit-transform:translate(-50%,-50%) scale(1,1);transform:translate(-50%,-50%) scale(1,1)}}`;

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

        var firstHeadChild = window.document.head.firstChild;

        window.document.head.insertBefore(app.buildStyleTag(), firstHeadChild);
    };

    /**
     * Check if style tag has already been embedded on the page.
     *
     * @return {boolean} True if style tag is already embedded.
     */
    app.styleTagExists = function() {
        if (window.document.getElementById(app.prefix('-styles'))) {
            return true;
        }

        return false;
    };

    /**
     * Build the modal markup.
     *
     * @return {string} The modal markup.
     */
    app.buildModal = function() {
        var modal = window.document.createElement('div');
        var worldSVG =
            '<svg viewBox="0 0 24 24" width="24" height="24"><g class="nc-icon-wrapper" stroke-linecap="square" stroke-linejoin="miter" stroke-width="2" fill="currentColor" stroke="currentColor"><path data-cap="butt" data-color="color-2" fill="none" stroke-miterlimit="10" d="M5.704,2.979 c0.694,0.513,1.257,1.164,1.767,2.02C7.917,5.746,8.908,7.826,8,9c-1.027,1.328-4,1.776-4,3c0,0.921,1.304,1.972,2,3 c1.047,1.546,0.571,3.044,0,4c-0.296,0.496-0.769,0.92-1.293,1.234" stroke-linecap="butt"/> <path data-cap="butt" data-color="color-2" fill="none" stroke-miterlimit="10" d="M20.668,5.227 C18.509,6.262,15.542,6.961,15,7c-1.045,0.075-1.2-0.784-2-2c-0.6-0.912-2-2.053-2-3c0-0.371,0.036-0.672,0.131-0.966" stroke-linecap="butt"/> <circle fill="none" stroke="currentColor" stroke-miterlimit="10" cx="12" cy="12" r="11"/> <path data-cap="butt" data-color="color-2" fill="none" stroke-miterlimit="10" d="M19.014,12.903 C19.056,15.987,15.042,19.833,13,19c-1.79-0.73-0.527-2.138-0.986-6.097c-0.191-1.646,1.567-3,3.5-3S18.992,11.247,19.014,12.903z" stroke-linecap="butt"/></g></svg>';
        var uiSVG =
            '<svg viewBox="0 0 24 24" xml:space="preserve" width="24" height="24"><g class="nc-icon-wrapper" stroke-linecap="square" stroke-linejoin="miter" stroke-width="2" fill="currentColor" stroke="currentColor"><line data-color="color-2" fill="none" stroke-miterlimit="10" x1="5" y1="6" x2="6" y2="6"/> <line data-color="color-2" fill="none" stroke-miterlimit="10" x1="10" y1="6" x2="11" y2="6"/> <line data-color="color-2" fill="none" stroke-miterlimit="10" x1="15" y1="6" x2="19" y2="6"/> <line fill="none" stroke="currentColor" stroke-miterlimit="10" x1="1" y1="10" x2="23" y2="10"/> <rect x="1" y="2" fill="none" stroke="currentColor" stroke-miterlimit="10" width="22" height="20"/></g></svg>';
        var markup = `<div class="mailtoui-modal-content"><div class="mailtoui-modal-head"><span id="mailtoui-modal-close" class="mailtoui-modal-close">&times</span> <span class="mailtoui-modal-title">Compose new email with</span></div><div class="mailtoui-modal-body"><div class="mailtoui-clients"><a id="mailtoui-client-gmail" class="mailtoui-client" href="#"><div class="mailtoui-label"><span class="mailtoui-label-icon">${worldSVG}</span> <span class="mailtoui-label-text">Gmail in browser</span></div></a><a id="mailtoui-client-outlook" class="mailtoui-client" href="#"><div class="mailtoui-label"><span class="mailtoui-label-icon">${worldSVG}</span> <span class="mailtoui-label-text">Outlook in browser</span></div></a><a id="mailtoui-client-yahoo" class="mailtoui-client" href="#"><div class="mailtoui-label"><span class="mailtoui-label-icon">${worldSVG}</span> <span class="mailtoui-label-text">Yahoo in browser</span></div></a><a id="mailtoui-client-default" class="mailtoui-client" href="#"><div class="mailtoui-label"><span class="mailtoui-label-icon">${uiSVG}</span> <span class="mailtoui-label-text">Default email app</span></div></a></div><div id="mailtoui-copy" class="mailtoui-copy"><div id="mailtoui-copy-email-address" class="mailtoui-copy-email-address"></div><button id="mailtoui-copy-button" class="mailtoui-copy-button" data-copytargetid="mailtoui-copy-email-address">Copy</button></div></div></div>`;

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
     *
     * @param {Element}  link    The link that was clicked.
     */
    app.embedModal = function() {
        if (app.modalExists()) {
            return;
        }

        var modal = app.buildModal();

        var firstBodyChild = window.document.body.firstChild;
        window.document.body.insertBefore(modal, firstBodyChild);
    };

    /**
     * Check if modal markup has already been embedded on page.
     *
     * @return {boolean} True if modal markup ia already embedded.
     */
    app.modalExists = function() {
        if (window.document.getElementById(app.prefix('-modal'))) {
            return true;
        }

        return false;
    };

    /**
     * Get modal populated with data from the given link.
     *
     * @param {Element} link    The link that was clicked.
     *
     * @return {Element} The modal associated with the given link.
     */
    app.getModal = function(link) {
        app.hydrateModal(link);

        return window.document.getElementById(app.prefix('-modal'));
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

        var gmail = window.document.getElementById(app.prefix('-client-gmail'));
        gmail.href = 'https://mail.google.com/mail/?view=cm&fs=1&to=' + email + '&su=' + subject + '&cc=' + cc + '&bcc=' + bcc + '&body=' + body;

        var outlook = window.document.getElementById(app.prefix('-client-outlook'));
        outlook.href = 'https://outlook.office.com/owa/?path=/mail/action/compose&to=' + email + '&subject=' + subject + '&body=' + body;

        var yahoo = window.document.getElementById(app.prefix('-client-yahoo'));
        yahoo.href = 'https://compose.mail.yahoo.com/?to=' + email + '&subject=' + subject + '&cc=' + cc + '&bcc=' + bcc + '&body=' + body;

        var defaultApp = window.document.getElementById(app.prefix('-client-default'));
        defaultApp.href = 'mailto:' + email + '?subject=' + subject + '&cc=' + cc + '&bcc=' + bcc + '&body=' + body;

        var emailField = window.document.getElementById(app.prefix('-copy-email-address'));
        emailField.innerHTML = email;

        app.toggleHideCopyUI(email);
    };

    /**
     * Whem the modal is displayed, the "no-scroll" class sets the body's position to fixed. This has the
     * side effect of the page getting scrolled to the top. To counter that, we need to save the scroll
     * position when the modal is displayed, so it can be restored later on when the modal is closed.
     */
    app.saveMobilePageScrollPosition = function() {
        scrollPosition = window.pageYOffset;
        body.style.top = -scrollPosition + 'px';
    };

    /**
     * When the modal is closed, we need to reset the page scroll position. Needed due to
     * the position:fixed being set by the "no-scroll" class on the body element when
     * the modal is open. Refer to saveMobilePageScrollPosition() for details.
     */
    app.resetMobilePageScrollPosition = function() {
        window.scrollTo(0, scrollPosition);
        body.style.top = 0;
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
     * @param  {Object} event   The object created by the click event.
     */
    app.openModal = function(event) {
        event.preventDefault();

        app.saveLastDocElementFocused();
        app.saveMobilePageScrollPosition();

        app.displayModal(event);

        app.hideModalFromScreenReader(false);
        app.enablePageScrolling(false);
        app.modalFocus();
        app.triggerEvent(modal, 'open');
    };

    /**
     * Display modal and carry out other tasks needed when modal is open.
     */
    app.displayModal = function(event) {
        var link = app.getParentAnchor(event.target);
        modal = app.getModal(link);
        modal.style.display = 'block';
    };

    /**
     * Set focus on the first focusable element of the modal.
     */
    app.modalFocus = function() {
        modal.focusableChildren = Array.from(modal.querySelectorAll(focusable));
        modal.focusableChildren[0].focus();
    };

    /**
     * Close modal.
     */
    app.closeModal = function(event) {
        event.preventDefault();

        app.hideModal();

        app.enablePageScrolling(true);
        app.resetMobilePageScrollPosition();
        app.docRefocus();
        app.triggerEvent(modal, 'close');
    };

    /**
     * Hide current modal.
     */
    app.hideModal = function() {
        app.hideModalFromScreenReader(true);

        modal.style.display = 'none';
    };

    /**
     * Set aria attributes to hide modal from screen readers.
     *
     * @param {boolean}     hidden  True to hide modal from screen reader. False otherwise.
     */
    app.hideModalFromScreenReader = function(hidden) {
        modal.setAttribute('aria-hidden', hidden);
    };

    /**
     * Toggle a css class to enable/disable page scrolling.
     *
     * @param  {boolean} enabled    True to enable page scrolling. False to disable it.
     */
    app.enablePageScrolling = function(enabled) {
        var htmlTag = window.document.getElementsByTagName('html')[0];

        if (enabled) {
            body.classList.remove(app.prefix('-no-scroll'));
            htmlTag.classList.remove(app.prefix('-no-scroll'));
        } else {
            body.classList.add(app.prefix('-no-scroll'));
            htmlTag.classList.add(app.prefix('-no-scroll'));
        }
    };

    /**
     * Set focus back on the last element focused on the page.
     */
    app.docRefocus = function() {
        lastDocElementFocused.focus();
    };

    /**
     * Open the given client.
     *
     * @param  {Element} client     The client link that was clicked.
     */
    app.openClient = function(client) {
        var target = '_blank';

        if (client !== null) {
            if (client.id == app.prefix('-client-default')) {
                target = '_self';
            }

            window.open(client.href, target);
            app.triggerEvent(client, 'compose');

            if (options.autoClose) {
                app.closeModal(event);
            }
        }
    };

    /**
     * When an anchor tag (<a>) contains other elements, the element returned can vary
     * depending on where you click. We need to search up the DOM tree until we find
     * the parent anchor tag, which is the element that was intended to be clicked.
     *
     * @param   {Element} element     The element that was clicked.
     *
     * @return {Element} The parent anchor tag of the element that was clicked.
     */
    app.getParentAnchor = function(element) {
        while (element !== null) {
            if (element.tagName.toUpperCase() === 'A') {
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
     * @param  {string}     eventName   The name of the event to be triggered.
     */
    app.triggerEvent = function(element, eventName) {
        var event = new Event(eventName);

        element.dispatchEvent(event);
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
     * Listen for click event on mailto link to open modal.
     */
    app.listenForClickOnLink = function() {
        var links = window.document.getElementsByClassName(app.prefix());

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
     * Listen for click event on client links to auto-close modal.
     */
    app.listenForClickOnClient = function() {
        var clients = window.document.getElementsByClassName(app.prefix('-client'));

        for (var i = 0; i < clients.length; i++) {
            clients[i].addEventListener(
                'click',
                function(event) {
                    event.preventDefault();
                    event.stopPropagation();

                    var client = app.getParentAnchor(event.target);
                    app.openClient(client);
                },
                false
            );
        }
    };

    /**
     * Listen for click event on modal's copy button.
     */
    app.listenForClickOnCopy = function() {
        var copiers = window.document.getElementsByClassName(app.prefix('-copy-button'));

        for (var i = 0; i < copiers.length; i++) {
            copiers[i].addEventListener(
                'click',
                function(event) {
                    app.copy(event);
                },
                false
            );
        }
    };

    /**
     * Listen for click event on modal's close button.
     */
    app.listenForClickOnClose = function() {
        var closers = window.document.getElementsByClassName(app.prefix('-modal-close'));

        for (var i = 0; i < closers.length; i++) {
            closers[i].addEventListener(
                'click',
                function(event) {
                    app.closeModal(event);
                },
                false
            );
        }
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
        window.document.addEventListener(
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
     * @param KeyboardEvent The event generated by pressing a key.
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
     * @return {HTMLCollection} All links with the class "mailtoui".
     */
    app.getLinks = function() {
        return window.document.getElementsByClassName(app.prefix());
    };

    /**
     * Split the URL scheme of given link in two strings: the email address, and the
     * key-value query string. Also remove 'mailto:' to get nice clean values.
     *
     * @param  {Element}    link     The link element clicked.
     *
     * @return {array} The two parts of the link scheme separated at '?'.
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
     * @param   {string}    field   The name of the field we want to get.
     *
     * @return {string} The value corresponding to the given field.
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
     * Extract email address from the mailto: string.
     *
     * @param  {Element}    link     The link element clicked.
     *
     * @return {string} The email address.
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
     * Build and return the class name used to hide Copy UI.
     *
     * @return {string} The CSS class name needed to hide the Copy UI.
     */
    app.getClassHideCopyUI = function() {
        return app.prefix('-is-hidden');
    };

    /**
     * Show or hide Copy UI based on email address presence.
     *
     * @param {string} email    The email address to be checked.
     */
    app.toggleHideCopyUI = function(email) {
        var copyUi = window.document.getElementById(app.prefix('-copy'));

        if (email.length == 0) {
            copyUi.classList.add(app.getClassHideCopyUI());
        } else {
            copyUi.classList.remove(app.getClassHideCopyUI());
        }
    };

    /**
     * Set copy button text to indicate the email address has been copied.
     *
     * @param {Element}  button  The Copy button that was clicked.
     */
    app.setCopyButtonText = function(button) {
        button.innerHTML = 'Copied!';

        setTimeout(function() {
            button.innerHTML = 'Copy';
        }, 600);
    };

    /**
     * Copy email address to the clipboard.
     *
     * @param {string}  event  The event generated by clicking on Copy button.
     */
    app.copy = function(event) {
        event.preventDefault();

        var targetId = event.target.getAttribute('data-copytargetid');
        var email = document.getElementById(targetId);
        var range = document.createRange();

        range.selectNodeContents(email);

        var selection = window.getSelection();
        selection.removeAllRanges();
        selection.addRange(range);

        document.execCommand('copy');
        app.triggerEvent(email, 'copy');

        app.setCopyButtonText(event.target);
    };

    /**
     * Check if device is running iOS.
     *
     * @return {boolean} True if device runs iOS.
     */
    app.isiOSDevice = function() {
        return navigator.userAgent.match(/ipad|iphone/i);
    };

    /**
     * Get user options provided as an object parameter in the run
     * method, or as a JSON string provided in a data attribute
     * of the script tag. Save all in the options object.
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
                    options[name] = userOptions[name];
                }
            }
        }
    };

    /**
     * Read options passed in the data-options attribute of the script tag.
     *
     * @return {string} Options string provided in JSON format.
     */
    app.getOptionsFromScriptTag = function() {
        var scripts = document.getElementsByTagName('script');
        var scriptName = scripts[scripts.length - 1];

        return scriptName.getAttribute('data-options');
    };

    /**
     * Append the linkClass user option to the given string.
     *
     * @param {string}  text    The string to which the linkClass will be appended.
     *
     * @return {string} The linkClass user option appended to the given string.
     */
    app.prefix = function(text = '') {
        return options.linkClass + text;
    };

    /**
     * Let's kick things off.
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
 * Otherwise, make MailtoUI available to the outside world, so
 * the user can trigger MailtoUI.run() manually when needed.
 */
if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    // We're not in the browser.
    module.exports = mailtouiApp;
} else {
    // We're in the browser.
    mailtouiApp.run();
}
