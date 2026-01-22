class WaveAnimation {
    constructor() {
        this.canvas = null;
        this.ctx = null;
        this.waves = [];
        this.particles = [];
        this.animationId = null;
        this.time = 0;
        this.mouseX = 0;
        this.mouseY = 0;
        this.isInitialized = false;
        
        this.init();
    }

    init() {
        this.createCanvas();
        this.setupWaves();
        this.bindEvents();
        this.animate();
        this.isInitialized = true;
    }

    createCanvas() {
        // Remove existing canvas if any
        const existingCanvas = document.getElementById('wave-canvas');
        if (existingCanvas) {
            existingCanvas.remove();
        }

        this.canvas = document.createElement('canvas');
        this.canvas.id = 'wave-canvas';
        this.canvas.style.position = 'fixed';
        this.canvas.style.top = '0';
        this.canvas.style.left = '0';
        this.canvas.style.width = '100%';
        this.canvas.style.height = '100%';
        this.canvas.style.zIndex = '-1';
        this.canvas.style.pointerEvents = 'none';
        
        document.body.appendChild(this.canvas);
        this.ctx = this.canvas.getContext('2d');
        
        this.resize();
    }

    setupWaves() {
        this.waves = [
            {
                amplitude: 60,
                frequency: 0.008,
                speed: 0.014,
                offset: 0,
                color: 'rgba(99, 102, 241, 0.15)',
                y: 0.3
            },
            {
                amplitude: 80,
                frequency: 0.012,
                speed: -0.0105,
                offset: Math.PI / 3,
                color: 'rgba(6, 182, 212, 0.12)',
                y: 0.5
            },
            {
                amplitude: 45,
                frequency: 0.015,
                speed: 0.0175,
                offset: Math.PI / 2,
                color: 'rgba(245, 158, 11, 0.1)',
                y: 0.7
            },
            {
                amplitude: 70,
                frequency: 0.006,
                speed: -0.007,
                offset: Math.PI,
                color: 'rgba(139, 92, 246, 0.08)',
                y: 0.2
            }
        ];
    }

    setupGeometricLines() {
        this.geometricLines = [];
        const lineCount = 8;
        
        for (let i = 0; i < lineCount; i++) {
            this.geometricLines.push({
                x1: Math.random() * window.innerWidth,
                y1: Math.random() * window.innerHeight,
                x2: Math.random() * window.innerWidth,
                y2: Math.random() * window.innerHeight,
                length: Math.random() * 200 + 100,
                angle: Math.random() * Math.PI * 2,
                speed: (Math.random() - 0.5) * 0.3,
                opacity: 0,
                maxOpacity: Math.random() * 0.3 + 0.1,
                fadeDirection: 1,
                color: `rgba(99, 102, 241, 0.2)`,
                life: Math.random() * 300 + 200,
                currentLife: 0
            });
        }
    }

    bindEvents() {
        window.addEventListener('resize', () => this.resize());
        window.addEventListener('mousemove', (e) => {
            this.mouseX = e.clientX;
            this.mouseY = e.clientY;
        });
    }

    resize() {
        const dpr = window.devicePixelRatio || 1;
        this.canvas.width = window.innerWidth * dpr;
        this.canvas.height = window.innerHeight * dpr;
        this.ctx.scale(dpr, dpr);
        this.canvas.style.width = window.innerWidth + 'px';
        this.canvas.style.height = window.innerHeight + 'px';
    }

    drawWave(wave) {
        const width = window.innerWidth;
        const height = window.innerHeight;
        const baseY = height * wave.y;
        
        this.ctx.beginPath();
        this.ctx.moveTo(0, height);
        
        // Create smooth wave path
        for (let x = 0; x <= width; x += 2) {
            const waveHeight = Math.sin(x * wave.frequency + this.time * wave.speed + wave.offset) * wave.amplitude;
            const mouseInfluence = this.calculateMouseInfluence(x, baseY + waveHeight);
            const y = baseY + waveHeight + mouseInfluence;
            this.ctx.lineTo(x, y);
        }
        
        this.ctx.lineTo(width, height);
        this.ctx.closePath();
        
        // Create gradient
        const gradient = this.ctx.createLinearGradient(0, baseY - wave.amplitude, 0, height);
        gradient.addColorStop(0, wave.color);
        gradient.addColorStop(1, 'rgba(255, 255, 255, 0.02)');
        
        this.ctx.fillStyle = gradient;
        this.ctx.fill();
    }

    calculateMouseInfluence(x, y) {
        const distance = Math.sqrt(Math.pow(x - this.mouseX, 2) + Math.pow(y - this.mouseY, 2));
        const maxDistance = 200;
        const influence = Math.max(0, 1 - distance / maxDistance);
        return influence * 20 * Math.sin(this.time * 0.05);
    }

    drawGeometricLines() {
        this.geometricLines.forEach((line, index) => {
            // Update line life and opacity
            line.currentLife++;
            
            // Fade in and out effect
            if (line.currentLife < line.life * 0.3) {
                // Fade in
                line.opacity = (line.currentLife / (line.life * 0.3)) * line.maxOpacity;
            } else if (line.currentLife > line.life * 0.7) {
                // Fade out
                const fadeProgress = (line.currentLife - line.life * 0.7) / (line.life * 0.3);
                line.opacity = line.maxOpacity * (1 - fadeProgress);
            } else {
                // Full opacity
                line.opacity = line.maxOpacity;
            }
            
            // Slowly move the line
            line.angle += line.speed * 0.01;
            line.x1 += Math.cos(line.angle) * 0.2;
            line.y1 += Math.sin(line.angle) * 0.2;
            line.x2 = line.x1 + Math.cos(line.angle) * line.length;
            line.y2 = line.y1 + Math.sin(line.angle) * line.length;
            
            // Reset line if life is over
            if (line.currentLife >= line.life) {
                line.x1 = Math.random() * window.innerWidth;
                line.y1 = Math.random() * window.innerHeight;
                line.angle = Math.random() * Math.PI * 2;
                line.x2 = line.x1 + Math.cos(line.angle) * line.length;
                line.y2 = line.y1 + Math.sin(line.angle) * line.length;
                line.currentLife = 0;
                line.opacity = 0;
                line.life = Math.random() * 300 + 200;
            }
            
            // Draw line only if opacity > 0
            if (line.opacity > 0) {
                this.ctx.beginPath();
                this.ctx.moveTo(line.x1, line.y1);
                this.ctx.lineTo(line.x2, line.y2);
                this.ctx.strokeStyle = line.color.replace('0.2)', `${line.opacity})`);
                this.ctx.lineWidth = 1;
                this.ctx.stroke();
            }
        });
    }

    drawMorphingShapes() {
        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;
        
        // Large morphing blob
        this.ctx.beginPath();
        const points = 8;
        const baseRadius = 150;
        
        for (let i = 0; i <= points; i++) {
            const angle = (i / points) * Math.PI * 2;
            const radiusVariation = Math.sin(this.time * 0.03 + i) * 30;
            const radius = baseRadius + radiusVariation;
            const x = centerX + Math.cos(angle) * radius;
            const y = centerY + Math.sin(angle) * radius;
            
            if (i === 0) {
                this.ctx.moveTo(x, y);
            } else {
                this.ctx.lineTo(x, y);
            }
        }
        
        this.ctx.closePath();
        
        const gradient = this.ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, baseRadius + 30);
        gradient.addColorStop(0, 'rgba(99, 102, 241, 0.08)');
        gradient.addColorStop(0.5, 'rgba(6, 182, 212, 0.05)');
        gradient.addColorStop(1, 'rgba(245, 158, 11, 0.02)');
        
        this.ctx.fillStyle = gradient;
        this.ctx.fill();
    }

    drawFloatingElements() {
        const elements = [
            { x: 0.1, y: 0.2, size: 40, speed: 0.01 },
            { x: 0.8, y: 0.3, size: 60, speed: -0.015 },
            { x: 0.2, y: 0.7, size: 35, speed: 0.02 },
            { x: 0.9, y: 0.8, size: 50, speed: -0.008 }
        ];
        
        elements.forEach((element, index) => {
            const x = window.innerWidth * element.x + Math.sin(this.time * element.speed + index) * 50;
            const y = window.innerHeight * element.y + Math.cos(this.time * element.speed + index) * 30;
            
            this.ctx.beginPath();
            this.ctx.arc(x, y, element.size, 0, Math.PI * 2);
            
            const gradient = this.ctx.createRadialGradient(x, y, 0, x, y, element.size);
            gradient.addColorStop(0, `rgba(${99 + index * 20}, ${102 + index * 30}, 241, 0.1)`);
            gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
            
            this.ctx.fillStyle = gradient;
            this.ctx.fill();
        });
    }

    animate() {
        this.ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
        
        // Draw background gradient
        const bgGradient = this.ctx.createLinearGradient(0, 0, 0, window.innerHeight);
        bgGradient.addColorStop(0, 'rgba(248, 250, 252, 0.02)');
        bgGradient.addColorStop(1, 'rgba(255, 255, 255, 0.01)');
        this.ctx.fillStyle = bgGradient;
        this.ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);
        
        // Draw all elements
        this.drawMorphingShapes();
        this.drawFloatingElements();
        
        // Draw waves (back to front)
        this.waves.forEach(wave => this.drawWave(wave));
        
        this.time += 1;
        this.animationId = requestAnimationFrame(() => this.animate());
    }

    destroy() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
        if (this.canvas) {
            this.canvas.remove();
        }
        window.removeEventListener('resize', this.resize);
        window.removeEventListener('mousemove', this.mousemove);
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Small delay to ensure everything is loaded
    setTimeout(() => {
        window.waveAnimation = new WaveAnimation();
    }, 100);
});

// Handle page visibility changes for performance
document.addEventListener('visibilitychange', () => {
    if (window.waveAnimation) {
        if (document.hidden) {
            if (window.waveAnimation.animationId) {
                cancelAnimationFrame(window.waveAnimation.animationId);
                window.waveAnimation.animationId = null;
            }
        } else {
            if (!window.waveAnimation.animationId) {
                window.waveAnimation.animate();
            }
        }
    }
});
