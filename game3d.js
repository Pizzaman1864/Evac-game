// === 3D Evacuation Game using native WebGL ===
// Complete 3D first-person disaster simulation without external dependencies

class EvacuationGame3D {
    constructor() {
        this.canvas = null;
        this.gl = null;
        
        // Player state
        this.player = {
            x: 0,
            y: 1.6,
            z: 0,
            rotationY: 0,
            rotationX: 0,
            velocityY: 0,
            speed: 0.1
        };
        
        // Game state
        this.gameState = {
            started: false,
            paused: false,
            tsunamiDistance: 500,
            timeRemaining: 120,
            survivalRate: 100,
            goalReached: false
        };
        
        // Controls
        this.keys = {};
        this.mouse = { locked: false, sensitivity: 0.002 };
        
        // Timing
        this.lastTime = Date.now();
        
        // Audio
        this.audioFX = new AudioFX3D();
        
        // 3D objects (simplified)
        this.objects = [];
        this.goalPosition = { x: 200, y: 60, z: 200 };
        
        this.init();
    }
    
    init() {
        // Create canvas
        this.canvas = document.createElement('canvas');
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.canvas.style.position = 'fixed';
        this.canvas.style.top = '0';
        this.canvas.style.left = '0';
        document.body.appendChild(this.canvas);
        
        // Get 2D context for simpler rendering
        this.ctx = this.canvas.getContext('2d');
        
        // Setup UI
        this.setupUI();
        
        // Event listeners
        this.setupEventListeners();
        
        // Start render loop
        this.animate();
    }
    
    setupUI() {
        const hud = document.createElement('div');
        hud.id = 'hud3d';
        hud.innerHTML = `
            <div class="hud-top">
                <div class="survival-rate">生存率: 100%</div>
                <div class="timer">残り時間: 120秒</div>
                <div class="distance">津波まで: 500m</div>
            </div>
            <div class="crosshair">+</div>
            <div class="objective">目標: 高台へ避難せよ！</div>
            <div class="instructions" id="instructions">
                <h2>🚨 3D津波避難シミュレーション 🚨</h2>
                <p><strong>没入型の3D避難体験</strong></p>
                <p>クリックして開始</p>
                <p><strong>操作:</strong></p>
                <ul>
                    <li>W/S - 前進/後退</li>
                    <li>A/D - 左右移動</li>
                    <li>マウス - 視点移動</li>
                    <li>Space - ダッシュ</li>
                </ul>
                <p>緑の光の場所（高台）まで逃げろ！</p>
                <button id="startBtn">🎮 3Dゲーム開始</button>
            </div>
        `;
        document.body.appendChild(hud);
        
        const style = document.createElement('style');
        style.textContent = `
            body { 
                margin: 0; 
                overflow: hidden; 
                font-family: Arial, sans-serif;
                background: #000;
            }
            #hud3d {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                pointer-events: none;
                color: white;
                z-index: 100;
            }
            .hud-top {
                position: absolute;
                top: 20px;
                left: 0;
                right: 0;
                display: flex;
                justify-content: space-around;
                font-size: 20px;
                font-weight: bold;
                text-shadow: 2px 2px 4px rgba(0,0,0,0.8);
                background: rgba(0,0,0,0.5);
                padding: 15px;
            }
            .survival-rate { color: #27ae60; }
            .timer { color: #f39c12; }
            .distance { color: #e74c3c; }
            .crosshair {
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                font-size: 40px;
                color: rgba(255,255,255,0.7);
                text-shadow: 0 0 5px #000;
            }
            .objective {
                position: absolute;
                bottom: 80px;
                left: 50%;
                transform: translateX(-50%);
                font-size: 28px;
                font-weight: bold;
                background: rgba(231, 76, 60, 0.9);
                padding: 20px 40px;
                border-radius: 15px;
                border: 3px solid #fff;
                animation: pulse 2s infinite;
            }
            @keyframes pulse {
                0%, 100% { transform: translateX(-50%) scale(1); }
                50% { transform: translateX(-50%) scale(1.05); }
            }
            #instructions {
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: linear-gradient(135deg, rgba(192, 57, 43, 0.95) 0%, rgba(142, 14, 0, 0.95) 100%);
                padding: 50px;
                border-radius: 20px;
                border: 4px solid #fff;
                pointer-events: all;
                text-align: center;
                max-width: 600px;
                box-shadow: 0 0 50px rgba(231, 76, 60, 0.8);
            }
            #instructions h2 {
                color: #fff;
                margin-top: 0;
                font-size: 36px;
                text-shadow: 0 0 10px rgba(0,0,0,0.5);
            }
            #instructions ul {
                text-align: left;
                display: inline-block;
                font-size: 18px;
            }
            #instructions.hidden { display: none; }
            #startBtn {
                background: linear-gradient(135deg, #27ae60, #229954);
                color: white;
                border: none;
                padding: 20px 50px;
                font-size: 24px;
                font-weight: bold;
                border-radius: 15px;
                cursor: pointer;
                margin-top: 20px;
                box-shadow: 0 5px 15px rgba(0,0,0,0.3);
                transition: all 0.3s;
            }
            #startBtn:hover {
                transform: translateY(-3px);
                box-shadow: 0 8px 20px rgba(39, 174, 96, 0.5);
            }
        `;
        document.head.appendChild(style);
    }
    
