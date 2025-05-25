import { CGFobject, CGFappearance, CGFtexture, CGFshader } from '../../lib/CGF.js';
import { MyTriangleDoubleFaced } from '../primitives/MyTriangleDoubleFaced.js';
import { MyCircle } from '../primitives/MyCircle.js';

export class MyFire extends CGFobject {
    constructor(scene) {
        super(scene);
        this.fireTriangles = [];
        this.textures = [
            new CGFtexture(this.scene, "textures/fire/fire1.png"),
            new CGFtexture(this.scene, "textures/fire/fire2.png"),
            new CGFtexture(this.scene, "textures/fire/fire3.png")
        ];
        this.currentTextureIndex = 0;
        this.lastFireAnimTime = 0;
        this.fireAnimInterval = 120;
        
        this.fireShader = new CGFshader(this.scene.gl, "shaders/fire/fireWave.vert", "shaders/fire/fireWave.frag");
        this.fireShader.setUniformsValues({ timeFactor: 0 });        

        // flame particles
        this.particles = [];
        this.maxParticles = 30;
        this.particleCircle = new MyCircle(this.scene, 16, true);
        this.particleColors = [
            [0.1, 0.1, 0.1, 1.0],       // Dark gray (smoke)
            [0.3, 0.3, 0.3, 1.0],       // Medium gray (smoke)
            [0.5, 0.2, 0.0, 1.0],       // Dark red-brown (ember)
            [0.7, 0.3, 0.0, 1.0]        // Dark orange (ember)
        ];
        
        this.lastParticleTime = 0;
        this.particleInterval = 200;

        this.initFire();
    }

    initFire() {
        this.fireTriangles = [];
        const numTriangles = 20;
        const baseRadius = 0.7;
        const height = 3;

        for (let i = 0; i < numTriangles; i++) {
            const angle = (i / numTriangles) * 2 * Math.PI;
            const x = baseRadius * Math.cos(angle);
            const z = baseRadius * Math.sin(angle);
            const y = 0;

            const triangle = new MyTriangleDoubleFaced(this.scene, 2);
            const appearance = new CGFappearance(this.scene);
            appearance.setAmbient(1.0, 0.6, 0.2, 0.8);
            appearance.setDiffuse(1.0, 0.6, 0.2, 0.8);
            appearance.setSpecular(0.2, 0.1, 0.05, 0.8);
            appearance.setShininess(10);

            // random texture in the list
            const textureIndex = Math.floor(Math.random() * this.textures.length);
            appearance.setTexture(this.textures[textureIndex]);
            appearance.setTextureWrap('REPEAT', 'REPEAT');

            // random animation (time)
            const timeOffset = Math.random() * 100;
            const waveFactor = 1.0 + Math.random() * 0.6;

            const scaleX = 0.7 + Math.random() * 0.5;
            const scaleY = 1.0 + Math.random() * 0.8;
            const scaleZ = scaleX;
            const positionX = x + (Math.random() - 0.5) * 0.5;
            const positionY = y;
            const positionZ = z + (Math.random() - 0.5) * 0.5;
            const rotationY = Math.random() * 360;
            const tiltX = Math.random() * 0.6 - 0.3;
            const tiltZ = Math.random() * 0.6 - 0.3;

            this.fireTriangles.push({
                triangle,
                appearance,
                textureIndex,
                timeOffset,
                waveFactor,
                scaleX,
                scaleY,
                scaleZ,
                positionX,
                positionY,
                positionZ,
                rotationY,
                tiltX,
                tiltZ
            });
        }
    }

    // alter the textures (flipbook)
    animateTextures() {
        this.currentTextureIndex = (this.currentTextureIndex + 1) % this.textures.length;
        for (const tri of this.fireTriangles) {
            tri.textureIndex = (tri.textureIndex + 1) % this.textures.length;
            tri.appearance.setTexture(this.textures[tri.textureIndex]);
        }
    }

