<p align="center">
    <a href="https://mailtoui.com">
       <img src="https://mariordev.github.io/mailtoui/assets/img/unfurl.jpg" alt="MailtoUI">
    </a>
</p>

<p align="center">A simple way to enhance your mailto links with a convenient user interface.</p>

<p align="center">
	<a href="https://github.com/mariordev/mailtoui/releases"><img src="https://img.shields.io/npm/v/mailtoui.svg" alt="Latest release"></a>
	<a href="https://www.npmjs.com/package/mailtoui"><img src="https://img.shields.io/npm/dt/mailtoui.svg" alt="Total downloads"></a>
	<a href="https://github.com/mariordev/mailtoui/blob/master/LICENSE"><img src="https://img.shields.io/github/license/mariordev/mailtoui.svg" alt="License"></a>
	<a href="https://twitter.com/intent/tweet?text=Check%20this%20out!%20&url=https%3A%2F%2Fmailtoui.com"><img src="https://img.shields.io/twitter/url/https/mailtoui.com.svg?style=social" alt="Share on Twitter"></a>
</p>

## Introduction

MailtoUI is a JavaScript library that enhances your mailto links with a convenient user interface. It gives your users the flexibility to compose a new message using a browser-based email client <strong><i>or</i></strong> their default local email app.

MailtoUI is ideal for static sites or any other site where you don't want to spend time setting up a "Contact Us" form solution.

## Quick Setup

### STEP 1

Add MailtoUI via CDN to the bottom of your page, just before the closing `</body>` tag.

```html
<body>
    ...
    ...
    <script src="https://cdn.jsdelivr.net/npm/mariordev/mailtoui@latest/dist/mailtoui-min.js"></script>
</body>
```

### STEP 2

Attach your mailto link to MailtoUI by adding a **unique id**, *and* the class `mailtoui` to the `<a>` tag.

```html
<a id="email-1" class="mailtoui" href="mailto:tony.stark@example.com">Contact Tony</a>
```

That's it! Your mailto link is now using MailtoUI. Refresh your page and try it out.


## Documentation

For full documentation, visit [mailtoui.com](https://mailtoui.com).

## License

[MIT](https://github.com/mariordev/mailtoui/blob/master/LICENSE)