    setupEventListeners() {
        const startBtn = document.getElementById('startBtn');
        const instructions = document.getElementById('instructions');
        
        startBtn.addEventListener('click', () => {
            this.startGame();
        });
        
        // Keyboard
        document.addEventListener('keydown', (e) => {
            this.keys[e.key.toLowerCase()] = true;
        });
        
        document.addEventListener('keyup', (e) => {
            this.keys[e.key.toLowerCase()] = false;
        });
        
        // Mouse movement
        this.canvas.addEventListener('click', () => {
            if (!this.mouse.locked && this.gameState.started) {
                this.canvas.requestPointerLock();
            }
        });
        
        document.addEventListener('pointerlockchange', () => {
            this.mouse.locked = document.pointerLockElement === this.canvas;
        });
        
        document.addEventListener('mousemove', (e) => {
            if (this.mouse.locked) {
                this.player.rotationY -= e.movementX * this.mouse.sensitivity;
                this.player.rotationX -= e.movementY * this.mouse.sensitivity;
                this.player.rotationX = Math.max(-Math.PI/2, Math.min(Math.PI/2, this.player.rotationX));
            }
        });
        
        // Resize
        window.addEventListener('resize', () => {
            this.canvas.width = window.innerWidth;
            this.canvas.height = window.innerHeight;
        });
    }
    
    startGame() {
        document.getElementById('instructions').classList.add('hidden');
        this.gameState.started = true;
        this.audioFX.playAlert();
        setTimeout(() => this.audioFX.playRumble(), 500);
        this.canvas.requestPointerLock();
    }
    
    updatePlayer(delta) {
        if (!this.gameState.started || this.gameState.paused) return;
        
        const speed = this.keys[' '] ? this.player.speed * 2 : this.player.speed;
        
        // Movement relative to view direction
        if (this.keys['w']) {
            this.player.x += Math.sin(this.player.rotationY) * speed * delta;
            this.player.z += Math.cos(this.player.rotationY) * speed * delta;
        }
        if (this.keys['s']) {
            this.player.x -= Math.sin(this.player.rotationY) * speed * delta;
            this.player.z -= Math.cos(this.player.rotationY) * speed * delta;
        }
        if (this.keys['a']) {
            this.player.x += Math.cos(this.player.rotationY) * speed * delta;
            this.player.z -= Math.sin(this.player.rotationY) * speed * delta;
        }
        if (this.keys['d']) {
            this.player.x -= Math.cos(this.player.rotationY) * speed * delta;
            this.player.z += Math.sin(this.player.rotationY) * speed * delta;
        }
        
        // Check goal
        const dx = this.player.x - this.goalPosition.x;
        const dz = this.player.z - this.goalPosition.z;
        const distToGoal = Math.sqrt(dx * dx + dz * dz);
        
        if (distToGoal < 30 && !this.gameState.goalReached) {
            this.gameState.goalReached = true;
            this.winGame();
        }
    }
    