    // new particles
    createParticle() {
        if (this.particles.length >= this.maxParticles) return;
        
        // position
        const angle = Math.random() * 2 * Math.PI;
        const radius = Math.random() * 0.5;
        const x = radius * Math.cos(angle);
        const z = radius * Math.sin(angle);
        
        // particle starts from a fire triangle pos
        let y = 0.1;
        if (this.fireTriangles.length > 0) {
            const randomTriangle = this.fireTriangles[Math.floor(Math.random() * this.fireTriangles.length)];
            y = Math.random() * randomTriangle.scaleY * 0.5;
        }
        
        // color
        const colorIndex = Math.floor(Math.random() * this.particleColors.length);
        const isSmoke = this.particleColors[colorIndex][0] === this.particleColors[colorIndex][1] && 
                        this.particleColors[colorIndex][1] === this.particleColors[colorIndex][2];
        
        // size 
        // smoke larger
        const baseSize = isSmoke ? 
                    0.05 + Math.random() * 0.1 :  // Smoke particles
                    0.02 + Math.random() * 0.05;  // Ember particles
        
        const scaleX = baseSize * (0.7 + Math.random() * 0.6);
        const scaleY = baseSize * (0.7 + Math.random() * 0.6);
        
        const rotationX = Math.random() * Math.PI * 2;
        const rotationZ = Math.random() * Math.PI * 2;
        const rotationY = Math.random() * Math.PI * 2;
        
        const rotationSpeedX = 0;
        const rotationSpeedY = (Math.random() - 0.5) * 1.5;
        const rotationSpeedZ = 0;
        
        // speed
        // smoke rises slower, embers faster
        const velocityY = isSmoke ? 
                        0.3 + Math.random() * 0.7 :
                        0.6 + Math.random() * 1.0;
        
        // horizontal drift
        // smoke drifts more
        const driftFactor = isSmoke ? 0.3 : 0.15;
        const velocityX = (Math.random() - 0.5) * driftFactor;
        const velocityZ = (Math.random() - 0.5) * driftFactor;
        
        // lifetime
        // smoke lasts longer
        const lifetime = isSmoke ? 
                        1500 + Math.random() * 1500 :
                        700 + Math.random() * 800;
        
        this.particles.push({
            position: [x, y, z],
            velocity: [velocityX, velocityY, velocityZ],
            scale: [scaleX, scaleY, 1],
            color: this.particleColors[colorIndex],
            age: 0,
            lifetime: lifetime,
            isSmoke: isSmoke,
            rotation: [rotationX, rotationY, rotationZ],
            rotationSpeed: [rotationSpeedX, rotationSpeedY, rotationSpeedZ]
        });
    }
    
