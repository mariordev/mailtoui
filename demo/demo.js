/**
 * Proceed only if the DOM is loaded and ready.
 *
 * @param  {Function}   fn  The function to be executed when DOM is ready.
 */
function domReady(fn) {
    document.addEventListener('DOMContentLoaded', fn);

    // Is the DOM ready now? If so, execute the given function.
    if (document.readyState === 'interactive' || document.readyState === 'complete') {
        fn();
    }
}

/**
 * Run when DOM is ready.
 */
domReady(function() {
    const Vue = require('../node_modules/vue/dist/vue.min.js');
    // const MailtoUI = require('../src/js/mailtoui.js');
    const MailtoUI = require('../dist/mailtoui-min.js');

    var app = new Vue({
        el: '#app',

        data: {
            emailSyntax: '{{ email }}',
            email: 'user4@example.com',
            emailDisplay: 'Mailto link with cc'
        },

        computed: {
            mailtoHref: function() {
                return 'mailto:' + this.email + '?cc=user1@example.com';
            }
        },

        mounted() {
            MailtoUI.run({
                buttonTextCopy: 'Copia',
                buttonIconCopy: '/demo/bear.svg',
                buttonTextCopyAction: 'Copiado!',
                autoClose: false,
                disableOnMobile: true
            });
        }
    });
});
