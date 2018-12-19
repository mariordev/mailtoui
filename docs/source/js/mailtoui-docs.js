/**
 * Run when DOM is ready.
 */
domReady(function() {
    embedVersion();
});

/**
 * Set dark theme CSS class to show the custom styling example.
 */
function setDarkTheme() {
    var darkModalExample = window.document.getElementById('mailtoui-modal-email-dark');

    darkModalExample.classList.add('dark-theme');
}

/**
 * Embed version number on docs page.
 */
function embedVersion() {
    var version = require('../../../version.js');

    window.document.getElementById('version').innerHTML = version;
}

/**
 * Proceed only if the DOM is loaded and ready.
 *
 * @param  {Function}   fn  The function to be executed when DOM is ready.
 */
function domReady(fn) {
    // Wait for DOM to be ready, then execute the given function.
    document.addEventListener('DOMContentLoaded', fn);

    // If the DOM is ready now, then execute the given function now.
    if (document.readyState === 'interactive' || document.readyState === 'complete') {
        fn();
    }
}
