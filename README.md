# Cursor Motion

A lightweight custom cursor with hover, magnetic and morph interactions.

Cursor Motion replaces the default desktop cursor with a smooth animated cursor that supports multiple interaction modes.

[Live Demo (PC Only)](https://sairo-cyber.github.io/cursor-motion/demo)

## Features

- Lightweight and dependency-free
- Desktop-focused custom cursor
- Smooth cursor movement
- Default hover state
- Magnetic cursor effect
- Morph cursor effect
- Magnetic + morph effect
- Optional text labels
- Custom element selector
- Event delegation
- Dynamic DOM support
- `destroy()` method
- Automatically disabled on touch and coarse pointer devices

## Installation

Install Cursor Motion with npm:

```bash
npm install cursor-motion
```

## Usage

Import the JavaScript module and the CSS file:

```js
import { createCursor } from "cursor-motion";
import "cursor-motion/style.css";

createCursor();
```

## Basic Example

```js
import { createCursor } from "cursor-motion";
import "cursor-motion/style.css";

const cursor = createCursor();
```

## Interaction Modes

Cursor Motion supports four different interaction modes.

### Default

Links and buttons automatically use the default hover effect.

```html
<a href="#">
    Default link
</a>

<button>
    Default button
</button>
```

### Magnetic

Add `data-cursor="magnetic"` to pull the cursor toward the element.

```html
<button data-cursor="magnetic">
    Magnetic
</button>
```

### Morph

Add `data-cursor="morph"` to make the cursor grow and morph to the size of the element.

```html
<button data-cursor="morph">
    Morph
</button>
```

You can also display a label inside the cursor:

```html
<button
    data-cursor="morph"
    data-cursor-text="Open"
>
    Morph
</button>
```

### Magnetic Morph

Combine both effects with `data-cursor="magnetic-morph"`.

```html
<a
    href="#"
    data-cursor="magnetic-morph"
    data-cursor-text="Open"
>
    Open
</a>
```

## Custom Selector

By default, Cursor Motion activates on:

```text
[data-cursor], a, button
```

You can provide your own selector with the `selector` option.

```js
const cursor = createCursor({
    selector: "[data-cursor], a, button, .cursor-target"
});
```

For example:

```html
<div class="cursor-target">
    Custom target
</div>
```

This allows you to use Cursor Motion with custom interactive elements.

## Destroy

`createCursor()` returns an object with a `destroy()` method.

```js
const cursor = createCursor();

cursor.destroy();
```

This removes the cursor, event listeners and MutationObserver created by Cursor Motion.

The cursor can also be created again afterwards:

```js
const cursor = createCursor();

cursor.destroy();

const newCursor = createCursor();
```

## Browser Support

Cursor Motion is designed for desktop devices with a fine pointer.

It automatically disables itself when:

- hover is not supported
- the primary pointer is coarse

Touch and mobile devices are intentionally not supported.

## CSS

Cursor Motion does not inject the cursor styles automatically.

Import the stylesheet alongside the JavaScript:

```js
import "cursor-motion/style.css";
```

The stylesheet contains the default cursor appearance and interaction states.

## Customization

The cursor appearance can be customized through the CSS classes provided by the package.

Main cursor:

`.cursor`

Hidden state:

`.cursor.is-hidden`

Default hover state:

`.cursor.is-hovering`

Magnetic state:

`.cursor.is-magnetic`

Morph state:

`.cursor.is-morph`

Cursor label:

`.cursor-label`

The morph border radius is controlled by the CSS custom property:

`--cursor-radius`

## Data Attributes

### `data-cursor`

Available values:

- `magnetic`
- `morph`
- `magnetic-morph`

Example:

```html
<button data-cursor="magnetic">
    Magnetic
</button>
```

### `data-cursor-text`

Adds a text label inside morph modes.

Example:

```html
<button
    data-cursor="morph"
    data-cursor-text="Open"
>
    Open
</button>
```

## How It Works

Cursor Motion creates a single cursor element and tracks mouse movement using `requestAnimationFrame`.

Interactive elements are detected through event delegation, which means elements added dynamically to the page can also work without additional initialization.

Magnetic elements pull the cursor toward their center.

Morph elements resize the cursor to match the dimensions of the target element.

Magnetic-morph elements combine both behaviors.

## Complete Example

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Cursor Motion</title>

    <link rel="stylesheet" href="node_modules/cursor-motion/src/cursor.css">
</head>
<body>

    <button>Default</button>

    <button data-cursor="magnetic">
        Magnetic
    </button>

    <button
        data-cursor="morph"
        data-cursor-text="Open"
    >
        Morph
    </button>

    <a
        href="#"
        data-cursor="magnetic-morph"
        data-cursor-text="Open"
    >
        Magnetic Morph
    </a>

    <script type="module">
        import { createCursor } from "cursor-motion";

        createCursor();
    </script>

</body>
</html>
```

## Live Demo

Try Cursor Motion directly in your browser:

[Open the live demo](https://sairo-cyber.github.io/cursor-motion/demo)

## Project

GitHub repository:

[github.com/sairo-cyber/cursor-motion](https://github.com/sairo-cyber/cursor-motion)

Report issues or request features:

[GitHub Issues](https://github.com/sairo-cyber/cursor-motion/issues)

## License

This project is licensed under the MIT License.

See the [LICENSE](LICENSE) file for the complete license text.

## Author

Made by [sairo-cyber](https://github.com/sairo-cyber).
