/**
 * Offscreen Canvas Worker
 * Web Worker that handles rendering on an OffscreenCanvas
 */

// Import shared renderer (this is loaded from the main script)
importScripts('renderer.js');

// Store canvas references by ID
const canvasMap = new Map();

/**
 * Message handler for the worker
 * Processes render requests from the main thread
 */
self.onmessage = function(event) {
    const { randomText, isInitialSetup, canvasId } = event.data;
    
    let canvas, ctx;
    
    // If this is the initial setup, store the canvas reference
    if (isInitialSetup) {
        canvas = event.data.canvas;
        ctx = canvas.getContext('2d');
        canvasMap.set(canvasId, { canvas, ctx });
    } else {
        // Get the stored canvas reference
        const stored = canvasMap.get(canvasId);
        if (!stored) {
            console.error(`No canvas found for ID ${canvasId}`);
            return;
        }
        canvas = stored.canvas;
        ctx = stored.ctx;
    }
    
    // Validate context
    if (!ctx) {
        console.error('No canvas context available');
        return;
    }

    // Use shared renderer logic
    self.renderer.renderGrid(ctx, canvas.width, canvas.height, randomText);

    // Transfer the rendered image back to the main thread
    const imageBitmap = canvas.transferToImageBitmap();
    self.postMessage({ imageBitmap, canvasId });
};