    updateParticles(dt) {
        if (this.scene.lastT - this.lastParticleTime > this.particleInterval) {
            
            // create multiple particles at once for a denser effect
            const particlesToCreate = Math.min(3, this.maxParticles - this.particles.length);
            for (let i = 0; i < particlesToCreate; i++) {
                this.createParticle();
            }
            this.lastParticleTime = this.scene.lastT;
        }
        
        // update existent
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const particle = this.particles[i];
            
            particle.age += dt * 1000;
            if (particle.age >= particle.lifetime) {
                this.particles.splice(i, 1);
                continue;
            }
            
            particle.position[0] += particle.velocity[0] * dt;
            particle.position[1] += particle.velocity[1] * dt;
            particle.position[2] += particle.velocity[2] * dt;

            if (particle.isSmoke) {
                particle.velocity[1] *= 0.995;
                
                particle.velocity[0] += (Math.random() - 0.5) * 0.08;
                particle.velocity[2] += (Math.random() - 0.5) * 0.08;
                
                particle.scale[0] *= 1.002;
                particle.scale[1] *= 1.002;
            } else {
                particle.velocity[1] *= 0.97;
                particle.velocity[0] += (Math.random() - 0.5) * 0.03;
                particle.velocity[2] += (Math.random() - 0.5) * 0.03;
                particle.scale[0] *= 0.995;
                particle.scale[1] *= 0.995;
            }
            
            particle.rotation[1] += particle.rotationSpeed[1] * dt;
            
            particle.color[3] = 1.0 - (particle.age / particle.lifetime);
        }
    }
    
    displayParticles() {
        for (const particle of this.particles) {

            const appearance = new CGFappearance(this.scene);
            appearance.setAmbient(...particle.color);
            appearance.setDiffuse(...particle.color);
            
            // smoke particle (grayscale) / ember (orange, red)
            const isSmoke = particle.isSmoke;
            
            if (isSmoke) {
                // no emission, less specular
                appearance.setSpecular(0.1, 0.1, 0.1, particle.color[3]);
                appearance.setShininess(1);
                appearance.setEmission(0, 0, 0, 0);
                this.scene.gl.blendFunc(this.scene.gl.SRC_ALPHA, this.scene.gl.ONE_MINUS_SRC_ALPHA);
            } else {
                // ember particles - glowing, more specular
                appearance.setSpecular(0.8, 0.4, 0.0, particle.color[3]);
                appearance.setShininess(10);
                appearance.setEmission(particle.color[0] * 0.8, particle.color[1] * 0.3, 0, particle.color[3]);
                this.scene.gl.blendFunc(this.scene.gl.SRC_ALPHA, this.scene.gl.ONE);
            }
            
            this.scene.pushMatrix();
            this.scene.translate(...particle.position);
            
            // 1. First rotate around Y axis (this is the animation rotation)
            this.scene.rotate(particle.rotation[1], 0, 1, 0);
            
            // 2. Then apply fixed rotations to make circle stand vertically
            this.scene.rotate(particle.rotation[0], 1, 0, 0); // Rotate around X if needed
            this.scene.rotate(particle.rotation[2], 0, 0, 1); // Rotate around Z if needed
            
            this.scene.scale(...particle.scale);

            appearance.apply();
            this.particleCircle.display();
            this.scene.popMatrix();
        }
        
        this.scene.gl.blendFuncSeparate(this.scene.gl.SRC_ALPHA, this.scene.gl.ONE_MINUS_SRC_ALPHA, this.scene.gl.ONE, this.scene.gl.ONE);
    }

    display() {
        this.scene.gl.enable(this.scene.gl.BLEND);
        this.scene.gl.blendFuncSeparate(this.scene.gl.SRC_ALPHA, this.scene.gl.ONE_MINUS_SRC_ALPHA, this.scene.gl.ONE, this.scene.gl.ONE);
        this.scene.gl.depthMask(false);
        
        // fire triangles
        for (const { triangle, appearance, timeOffset, waveFactor, scaleX, scaleY, scaleZ, positionX, positionY, positionZ, rotationY, tiltX, tiltZ } of this.fireTriangles) {
            const individualTimeFactor = this.scene.lastT ? (this.scene.lastT / 100.0 + timeOffset) % 1000 : timeOffset;
            
            this.fireShader.setUniformsValues({ 
                timeFactor: individualTimeFactor,
                waveFactor: waveFactor
            });
            
            this.scene.setActiveShader(this.fireShader);
            
            this.scene.pushMatrix();
            this.scene.translate(positionX, positionY, positionZ);
            this.scene.rotate(rotationY * Math.PI / 180, 0, 1, 0);
            this.scene.rotate(tiltX, 1, 0, 0);
            this.scene.rotate(tiltZ, 0, 0, 1);
            this.scene.scale(scaleX, scaleY, scaleZ);
            appearance.apply();
            triangle.display();
            this.scene.popMatrix();
        }
        
        this.scene.setActiveShader(this.scene.defaultShader);
        
        // particles
        this.displayParticles();
        
        this.scene.gl.depthMask(true);
        this.scene.gl.disable(this.scene.gl.BLEND);
    }

    graduallyRemoveTriangles() {
        const totalDuration = 1200;
        const interval = totalDuration / this.fireTriangles.length;
        const removalInterval = setInterval(() => {
            if (this.fireTriangles.length > 0) {
                const randomIndex = Math.floor(Math.random() * this.fireTriangles.length);
                this.fireTriangles.splice(randomIndex, 1); 
                

                // increase particle emission rate as fire dies out
                this.particleInterval = Math.max(30, this.particleInterval * 0.9);
            } else {

                // gradually reduce particles when fire goes
                setTimeout(() => {
                    this.maxParticles = 0;
                }, 1000);
                clearInterval(removalInterval);
            }
        }, interval);
    }

    update(t) {
        const dt = this.scene.deltaT ? this.scene.deltaT / 1000.0 : 0.016;
        
        // fire animation
        if (t - this.lastFireAnimTime > this.fireAnimInterval) {
            this.animateTextures();
            this.lastFireAnimTime = t;
        }
        
        // particles
        this.updateParticles(dt);
    }
}