
# Toast Notification

A customizable toast notification library for displaying messages with different styles and durations.

## Installation

You can install the package via npm:

```bash
npm install toastthk
```

## Usage

After installing, you can use the toast notification by including the required JavaScript and CSS files:

```html
<!-- Include CSS -->
<link rel="stylesheet" href="path/to/toast.css">
```
```html
<!-- Include JS -->
<script src="path/to/toast.js"></script>
```
```css
/* Import css */
@import 'toastthk/toast.css'
```
```js
// import js
import 'toastthk'
```

Then you can show a toast by calling the `Toast.show()` function:

```javascript
// Display a default toast message
Toast.show('This is a default toast');

// Display a success toast message
Toast.show('Success message', { type: 'success' });
Toast.success('Success message');

// Display an error toast message with a custom icon
Toast.show('Error message', { type: 'error', icon: 'fas fa-bug' });
Toast.error('Success message', { icon: 'fas fa-bug' });

// Display a custom toast with an icon and different position
Toast.show('Custom Icon Toast', { icon: 'fas fa-smile', position: 'bottom-left' });
```

### Options

You can customize the toast notification by passing options as the second argument to `Toast.show()`. The available options are:

| Option         | Type                        | Default       | Description                                     |
|----------------|-----------------------------|---------------|-------------------------------------------------|
| `type`         | `string`                    | `'default'`   | Type of toast (affects color and icon).         |
| `position`     | `string`                    | `'top-right'` | Position of the toast on screen.                |
| `duration`     | `number`                    | `300`         | Animation duration in milliseconds.             |
| `delay`        | `number`                    | `3000`        | How long the toast stays visible (ms).          |
| `hideProgress` | `boolean`                   | `false`       | Whether to hide the progress bar.               |
| `closeOnClick` | `boolean`                   | `true`        | Whether clicking the toast closes it.           |
| `icon`         | `string`, `null`            | `null`        | Custom icon class name to display.              |
| `hideIcon`     | `boolean`                   | `false`       | Whether to hide the default icon.               |

- **`type`**: The type of the toast (`default`, `success`, `error`, `warning`, `info`). Default is `'default'`.
- **`position`**: The position of the toast on the screen (`top-left`, `top-right`, `bottom-left`, `bottom-right`). Default is `'top-right'`.
- **`hideProgress`**: Whether to hide the progress bar (`true` or `false`). Default is `false`.
- **`delay`**: The delay before the toast disappears (in milliseconds). Default is `3000`.
- **`closeOnClick`**: Whether the toast can be closed by clicking on it (`true` or `false`). Default is `true`.
- **`duration`**: The duration of the toast animation (in milliseconds). Default is `300`.
- **`icon`**: A custom icon for the toast. If not provided, a default icon will be used based on the `type`.
- **`hideIcon`**: Whether to hide the icon (`true` or `false`). Default is `false`.

### Example with options

```javascript
Toast.show('Custom success message', { 
  type: 'success', 
  position: 'bottom-left', 
  delay: 5000, 
  icon: 'fas fa-check-circle' 
});
```

## Customizing the Styles

You can customize the CSS styles to fit your project needs. The package comes with default styles, but you can modify the following classes:

- `.toastthk-wrapper`: The container for all toast messages.
- `.toastthk-container`: The container for a single toast message.
- `.toastthk-item`: The individual toast item.
- `.toastthk-progress`: The progress bar inside the toast.
  
Feel free to override the styles in your own CSS file to better suit your needs.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

### ☕ Buy Me a Coffee

This toast notification library was crafted with care and countless cups of coffee ☕.  
If you find it useful or it saved you time in your project, consider supporting me so I can keep building and maintaining cool open-source tools like this.

<a href="https://www.buymeacoffee.com/mindytran" target="_blank">
  <img src="https://hoccungdinh.com/wp-content/uploads/2022/06/Buy-me-a-coffee.png" alt="Buy Me a Coffee" width="150"/>
</a>

Your support fuels more late-night coding sessions, feature improvements, and bug fixes ❤️
