# Changelog

All notable changes to MailtoUI are documented in this file. The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

This project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.3](https://github.com/mariordev/mailtoui/releases/tag/v1.0.3) - 2019-09-06

### Fixed

-   Closing modal via Esc key generates an error when another modal on the page is also closed via Esc key.
-   Button icon and text don't align horizontally.
-   Prefix animation keyframes name to minimize possibility of collision with other css.

### Changed

-   Cleaned up the demo page a bit.

## [1.0.2](https://github.com/mariordev/mailtoui/releases/tag/v1.0.2) - 2019-05-10

### Fixed

-   Fixed scrollbar issue when hovering on modal's edge. (Thanks to @machida: https://github.com/mariordev/mailtoui/pull/9/commits/76b5f57c0b01a6b04c7ea8a6f9949f8eeb4129ed)

### Added

-   Sass variables to aid in theming.
-   `disableOnMobile` option to disable modal on mobile devices.

## [1.0.1](https://github.com/mariordev/mailtoui/releases/tag/v1.0.1) - 2019-02-12

### Fixed

-   Update correct version number displayed in mailtoui-min.js header comments. No code changes.

## [1.0.0](https://github.com/mariordev/mailtoui/releases/tag/v1.0.0) - 2019-02-08

### Added

-   Ability to customize the following via newly added options:
    -   Modal title
    -   SVG icon and text of each button
-   Improved visual feedback when Copy button is clicked.
-   Added a clipboard as the default Copy button icon.

### Changed

-   Copy button is now on the left side to improve rendering of email address.
-   Clean up css.
-   Some css classes and ids have been renamed for better consistency:

    -   `#mailtoui-client-gmail` -> `#mailtoui-button-1`
    -   `#mailtoui-client-outlook` -> `#mailtoui-button-2`
    -   `#mailtoui-client-yahoo` -> `#mailtoui-button-3`
    -   `#mailtoui-client-default` -> `#mailtoui-button-4`
    -   `#mailtoui-copy-button` -> `#mailtoui-button-copy`
    -   `#mailtoui-copy-email-address` -> `#mailtoui-email-address`
    -   `.mailtoui-client` -> `.mailtoui-button`
    -   `.mailtoui-label` -> `.mailtoui-button-content`
    -   `.mailtoui-label-icon` -> `.mailtoui-button-icon`
    -   `.mailtoui-label-text` -> `.mailtoui-button-text`
    -   `.mailtoui-copy-button` -> `.mailtoui-button-copy`

-   The element id associated with the `compose` event has changed:

    -   `mailtoui-client-gmail` -> `mailtoui-button-1`
    -   `mailtoui-client-outlook` -> `mailtoui-button-2`
    -   `mailtoui-client-yahoo` -> `mailtoui-button-3`
    -   `mailtoui-client-default` -> `mailtoui-button-4`

-   The element id associated with the `copy` event has changed:
    -   `mailtoui-copy-email-address` -> `mailtoui-email-address`

## [0.2.2](https://github.com/mariordev/mailtoui/releases/tag/v0.2.2) - 2019-01-25

### Fixed

-   Fix scrolling issue when page scroll-behavior:smooth.

## [0.2.1](https://github.com/mariordev/mailtoui/releases/tag/v0.2.1) - 2019-01-24

### Fixed

-   Disable page scroll when modal is displayed.

## [0.2.0](https://github.com/mariordev/mailtoui/releases/tag/v0.2.0) - 2019-01-18

### Added

-   Ability to "require" the MailtoUI module to load it into your own script.
-   You can now run MailtoUI manually.
-   Custom events for better integration with your own code.
-   Smaller footprint, as all mailto links are handled with a single modal component

### Changed

-   Move docs to its own repo.

### Removed

-   Removed multiple modal components in favor of a single component.

## [0.1.14](https://github.com/mariordev/mailtoui/releases/tag/v0.1.14) - 2019-01-14

### Removed

-   Removed the requirement to have an `id` assigned to each mailto link.

## [0.1.13](https://github.com/mariordev/mailtoui/releases/tag/v0.1.13) - 2019-01-10

### Changed

-   Update documentation and cleanup build files. No library changes.

## [0.1.12](https://github.com/mariordev/mailtoui/releases/tag/v0.1.12) - 2019-01-07

### Fixed

-   Fix flashing/scrolling issue when Copying email address in mobile.

## [0.1.11](https://github.com/mariordev/mailtoui/releases/tag/v0.1.11) - 2019-01-07

### Changed

-   Refactor UI and Copy button functionality.

## [0.1.10](https://github.com/mariordev/mailtoui/releases/tag/v0.1.10) - 2019-01-05

### Fixed

Fix version number for npm release.

## [0.1.9](https://github.com/mariordev/mailtoui/releases/tag/v0.1.09) - 2019-01-05

### Fixed

-   Improve email copy functionality for iOS.

## [0.1.8](https://github.com/mariordev/mailtoui/releases/tag/v0.1.08) - 2018-12-21

### Changed

-   Update documentation. No changes to library.
