# Mimush Meme Generator

A browser-based meme generator built with vanilla JavaScript and HTML Canvas.
Pick an image from the gallery (or upload your own), add multiple text lines, style them, drag them on the canvas, and export your meme.

## Features

- Image gallery with keyword search and keyword cloud
- Upload custom image from your device
- Canvas-based meme editor
- Add, switch, and remove text lines
- Drag text lines to reposition
- Resize text with controls and by dragging the resize handle
- Text styling controls:
	- Font family
	- Font size
	- Alignment
	- Italic and underline
	- Fill color
- Download meme as an image
- Share meme through Facebook (via Cloudinary upload)
- Responsive layout for desktop and mobile

## Tech Stack

- HTML5
- CSS3
- JavaScript (ES6+)
- HTML Canvas API
- Cloudinary upload API (for sharing)
- Font Awesome icons

## Project Structure

```
index.html
js/
	gallery-controller.js
	meme-controller.js
	services/
		image.service.js
		meme.service.js
styles/
	styles.css
	base/
	components/
	setup/
images/
fonts/
```

## Getting Started

Because this is a client-side app, you can run it directly in the browser.

1. Clone or download the repository.
2. Open `index.html` in your browser.

Optional (recommended): run it with a local server (for example VS Code Live Server) for a smoother development workflow.

## How to Use

1. Open the app and choose an image from the gallery.
2. Or upload your own image with the file picker.
3. Use the text input to edit the selected line.
4. Add or switch lines with the line manager buttons.
5. Drag text on the canvas to reposition.
6. Use the style controls to change size, alignment, font, color, and emphasis.
7. Click Download to save your meme.
8. Click Share to upload and open Facebook share flow.

## Core Files

- `index.html`: app layout, editor controls, and script loading
- `js/gallery-controller.js`: gallery rendering, filters, and keyword interactions
- `js/meme-controller.js`: canvas rendering, line interactions, upload/share, and navigation
- `js/services/meme.service.js`: meme state management and line operations
- `js/services/image.service.js`: image data and keyword metadata

## Notes

- The share feature uploads to Cloudinary using the configured cloud name and preset in `js/meme-controller.js`.
- If sharing does not work, verify network access and Cloudinary settings.

## Live App

- https://yairpro1000.github.io/meme-gen/#
