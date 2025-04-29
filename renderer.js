/**
 * Canvas Grid Renderer
 * Shared rendering logic for both main thread and web workers
 */

/**
 * Renders a grid with random text on a canvas
 * @param {CanvasRenderingContext2D} ctx - The canvas 2D context
 * @param {number} width - Canvas width
 * @param {number} height - Canvas height
 * @param {string[]} randomText - Array of text strings to use
 */
function renderGrid(ctx, width, height, randomText) {
    // Clear the canvas
    ctx.clearRect(0, 0, width, height);

    // Add a small delay to simulate more intensive rendering work
    const startTime = Date.now();
    while (Date.now() - startTime < 10) {
        // Busy wait for 10ms
    }

    // Set grid dimensions
    const rows = 25;
    const cols = 25;
    const cellWidth = width / cols;
    const cellHeight = height / rows;

    // Draw grid
    ctx.strokeStyle = 'black';
    
    // Draw horizontal lines
    for (let i = 0; i <= rows; i++) {
        ctx.beginPath();
        ctx.moveTo(0, i * cellHeight);
        ctx.lineTo(width, i * cellHeight);
        ctx.stroke();
    }
    
    // Draw vertical lines
    for (let j = 0; j <= cols; j++) {
        ctx.beginPath();
        ctx.moveTo(j * cellWidth, 0);
        ctx.lineTo(j * cellWidth, height);
        ctx.stroke();
    }

    // Define a set of fonts
    const fonts = ['5pt Arial', '5pt Verdana', '5pt Times New Roman', '5pt Courier New', '5pt Georgia'];

    // Fill cells with random text
    ctx.fillStyle = 'black';
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            const font = fonts[Math.floor(Math.random() * fonts.length)];
            ctx.font = font;
            const text = randomText[Math.floor(Math.random() * randomText.length)];
            ctx.fillText(text, j * cellWidth + cellWidth / 4, i * cellHeight + cellHeight / 1.5);
        }
    }
}

// Export the function for use in other modules
// This will work in both browser and worker contexts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { renderGrid };
} else if (typeof self !== 'undefined') {
    // In a worker context or browser global
    self.renderer = { renderGrid };
}