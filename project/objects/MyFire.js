import { CGFobject, CGFappearance, CGFtexture, CGFshader } from '../../lib/CGF.js';
import { MyTriangleDoubleFaced } from '../primitives/MyTriangleDoubleFaced.js';

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

    display() {
        this.scene.gl.enable(this.scene.gl.BLEND);
        this.scene.gl.blendFuncSeparate(this.scene.gl.SRC_ALPHA, this.scene.gl.ONE_MINUS_SRC_ALPHA, this.scene.gl.ONE, this.scene.gl.ONE);
        this.scene.gl.depthMask(false);
        
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
        this.scene.gl.depthMask(true);
    }

    graduallyRemoveTriangles() {
        const totalDuration = 6000;
        const interval = totalDuration / this.fireTriangles.length;
        const removalInterval = setInterval(() => {
            if (this.fireTriangles.length > 0) {
                const randomIndex = Math.floor(Math.random() * this.fireTriangles.length);
                this.fireTriangles.splice(randomIndex, 1); 
            } else {
                clearInterval(removalInterval);
            }
        }, interval);
    }

    update(t) {
        if (t - this.lastFireAnimTime > this.fireAnimInterval) {
            this.animateTextures();
            this.lastFireAnimTime = t;
        }
    }
}