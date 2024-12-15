# react-material-overlay

Performant, easy to use, customizable and extendable library that provides a generic and flexible way to manage overlays (like modals, dialogs, lightboxes, and bottom sheets) in your React applications using [Material UI <sup>V6</sup>](https://mui.com). It supports stacking overlays and integrates seamlessly with the browser's history, enabling users to navigate overlays using the browser’s back button.

## Overview

- **Ease of Use**: Simple API for pushing and popping overlays without needing to manage component state manually.
- **Generic Overlays**: Easily manage different types of overlays (`Modal`, `Alert Dialog`, `Lightbox`, and `Bottom Sheet`) with customizable options.
- **Multiple Overlay Management**: Manage multiple overlays at the same time with an easy-to-use stack mechanism.
- **Multiple containers support**: Different containers can be set up with unique options for various overlay types.
- **Overlay Stacking**: Overlays are managed on a stack, ensuring the correct order of opening and closing.
- **Browser History Integration**: Works seamlessly with browser history, allowing users to navigate back through overlays using the browser's back button.
- **Modular API**: Provides individual APIs for pushing different types of overlays: modals, lightboxes, bottom sheets, and alert dialogs.
- **Custom Overlay Support**: you can add custom overlays and manage them using the `RmoStack` API.
- **Dynamic Options**: Specify different options for each overlay instance to customize behavior and appearance.
- **Theming Support**: Fully compatible with MUI's theming system, allowing for consistent styling across your application.
- **TypeScript:** type definitions come built-in in the package
- **Accessibility Support**: Built with accessibility in mind, adhering to MUI's best practices.
- **Fully responsive UI**
- **Customizable and Extendable**

## Installation

```bash

npm install react-material-overlay

```

Or with yarn:

```bash

yarn add react-material-overlay

```

### Peer Dependencies

```bash

npm install @mui/material @emotion/react @emotion/styled

```

## Usage

Using **react-material-overlay** is straightforward. To get started, simply add the desired overlay container component (e.g., `ModalContainer`, `AlertDialogContainer`, `LightboxContainer`, or `BottomSheetContainer`) to your React component tree. Then, utilize the corresponding push API method, such as `pushModal`, to display the overlay.

To enable support for multiple containers, you must specify a `containerId` for the desired container and use it in each push API, to do this, add the `containerId` to the push options object.

### Basic Example

In this example, we'll use the `ModalContainer` and the `pushModal` method to open our modal when a button is clicked.

The `ModalContainer` component handles rendering and stacking of the modals you push.

```jsx
import React from 'react';
import { Button, ThemeProvider } from '@mui/material';
import { ModalContainer, pushModal } from 'react-material-overlay';

const SomeComponent = React.lazy(() => import('./SomeComponent'));

function App() {
  return (
    <ThemeProvider theme={/*your application theme*/}>
      <Button
        onClick={() => {
          // push new modal to default modal container
          pushModal(<SomeComponent />);
        }}
      >
        open modal
      </Button>

      <Button
        onClick={() => {
          // push new overlay to fullscreen modal container
          pushModal(<SomeComponent />, {containerId: 'fullscreen'});
        }}
      >
        open modal
      </Button>

      {/* ModalContainer handles the rendering of modals */}
      <ModalContainer />
      <ModalContainer containerId="fullscreen" defaultOptions={{ fullscreen: true }} />
    </ThemeProvider>
  );
}

export default App;
```

### **Modal**

> Implemented and integrated with [MUI Dialog](https://mui.com/material-ui/react-dialog/)

A modal is a dialog that provides a flexible way to display content in an overlay. modal can requires the user to interact with it before they can return to the main content. It’s useful for alerting users, asking for confirmation, or gathering information.

#### Basic Usage Example

```tsx
import React from 'react';
import { Button, ThemeProvider } from '@mui/material';
import { ModalContainer, pushModal } from 'react-material-overlay';

const SomeComponent = React.lazy(() => import('./SomeComponent'));

const App = () => {
	return (
		<ThemeProvider theme={/*your application theme*/}>
			<Button
				onClick={() => {
					pushModal(<SomeComponent />, {
						/*modal options*/
					});
				}}
			>
				open new modal
			</Button>

			<ModalContainer defaultOptions={/*default options for all modals that push in this container*/} />
		</ThemeProvider>
	);
};
```

### **Alert Dialog**

> Implemented and integrated with [MUI Dialog](https://mui.com/material-ui/react-dialog/#alerts)

Alerts are urgent interruptions, requiring acknowledgement, that inform the user about a situation.

Most alerts don't need titles. They summarize a decision in a sentence or two by either:

Asking a question (for example "Delete this conversation?")
Making a statement related to the action buttons
Use title bar alerts only for high-risk situations, such as the potential loss of connectivity. Users should be able to understand the choices based on the title and button text alone.

If a title is required:

Use a clear question or statement with an explanation in the content area, such as "Erase USB storage?".
Avoid apologies, ambiguity, or questions, such as "Warning!" or "Are you sure?"

#### Basic Usage Example

```tsx
import React from 'react';
import { Button, ThemeProvider } from '@mui/material';
import { AlertDialogContainer, pushAlertDialog } from 'react-material-overlay';

const App = () => {
	return (
		<ThemeProvider theme={/*your application theme*/}>
			<Button
				onClick={() => {
					pushAlertDialog({
						title: "Use Google's location service?",
						content:
							'Let Google help apps determine location. This means sending anonymous location data to Google, even when no apps are running.',
						onConfirmOk: () => {
							console.log('user confirmed ok');
						},
						onConfirmCancel: () => {
							console.log('user confirmed cancel');
						}
						/*other alert dialog options*/
					});
				}}
			>
				open new alert dialog
			</Button>

			<AlertDialogContainer defaultOptions={/*default options for all alert dialogs that push in this container*/} />
		</ThemeProvider>
	);
};
```

### **Lightbox**

> Implemented and integrated with [yet-another-react-lightbox](https://yet-another-react-lightbox.com/) based on _MUI Theme_.

Lightbox is perfect for displaying image and video galleries in a focused overlay. They are an effective tool for showcasing visual media in a web-friendly, user-engaging, and professional manner.

#### Basic Usage Example

> Note: Unlike other overlays, Lightbox can support one push per container simultaneously.

```tsx
import React from 'react';
import { Button, ThemeProvider } from '@mui/material';
import { LightboxContainer, pushLightbox } from 'react-material-overlay';


const App = () => {
  return (
    <ThemeProvider theme={/*your application theme*/}>
      <Button
        onClick={() => {
            pushLightbox({ slides: [{type: 'image', src: "img source"}, {type: 'video', sources: {/*video sources*/}}}] /*other lightbox options*/ });
        }}
      >
        open lightbox
      </Button>

      <LightboxContainer defaultOptions={/*default options for lightbox that push in this container*/} />
    </ThemeProvider>
  );
};
```

### **Bottom Sheet**

> Implemented and integrated with [react-spring-bottom-sheet](https://react-spring.bottom-sheet.dev/) based on _MUI Theme_.

Bottom sheets slide up from the bottom of the screen, providing contextual or additional information without taking the user away from their current task. Common use cases include action sheets, menus or displaying information in mobile interfaces.

#### Basic Usage Example

```tsx
import React from 'react';
import { Button, ThemeProvider } from '@mui/material';
import { pushBottomSheet, BottomSheetContainer } from 'react-material-overlay';

const SomeComponent = React.lazy(() => import('./SomeComponent'));

const App = () => {
	return (
		<ThemeProvider theme={/*your application theme*/}>
			<Button
				onClick={() => {
					pushBottomSheet(<SomeComponent />, {
						/* bottom sheet options */
					});
				}}
			>
				open new bottom sheet
			</Button>

			<BottomSheetContainer defaultOptions={/* default options for all bottom sheets that push in this container */} />
		</ThemeProvider>
	);
};
```

### Managing Overlays

- **Closing Overlays**: You can manually close an overlay by using the `pop` method or allowing the user to close it via UI elements like backdrop clicks.
- **Flush Overlays**: To close all overlays at once, use the `flush` method.

#### Example

```tsx
import { flush, pop } from 'react-material-overlay';

const App = () => {
  return (
    <Button onClick={() => pop()}>Close The Last Overlay</Button>
    <Button onClick={() => pop({ id: 'custom-id' })}>Close The Last Overlay With Id Check</Button>
    <Button onClick={() => pop(2)}>Close The Last Two Overlays</Button>
    <Button onClick={() => flush()}>Close All Overlays</Button>
  );
}
```

### Custom Overlays with `RmoStack`

For cases where you want to have your own custom overlay and use the stacking features, browser history sync and etc. you can easily do this using `RmoStack`.

#### Example

```tsx
import React from 'react';
import { Button, Drawer } from '@mui/material';
import { RmoStack } from 'react-material-overlay';

const App = () => {
	const [openDrawer, setOpenDrawer] = React.useState(false);

	return (
		<div>
			<Button
				onClick={() => {
					RmoStack.push({
						// The id is optional and its purpose is to check that the last item on the stack is the one we're looking for when manually popping.
						id: 'drawer',
						// triggers when users using the browser’s back button or generally happen on stack pop and this item is last in stack.
						onPopState() {
							setOpenDrawer(false);
						}
					}).then(() => setOpenDrawer(true));
				}}
			>
				Open Custom Overlay
			</Button>

			<Drawer
				open={openDrawer}
				onClose={() => {
					RmoStack.pop({ id: 'drawer' });
					// also you can prevent triggering `onPopState` event and control close overlay manualy
					RmoStack.pop({ id: 'drawer', preventEventTriggering: true }).then(() => {
						setOpenDrawer(false);
					});
				}}
			>
				Custom Content
			</Drawer>
		</div>
	);
};
```

### Caveats

> **attention:**
> Avoid navigating in the app when you have at least one overlay open.

If you have to navigating when at least one overlay open, first make sure all overlays are closed and then navigate.
To do this, you should call close handlers first, and when the promise is resolved, navigate.

#### With overlay close handler

```tsx
import { Button, ThemeProvider } from '@mui/material';
import { IModalContentProps, ModalContainer, pushModal } from 'react-material-overlay';
import { useNavigate } from 'react-router';

function SomeComponent({ closeModal }: IModalContentProps) {
	// note that in such a case of use, ModalContainer must be wrapped with react router provider
	const navigate = useNavigate();

	return (
		<Button
			onClick={() => {
				closeModal().then(() => {
					navigate('/some-path');
				});
			}}
		>
			close modal and navigate
		</Button>
	);
}

const App = () => {
	return (
		<ThemeProvider>
			<Button
				onClick={() => {
					pushModal(<SomeComponent />);
				}}
			>
				open new modal
			</Button>

			<ModalContainer />
		</ThemeProvider>
	);
};
```

#### With `pop` and `flush` handlers

```tsx
import { pop, flush } from 'react-material-overlay';

pop(2).then(() => {
	navigate('/some-path');
});

flush().then(() => {
	navigate('/some-path');
});
```

## API Reference

### Modal

#### options

| Property                | Type                                                                                                                                             | Default   | Description                                                                                                                                          |
| ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ | --------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| `containerId`           | `Id` (optional)                                                                                                                                  | —         | Container ID to manage multiple containers.                                                                                                          |
| `modalId`               | `Id` (optional)                                                                                                                                  | —         | Custom ID for the modal to prevent duplication.                                                                                                      |
| `title`                 | `React.ReactNode` (optional)                                                                                                                     | —         | Title of the modal.                                                                                                                                  |
| `subheader`             | `React.ReactNode` (optional)                                                                                                                     | —         | Subheader title of the modal.                                                                                                                        |
| `onOpen`                | `() => void` (optional)                                                                                                                          | —         | Called when the modal is mounted.                                                                                                                    |
| `onClose`               | `() => void` (optional)                                                                                                                          | —         | Called when the modal is unmounted.                                                                                                                  |
| `classes`               | `DialogProps['classes'] \| ((defaultClasses: DialogProps['classes']) => DialogProps['classes'])`                                                 | —         | Override or extend the styles applied to the component. Can merge or overwrite default classes defined in the container.                             |
| `TransitionComponent`   | `DialogProps['TransitionComponent']` (optional)                                                                                                  | `Fade`    | The component used for the transition. Refer to the [transition component guide](https://mui.com/material-ui/transitions/#transitioncomponent-prop). |
| `slots`                 | `DialogProps['slots']` (optional)                                                                                                                | `{}`      | Components used for each slot inside the modal.                                                                                                      |
| `slotProps`             | `DialogProps['slotProps']` (optional)                                                                                                            | `{}`      | Props used for each slot inside the modal.                                                                                                           |
| `fullScreen`            | `boolean` (optional)                                                                                                                             | `false`   | If `true`, the dialog is full-screen.                                                                                                                |
| `fullWidth`             | `boolean` (optional)                                                                                                                             | `false`   | If `true`, the dialog stretches to the maximum width.                                                                                                |
| `maxWidth`              | `Breakpoint \| false` (optional)                                                                                                                 | `'sm'`    | Determines the max-width of the dialog. Can be `'xs'`, `'sm'`, `'md'`, `'lg'`, `'xl'`, or `false` to disable.                                        |
| `PaperComponent`        | `DialogProps['PaperComponent']` (optional)                                                                                                       | `Paper`   | The component used to render the body of the dialog.                                                                                                 |
| `PaperProps`            | `DialogProps['PaperProps']` (optional)                                                                                                           | `{}`      | Props applied to the Paper element.                                                                                                                  |
| `scroll`                | `'body' \| 'paper'` (optional)                                                                                                                   | `'paper'` | Determines the container for scrolling the dialog.                                                                                                   |
| `sx`                    | `DialogProps['sx']` (optional)                                                                                                                   | —         | System prop for defining additional CSS styles.                                                                                                      |
| `transitionDuration`    | `DialogProps['transitionDuration']` (optional)                                                                                                   | —         | Duration for the transition, in milliseconds. Can be a single value or an object.                                                                    |
| `closeButton`           | `boolean \| ((props: ICloseButtonProps) => React.ReactNode) \| React.ReactElement<ICloseButtonProps>` (optional)                                 | `true`    | Custom close button. Pass `false` to remove it. Defaults to `IconButton`.                                                                            |
| `closeButtonProps`      | `IconButtonProps` (optional)                                                                                                                     | —         | Props applied to the close button element. Refer to the [IconButton props](https://mui.com/material-ui/api/icon-button/#props) for more details.     |
| `closeButtonIcon`       | `React.ReactNode \| ((props: Pick<IModalCommonOptions, 'transitionPreset' \| 'transitionProps' \| 'fullScreen'>) => React.ReactNode)` (optional) | —         | Custom icon for the close button.                                                                                                                    |
| `raw`                   | `boolean` (optional)                                                                                                                             | `false`   | If `true`, only the content is displayed raw in the modal.                                                                                           |
| `transitionPreset`      | `'zoom' \| 'fade' \| 'grow' \| 'slide' \| 'collapse'` (optional)                                                                                 | `'fade'`  | Adjusts the transition using preset transitions. For more customization, use `TransitionComponent`.                                                  |
| `transitionProps`       | `Omit<SlideProps & GrowProps & FadeProps & ZoomProps & CollapseProps, 'children'>` (optional)                                                    | —         | Props applied to the transition element. Applies to both the transition preset and `TransitionComponent`.                                            |
| `closeOnBackdropClick`  | `boolean` (optional)                                                                                                                             | `true`    | If `true`, the modal closes when the backdrop is clicked.                                                                                            |
| `DialogProps`           | `DialogProps` (optional)                                                                                                                         | —         | Props for the Dialog component for further customization. Refer to the [Dialog props](https://mui.com/material-ui/api/dialog/#props) for details.    |
| `header`                | `boolean \| ((params: ModalHeaderProps) => React.ReactNode) \| React.ReactElement<ModalHeaderProps>` (optional)                                  | `true`    | Custom header for the modal. Defaults to `CardHeader`.                                                                                               |
| `headerProps`           | `CardHeaderProps` (optional)                                                                                                                     | —         | Props for the header component. Refer to the [CardHeader props](https://mui.com/material-ui/api/card-header/#props) for more details.                |
| `contentWrapperProps`   | `BoxProps` (optional)                                                                                                                            | —         | Props for the content wrapper component. Refer to the [Box props](https://mui.com/material-ui/api/card-content/#props) for details.                  |
| `reactSuspenseFallback` | `React.ReactNode` (optional)                                                                                                                     | —         | Custom React Suspense fallback UI for lazy-loaded contents.                                                                                          |

#### `ModalContainer` props

| Property         | Type                              | Description                                                                                                                                                                                         |
| ---------------- | --------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `containerId`    | `Id` (optional)                   | Set an ID to handle multiple modal containers. This allows for differentiation between various instances of modal containers when they are being managed or referenced.                             |
| `defaultOptions` | `IModalDefaultOptions` (optional) | Set default options for modals. This allows you to define common configuration settings that will apply to all modals managed by this container, ensuring consistency and reducing repetitive code. |

#### `pushModal` API

Opens a new modal overlay. If the container is not mounted or if the modal is a duplicate, it returns `null`.

##### Parameters

- `content` (`ModalContent`): The content to be displayed in the modal. This can be of various types defined in the `ModalContent` union type.

- `options` (`IModalOptions`, optional): Additional options for configuring the modal. This is an object that can contain various properties as specified in the `IModalOptions` type.

##### Returns

- `Promise<Id | null>`: A promise that resolves to the modal ID if the modal is successfully opened; otherwise, it resolves to `null`.

##### Example

```typescript
import { pushModal } from 'react-material-overlay';

const modalId = await pushModal('content');
```

---

### Alert Dialog

#### options

| Property                   | Type                                                                                                        | Default    | Description                                                                                                      |
| -------------------------- | ----------------------------------------------------------------------------------------------------------- | ---------- | ---------------------------------------------------------------------------------------------------------------- |
| `containerId`              | `Id` (optional)                                                                                             | -          | Container ID to handle multiple containers.                                                                      |
| `alertDialogId`            | `Id` (optional)                                                                                             | -          | Set a custom `alertDialogId` to prevent duplication.                                                             |
| `content`                  | `React.ReactNode` (optional)                                                                                | -          | Content of the alert dialog.                                                                                     |
| `title`                    | `React.ReactNode` (optional)                                                                                | -          | Title of the alert dialog.                                                                                       |
| `onConfirmCancel`          | `() => void` (optional)                                                                                     | -          | Called when the cancel button is clicked.                                                                        |
| `onConfirmOk`              | `() => void` (optional)                                                                                     | -          | Called when the OK button is clicked.                                                                            |
| `confirmOkText`            | `string` (optional)                                                                                         | `"ok"`     | Label for the OK action button.                                                                                  |
| `confirmOkButtonProps`     | `ButtonProps` (optional)                                                                                    | -          | Props for the OK button for further customization.                                                               |
| `confirmCancelText`        | `string` (optional)                                                                                         | `"cancel"` | Label for the cancel action button.                                                                              |
| `confirmCancelButtonProps` | `ButtonProps` (optional)                                                                                    | -          | Props for the cancel button for further customization.                                                           |
| `actionButtons`            | `((props: IActionButtonsProps) => React.ReactNode) \| React.ReactElement<IActionButtonsProps>` (optional)   | -          | Pass custom Dialog Actions. By default, actions are OK and cancel.                                               |
| `onOpen`                   | `() => void` (optional)                                                                                     | -          | Called when the modal is mounted.                                                                                |
| `onClose`                  | `() => void` (optional)                                                                                     | -          | Called when the modal is unmounted.                                                                              |
| `DialogTitleProps`         | `DialogTitleProps` (optional)                                                                               | -          | Props for the DialogTitle component.                                                                             |
| `DialogContentProps`       | `DialogContentProps>` (optional)                                                                            | -          | Props for the DialogContent component.                                                                           |
| `DialogActionsProps`       | `DialogActionsProps>` (optional)                                                                            | -          | Props for the DialogActions component.                                                                           |
| `reactSuspenseFallback`    | `React.ReactNode` (optional)                                                                                | -          | Set a custom React Suspense fallback UI instead of the default for lazy contents.                                |
| `classes`                  | `DialogProps['classes'] \| ((defaultClasses: DialogProps['classes']) => DialogProps['classes'])` (optional) | -          | Override or extend the styles applied to the component.                                                          |
| `TransitionComponent`      | `DialogProps['TransitionComponent']` (optional)                                                             | `Fade`     | The component used for the transition. Follow the guide to learn more about the requirements for this component. |
| `slots`                    | `DialogProps['slots']` (optional)                                                                           | `{}`       | The components used for each slot inside the Modal.                                                              |
| `slotProps`                | `DialogProps['slotProps']` (optional)                                                                       | `{}`       | The props used for each slot inside the Modal.                                                                   |
| `fullScreen`               | `boolean` (optional)                                                                                        | `false`    | If `true`, the dialog is full-screen.                                                                            |
| `fullWidth`                | `boolean` (optional)                                                                                        | `false`    | If `true`, the dialog stretches to `maxWidth`.                                                                   |
| `maxWidth`                 | `Breakpoint \| false` (optional)                                                                            | `'sm'`     | Determine the max-width of the dialog.                                                                           |
| `PaperComponent`           | `DialogProps['PaperComponent']` (optional)                                                                  | `Paper`    | The component used to render the body of the dialog.                                                             |
| `PaperProps`               | `DialogProps['PaperProps']` (optional)                                                                      | `{}`       | Props applied to the `Paper` element.                                                                            |
| `scroll`                   | `'body' \| 'paper'` (optional)                                                                              | `'paper'`  | Determine the container for scrolling the dialog.                                                                |
| `sx`                       | `DialogProps['sx']` (optional)                                                                              | -          | The system prop that allows defining system overrides as well as additional CSS styles.                          |
| `transitionDuration`       | `DialogProps['transitionDuration']` (optional)                                                              | —          | The duration for the transition, in milliseconds.                                                                |
| `transitionPreset`         | `'zoom' \| 'fade' \| 'grow' \| 'slide' \| 'collapse'` (optional)                                            | `'fade'`   | Adjust the transition with preset Transitions. If you want more customization, use `TransitionComponent` prop.   |
| `transitionProps`          | `Omit<SlideProps & GrowProps & FadeProps & ZoomProps & CollapseProps, 'children'>` (optional)               | -          | Props applied to the transition element.                                                                         |
| `closeOnBackdropClick`     | `boolean` (optional)                                                                                        | `true`     | If `true`, the modal will close when the backdrop is clicked.                                                    |
| `DialogProps`              | `DialogProps` (optional)                                                                                    | -          | Props for the Dialog component for further customization.                                                        |

#### `AlertDialogContainer` props

| Property         | Type                                    | Description                                                                                                                                                                                                     |
| ---------------- | --------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `containerId`    | `Id` (optional)                         | An optional identifier for the container, useful for managing multiple alert dialog containers. The `Id` type represents a unique identifier that can be either a string or a number.                           |
| `defaultOptions` | `IAlertDialogDefaultOptions` (optional) | An optional object that defines default options for all alert dialogs rendered within this container. This allows for consistent behavior across multiple dialogs, such as title, message, buttons, and styles. |

#### `pushAlertDialog` API

Opens a new alert dialog overlay. If the container is not mounted or if the alert dialog is a duplicate, it returns `null`.

##### Parameters

- `options` (`IAlertDialogOptions`): Configuration options for the alert dialog. This includes properties such as `title`, `content`, and `actions`.

##### Returns

- `Promise<Id | null>`: A promise that resolves to the alert dialog ID if the alert dialog is successfully opened; otherwise, it resolves to `null`.

##### Example

```typescript
import { pushAlertDialog } from 'react-material-overlay';

const alertDialogId = await pushAlertDialog({ title: 'Dialog Title', content: 'Dialog Content' });
```

---

### Lightbox

#### options

| Property            | Type                                                                                                                      | Default | Description                                                                                                                                                                  |
| ------------------- | ------------------------------------------------------------------------------------------------------------------------- | ------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `slides`            | `LightboxProps['slides']`                                                                                                 | -       | Slides to display in the lightbox. This property is required.                                                                                                                |
| `containerId`       | `Id` (optional)                                                                                                           | -       | Container ID to handle multiple lightbox containers.                                                                                                                         |
| `on`                | `LightboxProps['on']` (optional)                                                                                          | -       | Lifecycle callbacks for the lightbox. Can include events like onOpen and onClose.                                                                                            |
| `render`            | `LightboxProps['render']` (optional)                                                                                      | -       | Custom render functions to control how the lightbox is displayed.                                                                                                            |
| `labels`            | `LightboxProps['labels']` (optional)                                                                                      | -       | Custom UI labels and translations for various elements within the lightbox.                                                                                                  |
| `toolbarOptions`    | `LightboxProps['toolbar']` (optional)                                                                                     | -       | Toolbar settings to customize the appearance and functionality of the lightbox's toolbar.                                                                                    |
| `carouselOptions`   | `LightboxProps['carousel']` (optional)                                                                                    | -       | Carousel settings to customize the behavior of the lightbox carousel.                                                                                                        |
| `animationOptions`  | `LightboxProps['animation']` (optional)                                                                                   | -       | Animation settings for transitions within the lightbox.                                                                                                                      |
| `controllerOptions` | `LightboxProps['controller']` (optional)                                                                                  | -       | Controller settings for managing user interactions with the lightbox.                                                                                                        |
| `noScrollOptions`   | `LightboxProps['noScroll']` (optional)                                                                                    | -       | Settings for the NoScroll module, which prevents scrolling when the lightbox is open.                                                                                        |
| `styles`            | `LightboxProps['styles'] \| ((theme: Theme) => LightboxProps['styles'])` (optional)                                       | -       | Customization styles for the lightbox. These styles are merged with the default styles defined in the container.                                                             |
| `captions`          | `boolean` (optional)                                                                                                      | `true`  | If `true`, the [Captions plugin](https://yet-another-react-lightbox.com/plugins/captions) will be used to display captions for the slides.                                   |
| `captionsOptions`   | `LightboxProps['captions']` (optional)                                                                                    | -       | Settings for the Captions plugin to customize how captions are displayed.                                                                                                    |
| `counter`           | `boolean` (optional)                                                                                                      | `false` | If `true`, the [Counter plugin](https://yet-another-react-lightbox.com/plugins/counter) will be used to show the current slide number.                                       |
| `counterOptions`    | `LightboxProps['counter']` (optional)                                                                                     | -       | Settings for the Counter plugin to customize its appearance and behavior.                                                                                                    |
| `download`          | `boolean` (optional)                                                                                                      | `false` | If `true`, the [Download plugin](https://yet-another-react-lightbox.com/plugins/download) will be used to provide a download option for the slides.                          |
| `downloadOptions`   | `LightboxProps['download']` (optional)                                                                                    | -       | Settings for the Download plugin to customize its functionality.                                                                                                             |
| `fullscreen`        | `boolean` (optional)                                                                                                      | `true`  | If `true`, the [Fullscreen plugin](https://yet-another-react-lightbox.com/plugins/fullscreen) will be used to allow users to view slides in fullscreen mode.                 |
| `fullscreenOptions` | `LightboxProps['fullscreen']` (optional)                                                                                  | -       | Settings for the Fullscreen plugin to customize how fullscreen mode behaves.                                                                                                 |
| `share`             | `boolean` (optional)                                                                                                      | `false` | If `true`, the [Share plugin](https://yet-another-react-lightbox.com/plugins/share) will be used to provide sharing options for the slides.                                  |
| `shareOptions`      | `LightboxProps['share']` (optional)                                                                                       | -       | Settings for the Share plugin to customize sharing functionality.                                                                                                            |
| `slideshow`         | `boolean` (optional)                                                                                                      | `false` | If `true`, the [Slideshow plugin](https://yet-another-react-lightbox.com/plugins/slideshow) will be used to enable automatic slideshow functionality.                        |
| `slideshowOptions`  | `LightboxProps['slideshow']` (optional)                                                                                   | -       | Settings for the Slideshow plugin to customize its behavior.                                                                                                                 |
| `thumbnails`        | `boolean` (optional)                                                                                                      | `true`  | If `true`, the [Thumbnails plugin](https://yet-another-react-lightbox.com/plugins/thumbnails) will be used to display thumbnails of the slides.                              |
| `thumbnailsOptions` | `LightboxProps['thumbnails']` (optional)                                                                                  | -       | Settings for the Thumbnails plugin to customize how thumbnails are displayed.                                                                                                |
| `videoOptions`      | `LightboxProps['video']` (optional)                                                                                       | -       | Settings for the Video plugin, which is used by default to handle video content within the lightbox.                                                                         |
| `zoom`              | `boolean` (optional)                                                                                                      | `true`  | If `true`, the [Zoom plugin](https://yet-another-react-lightbox.com/plugins/zoom) will be used to allow users to zoom in on slides.                                          |
| `zoomOptions`       | `LightboxProps['zoom']` (optional)                                                                                        | -       | Settings for the Zoom plugin to customize its behavior.                                                                                                                      |
| `extraPlugins`      | `LightboxProps['plugins']` (optional)                                                                                     | -       | Add extra plugins to enhance the lightbox's functionality.                                                                                                                   |
| `onOpen`            | `() => void` (optional)                                                                                                   | -       | Callback function called when the lightbox is mounted.                                                                                                                       |
| `onClose`           | `() => void` (optional)                                                                                                   | -       | Callback function called when the lightbox is unmounted.                                                                                                                     |
| `className`         | `((defaultClassName: LightboxProps['className']) => LightboxProps['className']) \| LightboxProps['className']` (optional) | -       | Override or extend the styles applied to the component. This can auto merge with the default className or manually overwrite the default className defined in the Container. |

#### `LightboxContainer` props

| Property         | Type                      | Description                                                                                                                                                                                                     |
| ---------------- | ------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `containerId`    | `Id` (optional)           | An optional identifier for the lightbox container. This allows for handling multiple instances of lightbox containers. Each container can be uniquely identified using this ID.                                 |
| `defaultOptions` | `ILightboxDefaultOptions` | This property sets the default options for the lightbox. It is required and should define various configurations such as animation, duration, and other preferences for the lightbox's appearance and behavior. |

#### `pushLightbox` API

Opens a new lightbox overlay. If the container is not mounted or if the lightbox is a duplicate, it returns `null`.

##### Parameters

- `options` (`ILightboxOptions`, optional): Additional options for configuring the lightbox, including slides and transition settings.

##### Returns

- `Promise<Id | null>`: A promise that resolves to the lightbox ID if the lightbox is successfully opened; otherwise, it resolves to `null`.

##### Example

```typescript
import { pushLightbox } from 'react-material-overlay';

const lightboxId = await pushLightbox({ slides: [...] });
```

---

### Bottom Sheet

#### options

| Property                | Type                                                                                                             | Default                                                             | Description                                                                                                                                                                                                              |
| ----------------------- | ---------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `containerId`           | `Id` (optional)                                                                                                  | -                                                                   | Container ID to manage multiple containers.                                                                                                                                                                              |
| `bottomSheetId`         | `Id` (optional)                                                                                                  | -                                                                   | Custom `bottomSheetId` to prevent duplication.                                                                                                                                                                           |
| `title`                 | `React.ReactNode` (optional)                                                                                     | —                                                                   | Title of the bottomSheet.                                                                                                                                                                                                |
| `subheader`             | `React.ReactNode` (optional)                                                                                     | —                                                                   | Subheader title of the bottomSheet.                                                                                                                                                                                      |
| `closeButton`           | `boolean \| ((props: ICloseButtonProps) => React.ReactNode) \| React.ReactElement<ICloseButtonProps>` (optional) | `true`                                                              | Custom close button. Pass `false` to remove it. Defaults to `IconButton`.                                                                                                                                                |
| `closeButtonProps`      | `IconButtonProps` (optional)                                                                                     | —                                                                   | Props applied to the close button element. Refer to the [IconButton props](https://mui.com/material-ui/api/icon-button/#props) for more details.                                                                         |
| `closeButtonIcon`       | `React.ReactNode` (optional)                                                                                     | —                                                                   | Custom icon for the close button.                                                                                                                                                                                        |
| `onOpen`                | `() => void` (optional)                                                                                          | -                                                                   | Callback function called when the bottom sheet is mounted.                                                                                                                                                               |
| `onClose`               | `() => void` (optional)                                                                                          | -                                                                   | Callback function called when the bottom sheet is unmounted.                                                                                                                                                             |
| `className`             | `BottomSheetProps['className']` (optional)                                                                       | -                                                                   | CSS class for the BottomSheet root element. Merges with the default className defined in Container or can overwrite it manually.                                                                                         |
| `sibling`               | `boolean \| React.ReactNode \| ((props: BottomSheetSiblingProps) => React.ReactNode)` (optional)                 | -                                                                   | Similar to `children`, renders next to the overlay element rather than inside it. Useful for position: fixed elements that need to overlay the backdrop while remaining interactive in blocking mode.                    |
| `footer`                | `boolean \| React.ReactNode \| ((props: BottomSheetFooterProps) => React.ReactNode)` (optional)                  | -                                                                   | Renders a sticky footer at the bottom of the sheet.                                                                                                                                                                      |
| `ref`                   | `ForwardedRef<BottomSheetRef>` (optional)                                                                        | -                                                                   | Reference to the BottomSheet. Example: `const sheetRef = useRef<BottomSheetRef>();`                                                                                                                                      |
| `BottomSheetProps`      | `React.PropsWithoutRef<JSX.IntrinsicElements['div']>` (optional)                                                 | -                                                                   | Props for the BottomSheet component (root element) for further customization.                                                                                                                                            |
| `sx`                    | `SxProps<Theme>` (optional)                                                                                      | -                                                                   | Allows defining additional CSS styles for the root element.                                                                                                                                                              |
| `onSpringStart`         | `(event: SpringEvent) => void` (optional)                                                                        | -                                                                   | Called to start a transition from closed to open or vice versa. Can return a promise or be async to delay the start of the transition.                                                                                   |
| `onSpringCancel`        | `(event: SpringEvent) => void` (optional)                                                                        | -                                                                   | Event that occurs when a running transition didn't finish or got stopped. This event isn't awaited and may happen after the sheet is unmounted if it were in the middle of something.                                    |
| `onSpringEnd`           | `(event: SpringEvent) => void` (optional)                                                                        | -                                                                   | Called when the transition ended successfully. Useful for knowing when it's safe to unmount the sheet without interrupting the closing animation. Can return a promise or be async to delay the start of the transition. |
| `initialFocusRef`       | `React.RefObject<HTMLElement> \| false` (optional)                                                               | -                                                                   | Reference to the element that should be focused. Defaults to the first interactive element. Set to `false` to disable keyboard focus when opening.                                                                       |
| `blocking`              | `boolean` (optional)                                                                                             | `true`                                                              | Determines whether the bottom sheet should block interactions with the rest of the page.                                                                                                                                 |
| `maxHeight`             | `number` (optional)                                                                                              | `window.innerHeight`                                                | The maximum height, defaults to `window.innerHeight` to match 100vh. Can be overridden by providing a number. Ensure to handle resize events when needed.                                                                |
| `scrollLocking`         | `boolean` (optional)                                                                                             | `true`                                                              | Ensures drag interactions work properly on iOS and Android. If set to `false`, test on actual devices to ensure dragging interactions don't break.                                                                       |
| `snapPoints`            | `snapPoints` (optional)                                                                                          | `({ minHeight }) => minHeight`                                      | Callback to get height values that the bottom sheet can snap to when the user stops dragging.                                                                                                                            |
| `defaultSnap`           | `number \| ((props: defaultSnapProps) => number)` (optional)                                                     | `({ snapPoints, lastSnap }) => lastSnap ?? Math.min(...snapPoints)` | Callback to get the initial height of the bottom sheet when opened or when the viewport is resized.                                                                                                                      |
| `reserveScrollBarGap`   | `boolean` (optional)                                                                                             | `blocking === true`                                                 | Configures body-scroll-lock to reserve scrollbar gap by setting padding on `<body>`, cleared when closing the bottom sheet. Defaults to `true` if blocking is true.                                                      |
| `skipInitialTransition` | `boolean` (optional)                                                                                             | `false`                                                             | Open immediately instead of animating from a closed to open state. Useful if the bottom sheet is visible by default.                                                                                                     |
| `header`                | `boolean \| ((params: ModalHeaderProps) => React.ReactNode) \| React.ReactElement<ModalHeaderProps>` (optional)  | `true`                                                              | Renders below the drag handle. Set to `false` to disable the drag handle.                                                                                                                                                |
| `defaultHeader`         | `boolean` (optional)                                                                                             | `true`                                                              | if `true` defaultheader element will be rendered                                                                                                                                                                         |
| `headerProps`           | `CardHeaderProps` (optional)                                                                                     | —                                                                   | Props for the header component. Refer to the [CardHeader props](https://mui.com/material-ui/api/card-header/#props) for more details.                                                                                    |
| `contentWrapperProps`   | `BoxProps` (optional)                                                                                            | —                                                                   | Props for the content wrapper component. Refer to the [Box props](https://mui.com/material-ui/api/card-content/#props) for details.                                                                                      |
| `expandOnContentDrag`   | `boolean` (optional)                                                                                             | `false`                                                             | Allows expanding the bottom sheet by dragging content. By default, users can only expand it by dragging the header or overlay.                                                                                           |

#### `BottomSheetContainer` props

| Property         | Type                                    | Description                                                                                                                                                                         |
| ---------------- | --------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `containerId`    | `Id` (optional)                         | An optional identifier to manage multiple bottom sheet containers. This allows for unique identification when rendering multiple instances.                                         |
| `defaultOptions` | `IBottomSheetDefaultOptions` (optional) | An optional object that sets the default options for the bottom sheets. These options can define behavior and appearance settings for all bottom sheets rendered by this container. |

#### `pushBottomSheet` API

Opens a new bottom sheet overlay. If the container is not mounted or if the bottom sheet is a duplicate, it returns `null`.

##### Parameters

- `content` (`BottomSheetContent`): The content to be displayed in the bottom sheet. This can be of various types defined in the `BottomSheetContent` union type.

- `options` (`IBottomSheetOptions`, optional): Additional options for configuring the bottom sheet. This is an object that can contain various properties as specified in the `IBottomSheetOptions` type.

##### Returns

- `Promise<Id | null>`: A promise that resolves to the bottom sheet ID if the bottom sheet is successfully opened; otherwise, it resolves to `null`.

##### Example

```typescript
import { pushBottomSheet } from 'react-material-overlay';

const bottomSheetId = await pushBottomSheet('content');
```

---

### Close APIs

#### `pop`

Closes the last active overlay or a specified number of active overlays programmatically. This allows for dynamic management of overlays within the application.

##### Parameters

- `count` (optional): `number`  
  The number of overlays to close. Defaults to `1`. If omitted, only the last active overlay will be removed.

##### Example

- Remove the last active overlay:

  ```typescript
  import { pop } from 'react-material-overlay';

  await pop();
  ```

- Remove the last two active overlays:

  ```typescript
  import { pop } from 'react-material-overlay';

  await pop(2);
  ```

#### `flush`

Closes all active overlays at once. This function is useful for resetting the overlay stack, ensuring that no overlays remain visible.

##### Example

```typescript
import { flush } from 'react-material-overlay';

await flush();
```

---

### RmoStack API Reference

The `RmoStack` module provides methods for managing a stack with integration into the browser's history state. This allows developers to push, pop, and flush items while handling event listeners for each item.

#### Interfaces

##### `PushOptions`

Options for the `push` method.

| Property     | Type         | Description                                                  |
| ------------ | ------------ | ------------------------------------------------------------ |
| `id`         | `Id`         | Optional identifier for the item being pushed.               |
| `onPopState` | `() => void` | Callback function that gets invoked when the item is popped. |

##### `SinglePopOptions`

Options for the `pop` method when popping a single item.

| Property                 | Type      | Description                                                     |
| ------------------------ | --------- | --------------------------------------------------------------- |
| `preventEventTriggering` | `boolean` | If true, prevents triggering the event when the item is popped. |
| `id`                     | `Id`      | Optional identifier to match the item that should be popped.    |

#### Methods

##### `push(options: PushOptions): Promise<{ id: Id; index: number }>`

Pushes a new item onto the stack, sets an event listener, and updates the history state.

- **Parameters**
  - `options`: An object of type `PushOptions`.
- **Returns**
  - A promise that resolves with an object containing:
    - `id`: The identifier of the pushed item.
    - `index`: The index of the pushed item in the stack.

##### `pop(params?: number | SinglePopOptions, preventEventTriggering?: boolean): Promise<void>`

Pops items from the stack.

- **Parameters**

  - `params`: Can be either:
    - A `number` indicating the count of items to pop.
    - An object of type `SinglePopOptions` for popping a single item.
  - `preventEventTriggering`: (optional) A boolean to prevent triggering events for each popped item.

- **Returns**
  - A promise that resolves when the pop operation is complete.

##### `flush(preventEventTriggering: boolean = false): Promise<void>`

Flushes all items from the stack, optionally triggering events for each item.

- **Parameters**

  - `preventEventTriggering`: (optional) If `true`, prevents triggering events for each flushed item.

- **Returns**
  - A promise that resolves when all items are flushed.

##### `findIndexById(id: Id): number`

Finds the index of an item in the stack by its identifier.

- **Parameters**

  - `id`: The identifier of the item to search for in the stack.

- **Returns**
  - The index of the item in the stack, or `-1` if not found.

#### Properties

##### `length: number`

The current length of the stack.

- **Returns**
  - The number of items currently in the stack.

#### Usage Example

```typescript
import RmoStack from './path/to/RmoStack';

// Pushing an item onto the stack
RmoStack.push({
	id: 'uniqueId',
	onPopState: () => {
		console.log('Item popped from the stack');
	}
}).then(({ id, index }) => {
	console.log(`Pushed item with id ${id} at index ${index}`);
});

// Popping an item from the stack
RmoStack.pop().then(() => {
	console.log('Item popped');
});

// Flushing the stack
RmoStack.flush().then(() => {
	console.log('All items flushed from the stack');
});

// Finding the index of an item by id
const index = RmoStack.findIndexById('uniqueId');
console.log(`Index of item: ${index}`);
```