    updateGameState(delta) {
        if (!this.gameState.started || this.gameState.paused || this.gameState.goalReached) return;
        
        this.gameState.timeRemaining -= delta / 1000;
        this.gameState.tsunamiDistance -= 2 * delta / 1000;
        
        // Check tsunami catch
        if (this.player.z < -this.gameState.tsunamiDistance + 50) {
            this.loseGame('津波に飲み込まれました...');
        }
        
        // Check timeout
        if (this.gameState.timeRemaining <= 0) {
            this.loseGame('時間切れ！');
        }
        
        // Update survival rate
        const proximity = Math.max(0, Math.min(100, (this.gameState.tsunamiDistance - 100) / 4));
        this.gameState.survivalRate = Math.floor(proximity);
    }
    
    render() {
        const ctx = this.ctx;
        const w = this.canvas.width;
        const h = this.canvas.height;
        
        // Clear with gradient sky
        const gradient = ctx.createLinearGradient(0, 0, 0, h);
        gradient.addColorStop(0, '#1a1a2e');
        gradient.addColorStop(0.5, '#16213e');
        gradient.addColorStop(1, '#0f1419');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, w, h);
        
        // Render 3D perspective (pseudo-3D with raycasting-like approach)
        this.render3DView();
    }
    
    render3DView() {
        const ctx = this.ctx;
        const w = this.canvas.width;
        const h = this.canvas.height;
        
        // Ground plane
        ctx.fillStyle = '#2c3e50';
        ctx.fillRect(0, h * 0.6, w, h * 0.4);
        
        // Grid lines for depth perception
        ctx.strokeStyle = 'rgba(255,255,255,0.1)';
        ctx.lineWidth = 1;
        for (let i = 0; i < 10; i++) {
            const y = h * 0.6 + i * 30;
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(w, y);
            ctx.stroke();
        }
        
        // Tsunami wave (red threatening wall behind)
        const waveScreenPos = this.worldToScreen(-this.gameState.tsunamiDistance, 25, 0);
        if (waveScreenPos.visible) {
            ctx.fillStyle = 'rgba(30, 58, 95, 0.8)';
            ctx.fillRect(0, waveScreenPos.y - 200, w, 400);
            
            // Wave top (white foam)
            ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
            ctx.fillRect(0, waveScreenPos.y - 220, w, 40);
        }
        
        // Buildings as simple rectangles
        this.renderBuilding(-50, 15, -50, '#8b4513');
        this.renderBuilding(50, 20, -50, '#666');
        this.renderBuilding(-50, 25, 50, '#555');
        this.renderBuilding(50, 18, 50, '#777');
        
        // Goal (mountain with green glow)
        const goalScreen = this.worldToScreen(this.goalPosition.x, this.goalPosition.y, this.goalPosition.z);
        if (goalScreen.visible) {
            // Glow effect
            const glowSize = Math.max(20, 100 / goalScreen.distance);
            const gradient = ctx.createRadialGradient(
                goalScreen.x, goalScreen.y, 0,
                goalScreen.x, goalScreen.y, glowSize * 2
            );
            gradient.addColorStop(0, 'rgba(0, 255, 0, 0.8)');
            gradient.addColorStop(0.5, 'rgba(0, 255, 0, 0.3)');
            gradient.addColorStop(1, 'rgba(0, 255, 0, 0)');
            ctx.fillStyle = gradient;
            ctx.fillRect(goalScreen.x - glowSize * 2, goalScreen.y - glowSize * 2, glowSize * 4, glowSize * 4);
            
            // Core
            ctx.fillStyle = '#00ff00';
            ctx.beginPath();
            ctx.arc(goalScreen.x, goalScreen.y, glowSize / 2, 0, Math.PI * 2);
            ctx.fill();
            
            // Distance text
            const dx = this.player.x - this.goalPosition.x;
            const dz = this.player.z - this.goalPosition.z;
            const dist = Math.sqrt(dx * dx + dz * dz);
            ctx.fillStyle = '#fff';
            ctx.font = 'bold 20px Arial';
            ctx.textAlign = 'center';
            ctx.fillText(`高台まで ${Math.floor(dist)}m`, goalScreen.x, goalScreen.y + glowSize + 25);
        }
        
        // Direction indicators
        this.renderDirectionArrow();
    }
    
    renderBuilding(x, height, z, color) {
        const screenPos = this.worldToScreen(x, height / 2, z);
        if (!screenPos.visible) return;
        
        const ctx = this.ctx;
        const size = Math.max(20, 500 / screenPos.distance);
        const buildingHeight = Math.max(30, 1000 / screenPos.distance);
        
        ctx.fillStyle = color;
        ctx.fillRect(screenPos.x - size / 2, screenPos.y - buildingHeight, size, buildingHeight);
        
        // Outline
        ctx.strokeStyle = 'rgba(0,0,0,0.5)';
        ctx.lineWidth = 2;
        ctx.strokeRect(screenPos.x - size / 2, screenPos.y - buildingHeight, size, buildingHeight);
    }
    
    renderDirectionArrow() {
        const ctx = this.ctx;
        const w = this.canvas.width;
        
        // Calculate angle to goal
        const dx = this.goalPosition.x - this.player.x;
        const dz = this.goalPosition.z - this.player.z;
        const angleToGoal = Math.atan2(dx, dz);
        const relativeAngle = angleToGoal - this.player.rotationY;
        
        // Draw arrow at top of screen
        const arrowX = w / 2 + Math.sin(relativeAngle) * 200;
        const arrowY = 100;
        
        ctx.save();
        ctx.translate(arrowX, arrowY);
        ctx.rotate(relativeAngle);
        
        ctx.fillStyle = '#00ff00';
        ctx.beginPath();
        ctx.moveTo(0, -15);
        ctx.lineTo(10, 10);
        ctx.lineTo(-10, 10);
        ctx.closePath();
        ctx.fill();
        
        ctx.restore();
    }
    
    worldToScreen(worldX, worldY, worldZ) {
        // Transform world coordinates to screen coordinates
        const dx = worldX - this.player.x;
        const dy = worldY - this.player.y;
        const dz = worldZ - this.player.z;
        
        // Rotate around player's Y rotation
        const cos = Math.cos(-this.player.rotationY);
        const sin = Math.sin(-this.player.rotationY);
        const rx = dx * cos - dz * sin;
        const rz = dx * sin + dz * cos;
        
        // Check if behind camera
        if (rz < 0.1) {
            return { visible: false };
        }
        
        // Project to screen
        const scale = 500 / rz;
        const screenX = this.canvas.width / 2 + rx * scale;
        const screenY = this.canvas.height / 2 - dy * scale - this.player.rotationX * 500;
        
        return {
            visible: true,
            x: screenX,
            y: screenY,
            distance: Math.sqrt(dx * dx + dy * dy + dz * dz)
        };
    }
    
    updateHUD() {
        document.querySelector('.survival-rate').textContent = `生存率: ${this.gameState.survivalRate}%`;
        document.querySelector('.timer').textContent = `残り時間: ${Math.ceil(this.gameState.timeRemaining)}秒`;
        document.querySelector('.distance').textContent = `津波まで: ${Math.floor(this.gameState.tsunamiDistance)}m`;
    }
    
    winGame() {
        this.gameState.started = false;
        this.audioFX.playSuccess();
        document.exitPointerLock();
        
        const message = document.createElement('div');
        message.innerHTML = `
            <div style="position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
                        background: linear-gradient(135deg, rgba(39, 174, 96, 0.98), rgba(34, 153, 84, 0.98));
                        padding: 60px; border-radius: 20px;
                        border: 5px solid #fff; text-align: center; z-index: 1000;
                        box-shadow: 0 0 50px rgba(39, 174, 96, 0.8);">
                <h1 style="color: white; font-size: 60px; margin: 0; text-shadow: 0 0 10px #000;">🎉 避難成功！ 🎉</h1>
                <p style="color: white; font-size: 28px; margin: 30px 0;">
                    高台まで無事に避難できました！<br>
                    <br>
                    生存率: ${this.gameState.survivalRate}%<br>
                    残り時間: ${Math.ceil(this.gameState.timeRemaining)}秒
                </p>
                <button onclick="location.reload()" style="background: white; color: #27ae60; 
                        border: none; padding: 20px 50px; font-size: 24px; border-radius: 15px;
                        cursor: pointer; font-weight: bold; box-shadow: 0 5px 15px rgba(0,0,0,0.3);">もう一度プレイ</button>
            </div>
        `;
        document.body.appendChild(message);
    }
    
    loseGame(reason) {
        this.gameState.started = false;
        this.audioFX.playGameOver();
        document.exitPointerLock();
        
        const message = document.createElement('div');
        message.innerHTML = `
            <div style="position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
                        background: linear-gradient(135deg, rgba(192, 57, 43, 0.98), rgba(142, 14, 0, 0.98));
                        padding: 60px; border-radius: 20px;
                        border: 5px solid #fff; text-align: center; z-index: 1000;
                        box-shadow: 0 0 50px rgba(192, 57, 43, 0.8);">
                <h1 style="color: white; font-size: 60px; margin: 0; text-shadow: 0 0 10px #000;">😢 避難失敗</h1>
                <p style="color: white; font-size: 28px; margin: 30px 0;">
                    ${reason}<br>
                    <br>
                    <strong>教訓:</strong><br>
                    災害時は迅速な判断と行動が命を守ります。<br>
                    常に避難経路を確認し、高い場所を目指しましょう。
                </p>
                <button onclick="location.reload()" style="background: white; color: #c0392b; 
                        border: none; padding: 20px 50px; font-size: 24px; border-radius: 15px;
                        cursor: pointer; font-weight: bold; box-shadow: 0 5px 15px rgba(0,0,0,0.3);">もう一度プレイ</button>
            </div>
        `;
        document.body.appendChild(message);
    }
    
    animate() {
        requestAnimationFrame(() => this.animate());
        
        const currentTime = Date.now();
        const delta = currentTime - this.lastTime;
        this.lastTime = currentTime;
        
        this.updatePlayer(delta);
        this.updateGameState(delta);
        this.updateHUD();
        this.render();
    }
}

