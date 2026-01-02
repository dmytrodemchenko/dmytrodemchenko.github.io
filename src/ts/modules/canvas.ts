import { CONFIG, SYNTAX_TOKENS, SyntaxToken } from '../config.ts';

interface MousePosition {
    x: number;
    y: number;
}

export const initCanvasAnimation = (): void => {
    const canvas = document.getElementById('hero-canvas') as HTMLCanvasElement | null;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width: number, height: number;
    let particles: Particle[] = [];
    let mouse: MousePosition = { x: -1000, y: -1000 };
    
    const resize = (): void => {
        const dpr = window.devicePixelRatio || 1;
        width = window.innerWidth;
        height = window.innerHeight;
        canvas.width = width * dpr;
        canvas.height = height * dpr;
        ctx.scale(dpr, dpr);
        initParticles();
    };

    class Particle {
        x: number;
        y: number;
        vx: number;
        vy: number;
        size: number;
        symbol: string;
        color: string;
        opacity: number;
        pulseSpeed: number;
        pulse: number;
        currentOpacity: number = 0;

        constructor() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.vx = (Math.random() - 0.5) * 1.0; 
            this.vy = (Math.random() - 0.5) * 1.0;
            this.size = Math.random() * (CONFIG.HERO_PARTICLES.SIZE_MAX - CONFIG.HERO_PARTICLES.SIZE_MIN) + CONFIG.HERO_PARTICLES.SIZE_MIN;
            
            const item: SyntaxToken = SYNTAX_TOKENS[Math.floor(Math.random() * SYNTAX_TOKENS.length)];
            this.symbol = item.text;
            
            // Syntax coloring
            if (item.type === 'keyword') this.color = CONFIG.COLORS.ACCENT; 
            else if (item.type === 'type') this.color = CONFIG.COLORS.ACCENT_DARK; 
            else this.color = CONFIG.COLORS.WHITE; 

            this.opacity = Math.random() * 0.5 + 0.1;
            this.pulseSpeed = Math.random() * 0.05 + 0.01;
            this.pulse = Math.random() * Math.PI;
        }

        update(): void {
            // Movement
            this.x += this.vx;
            this.y += this.vy;

            // Boundary wrap
            if (this.x < 0) this.x = width;
            if (this.x > width) this.x = 0;
            if (this.y < 0) this.y = height;
            if (this.y > height) this.y = 0;

            // Pulse opacity
            this.pulse += this.pulseSpeed;
            this.currentOpacity = this.opacity + Math.sin(this.pulse) * 0.1;

            // Mouse interaction (Repulsion)
            const dx = mouse.x - this.x;
            const dy = mouse.y - this.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            
            if (dist < CONFIG.HERO_PARTICLES.REPEL_DISTANCE) {
                const angle = Math.atan2(dy, dx);
                const force = (CONFIG.HERO_PARTICLES.REPEL_DISTANCE - dist) / CONFIG.HERO_PARTICLES.REPEL_DISTANCE;
                const moveX = Math.cos(angle) * force * 2;
                const moveY = Math.sin(angle) * force * 2;
                
                this.x -= moveX;
                this.y -= moveY;
                
                // Glow on hover
                this.currentOpacity = 1; 
            }
        }

        draw(ctx: CanvasRenderingContext2D): void {
            ctx.font = `${this.size}px "Courier New", monospace`;
            ctx.fillStyle = this.color;
            ctx.globalAlpha = Math.max(0, Math.min(1, this.currentOpacity)); // Clamp opacity
            ctx.fillText(this.symbol, this.x, this.y);
        }
    }

    const initParticles = (): void => {
        particles = [];
        const count = Math.floor((width * height) / CONFIG.HERO_PARTICLES.COUNT_DIVISOR); 
        for (let i = 0; i < count; i++) {
            particles.push(new Particle());
        }
    };

    const animate = (): void => {
        ctx.clearRect(0, 0, width, height);
        
        particles.forEach((p, index) => {
            p.update();
            p.draw(ctx);

            // Connections
            for (let j = index + 1; j < particles.length; j++) {
                const p2 = particles[j];
                const dx = p.x - p2.x;
                const dy = p.y - p2.y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < CONFIG.HERO_PARTICLES.CONNECTION_DISTANCE) {
                    ctx.beginPath();
                    ctx.moveTo(p.x, p.y - p.size/3); 
                    ctx.lineTo(p2.x, p2.y - p2.size/3);
                    ctx.strokeStyle = CONFIG.COLORS.ACCENT;
                    ctx.globalAlpha = (1 - dist / CONFIG.HERO_PARTICLES.CONNECTION_DISTANCE) * 0.15;
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                }
            }
        });

        requestAnimationFrame(animate);
    };

    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', (e: MouseEvent) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    });

    window.addEventListener('touchmove', (e: TouchEvent) => {
        mouse.x = e.touches[0].clientX;
        mouse.y = e.touches[0].clientY;
    });

    resize();
    animate();
};

export const initContactAnimation = (): void => {
    const canvas = document.getElementById('contact-canvas') as HTMLCanvasElement | null;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width: number, height: number;
    let stars: Star[] = [];

    const resize = (): void => {
        width = canvas.width = canvas.offsetWidth;
        height = canvas.height = canvas.offsetHeight;
        initStars();
    };

    class Star {
        x: number;
        y: number;
        z: number;
        pz: number;

        constructor() {
            this.x = (Math.random() - 0.5) * width;
            this.y = (Math.random() - 0.5) * height;
            this.z = Math.random() * width;
            this.pz = this.z;
        }

        update(): void {
            this.z -= CONFIG.CONTACT_STARS.SPEED_Z_DECAY; 

            if (this.z <= 0) {
                this.x = (Math.random() - 0.5) * width;
                this.y = (Math.random() - 0.5) * height;
                this.z = width;
                this.pz = this.z;
            }
        }

        draw(ctx: CanvasRenderingContext2D): void {
            const sx = (this.x / this.z) * width/2 + width/2;
            const sy = (this.y / this.z) * height/2 + height/2;
            
            const px = (this.x / this.pz) * width/2 + width/2;
            const py = (this.y / this.pz) * height/2 + height/2;

            this.pz = this.z;

            if (this.z < width - CONFIG.CONTACT_STARS.SIZE_CHECK) {
                const opacity = (1 - this.z / width);
                ctx.beginPath();
                ctx.moveTo(px, py);
                ctx.lineTo(sx, sy);
                ctx.lineWidth = opacity * 2;
                ctx.strokeStyle = `rgba(255, 255, 255, ${opacity})`;
                ctx.stroke();
            }
        }
    }

    const initStars = (): void => {
        stars = [];
        for (let i = 0; i < CONFIG.CONTACT_STARS.COUNT; i++) {
            stars.push(new Star());
        }
    };

    const animate = (): void => {
        ctx.fillStyle = CONFIG.COLORS.BG_DARK;
        ctx.fillRect(0, 0, width, height);
        
        const rect = canvas.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
            stars.forEach(star => {
                star.update();
                star.draw(ctx);
            });
        }

        requestAnimationFrame(animate);
    };

    window.addEventListener('resize', resize);
    resize();
    animate();
};
