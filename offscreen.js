/**
 * Offscreen Canvas Rendering Module
 * Handles rendering using web workers and OffscreenCanvas
 */

// Caches and state variables
const DEFAULT_WORKERS = 2;   // Default number of workers
let MAX_WORKERS = DEFAULT_WORKERS;   // Maximum number of workers (configurable)
const workers = [];      // Pool of reusable workers
const canvasToWorker = new Map(); // Maps canvas IDs to workers
let completedRenders = 0;      // Track completed renders
let renderStartTime = 0;       // Timestamp for render start

// Function to initialize worker pool
function initializeWorkers(count) {
    // Clear existing workers if any
    while (workers.length > 0) {
        const worker = workers.pop();
        worker.terminate();
    }
    
    // Create new workers
    for (let i = 0; i < count; i++) {
        workers.push(new Worker('offscreenWorker.js'));
    }
    
    console.log(`Worker pool initialized with ${count} workers`);
}

// Initialize worker pool on page load with default count
initializeWorkers(MAX_WORKERS);

// Setup worker count update button handler
document.getElementById('updateWorkerCount').addEventListener('click', () => {
    const workerCountInput = document.getElementById('workerCount');
    let newWorkerCount = parseInt(workerCountInput.value);
    
    // Validate worker count (minimum 1, maximum 16)
    if (isNaN(newWorkerCount) || newWorkerCount < 1) {
        newWorkerCount = 1;
        workerCountInput.value = '1';
    } else if (newWorkerCount > 16) {
        newWorkerCount = 16;
        workerCountInput.value = '16';
    }
    
    // Update worker count and reinitialize pool
    MAX_WORKERS = newWorkerCount;
    initializeWorkers(MAX_WORKERS);
    
    // Reset canvas-to-worker mappings since workers are new
    canvasToWorker.clear();
    
    // Reset any data-offscreen-transferred attributes on canvases
    canvasIds.forEach(id => {
        const canvas = document.getElementById(id);
        if (canvas) {
            canvas.removeAttribute('data-offscreen-transferred');
        }
    });
    
    // Call updateCanvasCount to ensure canvas count matches
    updateCanvasCount();
});

/**
 * Event handler for the worker render button
 * Transfers canvas control to web workers for rendering
 */
document.getElementById('workerRenderButton').addEventListener('click', () => {
    // Disable button while rendering
    const workerRenderButton = document.getElementById('workerRenderButton');
    workerRenderButton.disabled = true;
    const startTime = performance.now();

    // Reset counters and start timing
    renderStartTime = performance.now();
    completedRenders = 0;
    
    canvasIds.forEach((id, index) => {
        // Get canvas elements
        const canvas = document.getElementById(id);
        const canvasNumber = id.replace('canvas', '');
        const offscreenId = "offscreenCanvas" + canvasNumber;
        const offscreenCanvas = document.getElementById(offscreenId);
        
        // Validate elements exist
        if (!canvas || !offscreenCanvas) {
            console.error(`Canvas with ID ${id} or offscreen canvas with ID ${offscreenId} not found`);
            completedRenders++;
            return;
        }

        // Get worker from pool (cycling through available workers)
        const workerIndex = index % MAX_WORKERS;
        const worker = workers[workerIndex];
        
        // Store worker reference for this canvas
        canvasToWorker.set(id, worker);
        
        // Set up or update message listener
        worker.onmessage = (event) => {
            const { imageBitmap, canvasId } = event.data;
            const targetCanvas = document.getElementById(canvasId);
            
            if (targetCanvas) {
                const ctx = targetCanvas.getContext('2d');
                
                // Draw the rendered image to the visible canvas
                ctx.clearRect(0, 0, targetCanvas.width, targetCanvas.height);
                ctx.drawImage(imageBitmap, 0, 0);
            }

            // Update completion status
            completedRenders++;
            if (completedRenders === canvasIds.length) {
                // All canvases have finished rendering
                const endTime = performance.now();
                const totalRenderTime = endTime - renderStartTime;
                
                // Update performance metrics
                document.getElementById('time').textContent = totalRenderTime.toFixed(2);
                
                // Re-enable button
                workerRenderButton.disabled = false;
            }
        };

        // Check if this canvas has already transferred control
        if (!canvasToWorker.has(id) || !canvas.getAttribute('data-offscreen-transferred')) {
            // First-time setup - transfer control
            const offscreen = offscreenCanvas.transferControlToOffscreen();
            worker.postMessage({
                canvas: offscreen,
                canvasId: id,
                randomText,
                isInitialSetup: true
            }, [offscreen]);
            
            // Mark this canvas as having transferred control
            canvas.setAttribute('data-offscreen-transferred', 'true');
        } else {
            // Reuse existing worker and transferred canvas
            worker.postMessage({
                canvasId: id,
                randomText,
                isInitialSetup: false
            });
        }
    });

    const endTime = performance.now();
    const renderTime = endTime - startTime;

    // Update performance metrics
    document.getElementById('sync_time').textContent = renderTime.toFixed(2);
});