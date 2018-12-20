<p align="center">
    <a href="https://mailtoui.com">
       <img src="https://mariordev.github.io/mailtoui/assets/img/mailtoui-md.png" alt="MailtoUI screenshot">
    </a>
</p>

<h1 align="center">MailtoUI</h1>
<p align="center">A convenient drop-in user interface for mailto links.</p>

-------

MailtoUI is a library that enhances your mailto links with a convenient user interface, which gives your users the flexibility to compose a new message using a browser-based email client <strong><i>or</i></strong> their default local email app.

MailtoUI is ideal for your static sites or any other site where you don't want to spend time setting up a "Contact Us" form solution.

## Quick Setup

### STEP 1

Add MailtoUI via CDN to the bottom of your page, just before the closing `</body>` tag.

```html
<body>
    ...
    ...
    <script src="https://cdn.jsdelivr.net/gh/mariordev/mailtoui@latest/dist/mailtoui-min.js"></script>
</body>
```

### STEP 2

Anywhere on your page, attach your mailto link(s) to MailtoUI by adding a unique id, and the class `mailtoui` to the `<a>` tag.

```html
<a id="email-1" class="mailtoui" href="mailto:tony.stark@example.com">Tony</a>
```

### STEP 3

Your mailto link is now attached to MailtoUI. Refresh your page, click on it to test it, and delight your users.


## Documentation

For full documentation, visit [mailtoui.com](https://mailtoui.com).

## License

[MIT](https://github.com/mariordev/mailtoui/blob/master/LICENSE)
