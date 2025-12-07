/**
 * Code Player - Main JavaScript File
 * Handles live code execution and panel updates using jQuery
 */

/**
 * CodePlayer Class
 * Main class that manages the code player functionality
 */
class CodePlayer {
    /**
     * Constructor for CodePlayer class
     * Initializes the code player and sets up event listeners
     */
    constructor() {
        // Store references to editor elements
        this.htmlEditor = $('#htmlEditor');
        this.cssEditor = $('#cssEditor');
        this.jsEditor = $('#jsEditor');
        this.outputFrame = $('#outputFrame');
        
        // Store references to control buttons
        this.runBtn = $('#runBtn');
        this.clearBtn = $('#clearBtn');
        this.resetBtn = $('#resetBtn');
        
        // Default code templates
        this.defaultHTML = `<div class="demo">
    <h1>Welcome to Code Player</h1>
    <p>Edit the code in any panel to see live updates!</p>
    <button id="demoBtn">Click Me</button>
</div>`;
        
        this.defaultCSS = `.demo {
    padding: 20px;
    text-align: center;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    border-radius: 10px;
    margin: 20px;
}

.demo h1 {
    font-size: 2.5em;
    margin-bottom: 10px;
}

.demo p {
    font-size: 1.2em;
    margin-bottom: 20px;
}

#demoBtn {
    padding: 12px 30px;
    font-size: 1.1em;
    background: white;
    color: #667eea;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    transition: transform 0.2s;
}

#demoBtn:hover {
    transform: scale(1.05);
}`;
        
        this.defaultJS = `// Demo JavaScript code
$(document).ready(function() {
    $('#demoBtn').on('click', function() {
        alert('Hello from Code Player! 🎉');
        $(this).text('Clicked!');
        setTimeout(() => {
            $(this).text('Click Me');
        }, 2000);
    });
});`;
        
        // Initialize the code player
        this.init();
    }
    
    /**
     * Initialize method
     * Sets up all event listeners and runs initial code
     */
    init() {
        // Set up live update listeners for all editors
        this.setupLiveUpdates();
        
        // Set up control button listeners
        this.setupControls();
        
        // Run initial code
        this.updateOutput();
    }
    
    /**
     * Setup live updates method
     * Attaches event listeners to editors for real-time updates
     */
    setupLiveUpdates() {
        // Listen for input events on HTML editor
        this.htmlEditor.on('input', () => {
            this.updateOutput();
        });
        
        // Listen for input events on CSS editor
        this.cssEditor.on('input', () => {
            this.updateOutput();
        });
        
        // Listen for input events on JavaScript editor
        this.jsEditor.on('input', () => {
            this.updateOutput();
        });
        
        // Also listen for paste events
        this.htmlEditor.on('paste', () => {
            setTimeout(() => this.updateOutput(), 10);
        });
        
        this.cssEditor.on('paste', () => {
            setTimeout(() => this.updateOutput(), 10);
        });
        
        this.jsEditor.on('paste', () => {
            setTimeout(() => this.updateOutput(), 10);
        });
    }
    
    /**
     * Setup controls method
     * Attaches event listeners to control buttons
     */
    setupControls() {
        // Run button - manually trigger update
        this.runBtn.on('click', () => {
            this.updateOutput();
            this.showNotification('Code executed!');
        });
        
        // Clear button - clear all editors
        this.clearBtn.on('click', () => {
            if (confirm('Are you sure you want to clear all code?')) {
                this.clearAll();
            }
        });
        
        // Reset button - restore default code
        this.resetBtn.on('click', () => {
            if (confirm('Are you sure you want to reset to default code?')) {
                this.resetToDefault();
            }
        });
    }
    
    /**
     * Update output method
     * Generates the output HTML with embedded CSS and JavaScript
     */
    updateOutput() {
        // Get code from all editors
        const htmlCode = this.htmlEditor.val();
        const cssCode = this.cssEditor.val();
        const jsCode = this.jsEditor.val();
        
        // Create complete HTML document
        const fullHTML = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Code Player Output</title>
    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
    <style>
        ${cssCode}
    </style>
</head>
<body>
    ${htmlCode}
    <script>
        ${jsCode}
    </script>
</body>
</html>`;
        
        // Write to iframe
        const iframeDoc = this.outputFrame[0].contentDocument || 
                         this.outputFrame[0].contentWindow.document;
        
        iframeDoc.open();
        iframeDoc.write(fullHTML);
        iframeDoc.close();
    }
    
    /**
     * Clear all method
     * Clears all editor panels
     */
    clearAll() {
        this.htmlEditor.val('');
        this.cssEditor.val('');
        this.jsEditor.val('');
        this.updateOutput();
        this.showNotification('All code cleared!');
    }
    
    /**
     * Reset to default method
     * Restores default code in all panels
     */
    resetToDefault() {
        this.htmlEditor.val(this.defaultHTML);
        this.cssEditor.val(this.defaultCSS);
        this.jsEditor.val(this.defaultJS);
        this.updateOutput();
        this.showNotification('Reset to default code!');
    }
    
    /**
     * Show notification method
     * Displays a temporary notification message
     * @param {string} message - The notification message to display
     */
    showNotification(message) {
        // Remove existing notification if any
        $('.notification').remove();
        
        // Create notification element
        const notification = $('<div>')
            .addClass('notification')
            .text(message)
            .css({
                position: 'fixed',
                top: '20px',
                right: '20px',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                padding: '15px 25px',
                borderRadius: '8px',
                boxShadow: '0 5px 15px rgba(0,0,0,0.3)',
                zIndex: '10000',
                fontSize: '14px',
                fontWeight: '600',
                animation: 'slideIn 0.3s ease'
            });
        
        // Add animation
        $('<style>').text(`
            @keyframes slideIn {
                from {
                    transform: translateX(400px);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
            @keyframes slideOut {
                from {
                    transform: translateX(0);
                    opacity: 1;
                }
                to {
                    transform: translateX(400px);
                    opacity: 0;
                }
            }
        `).appendTo('head');
        
        // Append to body
        $('body').append(notification);
        
        // Remove after 2 seconds
        setTimeout(() => {
            notification.css('animation', 'slideOut 0.3s ease');
            setTimeout(() => notification.remove(), 300);
        }, 2000);
    }
}

/**
 * Document ready handler
 * Initializes the CodePlayer when DOM is ready
 */
$(document).ready(function() {
    // Create new instance of CodePlayer
    const codePlayer = new CodePlayer();
    
    // Make it globally accessible for debugging
    window.codePlayer = codePlayer;
});

