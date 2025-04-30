# Canvas Rendering Performance Demo

_Last Updated: April 2025_

## Overview
This project demonstrates the performance differences between rendering on the main thread versus using Web Workers with OffscreenCanvas. It creates a grid-like spreadsheet UI with text in each cell, similar to Excel, and provides options to compare rendering methods.

## Features

- **Dynamic Canvas Creation**: Adjust the number of canvas elements (minimum 6) to test scaling performance.
- **Configurable Worker Pool**: Change the number of Web Workers (1-16) to optimize for different hardware.
- **Main Thread Rendering**: Render grids directly on the main thread.
- **Web Worker Rendering**: Render using Web Workers with OffscreenCanvas to avoid blocking the main thread.
- **Performance Metrics**: Display render times for both synchronous and worker-based approaches.
- **Worker Pooling**: Configure the number of workers and cycle rendering through them for optimal resource usage.

## Recent Updates

- **Worker Count Synchronization**: When updating worker count, canvas count is automatically synchronized
- **Code Optimizations**: Improved memory management and worker lifecycle handling
- **Updated Browser Compatibility**: Verified support with latest browser versions as of April 2025

## Project Structure

- **index.html**: Main HTML file containing the UI elements and canvas containers.
- **renderer.js**: Shared rendering logic used by both main thread and workers.
- **script.js**: Handles main thread rendering and canvas management.
- **offscreen.js**: Manages Web Workers and coordinates offscreen canvas rendering.
- **offscreenWorker.js**: The Web Worker implementation that receives and renders to OffscreenCanvas.
- **index.js**: Placeholder file (previously used for FPS tracking).
- **server.js**: Node.js/Express server for serving the application.

## How It Works

### Main Thread Rendering
When you click "Render Grids," the application:
1. Disables the button to prevent multiple clicks
2. Starts timing the operation
3. For each canvas, renders a grid with random text using the shared renderer
4. Measures and displays the total render time
5. Re-enables the button

### Web Worker Rendering
When you click "Render with Web Worker," the application:
1. Disables the button to prevent multiple clicks
2. Starts timing the operation
3. Distributes rendering tasks among your configured pool of workers (default: 2)
4. Each worker renders to an OffscreenCanvas and returns the result as an ImageBitmap
5. The main thread draws these ImageBitmaps onto the visible canvases
6. Measures and displays the total render time
7. Re-enables the button

### Shared Rendering Logic
Both approaches use the same rendering function from renderer.js, which:
1. Clears the canvas
2. Adds a 10ms delay to simulate intensive rendering work
3. Draws a grid with configurable rows and columns
4. Populates cells with random text in randomly selected fonts

## Performance Considerations

- The main thread approach blocks the UI during rendering
- The worker-based approach allows the UI to remain responsive
- The performance difference becomes more apparent with:
  - More canvas elements
  - More complex rendering tasks
  - Slower devices

## Performance Optimizations for ImageBitmap Transfers

The transfer of ImageBitmap data between web workers and the main thread can be optimized using several techniques:

### Current Implementation
This demo uses `transferToImageBitmap()` and the structured clone algorithm with transferable objects, which is already more efficient than copying data.

### Additional Optimizations
1. **Batch Processing**: Group multiple canvas operations and transfer fewer, larger ImageBitmaps
2. **Resolution Scaling**: Render at lower resolution during high-activity periods, then increase when idle
3. **Partial Updates**: Only transfer the regions that changed instead of the entire canvas
4. **SharedArrayBuffer**: For browsers that support it, use SharedArrayBuffer to avoid transfers altogether
5. **Compression**: For complex scenes, compress bitmap data before transfer (trade CPU for bandwidth)
6. **Frame Skipping**: Implement adaptive frame skipping based on system performance

### Benchmarking
To identify bottlenecks:
- Profile memory usage during transfers
- Measure transfer time separately from rendering time
- Compare performance across different browsers and devices

## Running the Project

### Node.js Server (Recommended)

This project includes a Node.js Express server for easy deployment and testing:

1. Make sure you have [Node.js](https://nodejs.org/) installed
2. Install dependencies:
   ```
   npm install
   ```
3. Start the server:
   ```
   npm start
   ```
   Or for development with auto-restart:
   ```
   npm run dev
   ```
4. Open your browser and navigate to: `http://localhost:3002`

### Alternative: Python Development Server

You can also use Python's built-in HTTP server:

#### Using Python 3:
```
cd /path/to/offscreenRender
python -m http.server 8000
```

#### Using Python 2:
```
cd /path/to/offscreenRender
python -m SimpleHTTPServer 8000
```

Then open your browser and navigate to: `http://localhost:8000`

### Usage Instructions
1. Once the server is running, open the URL in a modern browser that supports OffscreenCanvas
2. Use the number input and "Update Canvas Count" button to adjust the number of canvases
3. Use the number input and "Update Worker Count" button to adjust the number of web workers (1-16)
4. Click "Render Grids" to test main thread rendering performance
5. Click "Render with Web Worker" to test worker-based rendering performance
6. Compare the render times displayed in the top-right corner

## Browser Support

This demo requires modern browser features including:
- OffscreenCanvas
- Web Workers
- transferControlToOffscreen()
- ImageBitmap

As of April 2025, the following browsers fully support these features:
- Chrome 100+
- Edge 100+
- Firefox 97+
- Safari 16.4+

Older browser versions may have partial or no support for OffscreenCanvas.