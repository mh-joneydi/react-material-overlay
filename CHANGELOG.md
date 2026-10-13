# Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.0.9] - 2026-10-13

### Added

- Browser forward restores a closed overlay. Built-in overlays do this automatically. Custom overlays pass a required `onRedoState` callback to `RmoStack.push` and must restore the overlay without pushing a new history entry.
- `registerPopInterceptor` and `usePopInterceptor` can cancel a close from the close button, backdrop, Escape, `pop()`, `flush()`, or the browser back button.
- `closeOnEscape` on modal, alert dialog, lightbox, and bottom sheet. Defaults to `true`.
- Alert dialog `closeButton`, `closeButtonProps`, `closeButtonIcon`, and `layout`. The close button is hidden by default.
- Module augmentation of `IAlertDialogCommonOptions`, `IModalCommonOptions`, `IBottomSheetCommonOptions`, and `ILightboxCommonOptions`. Custom fields are accepted by `push*` and container `defaultOptions`, and are passed into the overlay render callbacks.

### Fixed

- Bottom sheet header and content wrapper prop types now pass the overlay props through, including augmented fields.

## [0.0.8] - 2025-06-10

### Fixed

- Peer dependency handling for `react-spring-bottom-sheet` and `yet-another-react-lightbox`.
- Repository URL.

## [0.0.6] - 2025-06-09

### Changed

- Updated dependencies to current versions.

## [0.0.5] - 2024-12-17

### Added

- Default icon for the close button.

## [0.0.4] - 2024-12-16

### Fixed

- Nested `sx` prop merging on overlays.

## [0.0.3] - 2024-12-16

### Added

- `pop` can target the top overlay only when its id matches.
- Bottom sheet close button, close icon, and header.
- `contentWrapper` for modal and bottom sheet.

## [0.0.2] - 2024-12-10

### Fixed

- Emotion cache handling.

## [0.0.1] - 2024-10-20

### Added

- Initial release with modal, alert dialog, lightbox, and bottom sheet overlays.
- Stack management and browser history integration.
