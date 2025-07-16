
# Nami Path Hint 📍

A simple, zero-configuration VS Code extension that adds a clickable file path hint at the top of your editor. Never lose track of which file you're in, especially in projects with deep folder structures.

![Nami Path Hint Demo](https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExY2Q4Yjk0NjExZ20wamR6dmY5aXFqbDYxOWdrNnZ1b2diZDQyM2t6NCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/DScjO8V2iTa8PUquXh/giphy.gif)

---

## Features

* **Always-Visible Path**: Displays an inlay hint with the file's path on the first line.
* **Smart Truncation**: Intelligently shortens long paths by removing folders from the front, always keeping the full filename visible.
* **Click to Copy**: Simply click the path hint to instantly copy the file's full absolute path to your clipboard.
* **Detailed Tooltip**: Hover over the hint to see the full, untruncated path and a button to copy.

---

## Requirements

There are no external requirements or dependencies. Simply install and it works.

---

## Extension Settings

This extension does not contribute any VS Code settings through the settings UI. For customization of the path formatting, you can directly edit the constants at the top of the `formatPathForDisplay` function in the source code.

---

## Release Notes

### 1.0.0

Initial release of Nami Path Hint.
* Added inlay hint for file paths.
* Implemented smart path truncation.
* Added click-to-copy functionality.

---

**Enjoy the extension!**