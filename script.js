/**
 * Canvas Grid Rendering - Main Script
 */

// Constants and initial setup
let canvasIds = Array.from({ length: 6 }, (_, i) => `canvas${i + 1}`);
const randomText = [
    'Apple', 'Banana', 'Cherry', 'Dragon', 'Elder', 
    'Figgy', 'Grape', 'Honey', 'Indigo', 'Joker'
];

/**
 * Updates the number of canvas elements based on user input
 */
function updateCanvasCount() {
    const count = Math.max(6, parseInt(document.getElementById('canvasCount').value));
    
    // Update canvasIds array
    canvasIds = Array.from({ length: count }, (_, i) => `canvas${i + 1}`);
    
    // Get container and reference elements
    const container = document.getElementById('canvasContainer') || document.body;
    
    // Remove all existing visible canvases
    document.querySelectorAll('canvas[id^="canvas"]').forEach(canvas => {
        canvas.remove();
    });
    
    // Remove all existing hidden offscreen canvases
    document.querySelectorAll('canvas[id^="offscreenCanvas"]').forEach(canvas => {
        canvas.remove();
    });
    
    // Create new canvases
    for (let i = 1; i <= count; i++) {
        // Create visible canvas
        const canvas = document.createElement('canvas');
        canvas.id = `canvas${i}`;
        canvas.width = 800;
        canvas.height = 600;
        canvas.style = 'border:1px solid #000; margin-bottom: 10px;';
        container.appendChild(canvas);
        
        // Create hidden offscreen canvas
        const offscreenCanvas = document.createElement('canvas');
        offscreenCanvas.id = `offscreenCanvas${i}`;
        offscreenCanvas.width = 800;
        offscreenCanvas.height = 600;
        offscreenCanvas.style = 'display:none;';
        document.querySelector('div[style="display:none;"]').appendChild(offscreenCanvas);
    }
    
    console.log(`Canvas count updated to ${count}`);
}

/**
 * Renders grid and text on all canvases
 */
function renderGrids() {
    // Disable button while rendering
    const renderButton = document.getElementById('renderButton');
    renderButton.disabled = true;

    const startTime = performance.now();
    
    canvasIds.forEach((id) => {
        const canvas = document.getElementById(id);
        const ctx = canvas.getContext('2d');

        // Use shared renderer logic
        renderer.renderGrid(ctx, canvas.width, canvas.height, randomText);
    });

    const endTime = performance.now();
    const renderTime = endTime - startTime;

    // Update performance metrics
    document.getElementById('time').textContent = renderTime.toFixed(2);
    document.getElementById('sync_time').textContent = renderTime.toFixed(2);

    // Re-enable button when all rendering is complete
    renderButton.disabled = false;
}

// Event listeners
document.getElementById('updateCanvasCount').addEventListener('click', updateCanvasCount);
document.getElementById('renderButton').addEventListener('click', renderGrids);