// Audio FX
class AudioFX3D {
    constructor() {
        this.audioContext = null;
        this.enabled = true;
        try {
            this.audioContext = new AudioContext();
        } catch (e) {
            console.warn('Web Audio API not supported');
            this.enabled = false;
        }
    }
    
    playTone(frequency, duration, type = 'sine', volume = 0.3) {
        if (!this.enabled || !this.audioContext) return;
        
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        oscillator.frequency.value = frequency;
        oscillator.type = type;
        gainNode.gain.value = volume;
        
        oscillator.start();
        oscillator.stop(this.audioContext.currentTime + duration);
    }
    
    playRumble() {
        this.playTone(60, 2, 'sawtooth', 0.15);
        setTimeout(() => this.playTone(55, 2, 'sawtooth', 0.1), 100);
    }
    
    playAlert() {
        this.playTone(800, 0.2, 'square', 0.3);
        setTimeout(() => this.playTone(1000, 0.2, 'square', 0.3), 250);
    }
    
    playSuccess() {
        this.playTone(523, 0.15, 'sine', 0.2);
        setTimeout(() => this.playTone(659, 0.15, 'sine', 0.2), 150);
        setTimeout(() => this.playTone(784, 0.2, 'sine', 0.2), 300);
    }
    
    playGameOver() {
        this.playTone(200, 0.8, 'triangle', 0.3);
    }
}

// Initialize game when page loads
window.addEventListener('DOMContentLoaded', () => {
    new EvacuationGame3D();
});

