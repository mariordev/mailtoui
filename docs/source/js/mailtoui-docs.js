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
var version = require('../../../version.js');
window.document.getElementById('version').innerHTML = version;
