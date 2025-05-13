import { CGFobject, CGFappearance, CGFtexture } from '../lib/CGF.js';
import { MyFirePyramid } from "./MyFirePyramid.js";

/**
 * MyFire
 * @constructor
 * @param scene - Reference to MyScene object
 */
export class MyFire extends CGFobject {
    constructor(scene) {
        super(scene);
        this.firePyramids = []; // Array to hold the pyramids
        this.initFire();
    }

    initFire() {

        let fireTextureRed = new CGFtexture(this.scene, "");
        let fireTextureOrange = new CGFtexture(this.scene, "");
        let fireTextureYellow = new CGFtexture(this.scene, "");

        let a = 0;
        if (a) {
            fireTextureRed = new CGFtexture(this.scene, "textures/fire/flame-red.jpg");
            fireTextureOrange = new CGFtexture(this.scene, "textures/fire/flame-orange.png");
            fireTextureYellow = new CGFtexture(this.scene, "textures/fire/flame-yellow.png");
        } 


        // --- Middle Pyramid (Largest, Yellow/White Core) ---
        const middlePyramid = new MyFirePyramid(this.scene);
        const middleAppearance = new CGFappearance(this.scene);
        middleAppearance.setAmbient(1.0, 1.0, 0.8, 1.0); // Very bright yellow/white core
        middleAppearance.setDiffuse(1.0, 1.0, 0.8, 1.0);
        middleAppearance.setSpecular(0.3, 0.3, 0.2, 1.0);
        middleAppearance.setShininess(30.0); // Make it more intense
        middleAppearance.setTexture(fireTextureYellow);
        middleAppearance.setTextureWrap('REPEAT', 'REPEAT');

        this.firePyramids.push({
            pyramid: middlePyramid,
            appearance: middleAppearance,
            scale: 1.2, // Larger middle
            yScale: 2.5, // Taller middle
            x: 0,
            y: 0,
            z: 0,
            rotationY: 0,
            tiltX: 0,
            tiltZ: 0
        });

        // --- Orange/Red Pyramids (Main Fire) ---
        const orangePyramidsCount = 12; // More orange flames
        const orangeRadius = 1.5;
        for (let i = 0; i < orangePyramidsCount; i++) {
            const angle = (i / orangePyramidsCount) * 2 * Math.PI;
            const x = orangeRadius * Math.cos(angle);
            const z = orangeRadius * Math.sin(angle);
            const y = 0;

            const orangePyramid = new MyFirePyramid(this.scene, );
            const orangeAppearance = new CGFappearance(this.scene);
            orangeAppearance.setAmbient(1.0, 0.6, 0.2, 1.0); // Bright orange-red
            orangeAppearance.setDiffuse(1.0, 0.6, 0.2, 1.0);
            orangeAppearance.setSpecular(0.2, 0.1, 0.05, 1.0);
            orangeAppearance.setShininess(20.0);
            orangeAppearance.setTexture(fireTextureOrange);
            orangeAppearance.setTextureWrap('REPEAT', 'REPEAT');

            const scale = 0.8 + Math.random() * 0.3; // More variation in size
            const yScale = 2.0 + Math.random() * 0.5; // More variation in height
            const tiltX = Math.random() * 0.4 - 0.2; // Increased tilt
            const tiltZ = Math.random() * 0.4 - 0.2;
            this.firePyramids.push({
                pyramid: orangePyramid,
                appearance: orangeAppearance,
                scale: scale,
                yScale: yScale,
                x: x,
                y: y,
                z: z,
                rotationY: Math.random() * 360,
                tiltX: tiltX,
                tiltZ: tiltZ
            });
        }

        // --- Red/Darker Orange Pyramids (Outer Flames) ---
        const redPyramidsCount = 16; // Even more red flames
        const redRadius = 2.5; // Wider spread
        for (let i = 0; i < redPyramidsCount; i++) {
            const angle = (i / redPyramidsCount) * 2 * Math.PI;
            const x = redRadius * Math.cos(angle);
            const z = redRadius * Math.sin(angle);
            const y = 0;

            const redPyramid = new MyFirePyramid(this.scene, );
            const redAppearance = new CGFappearance(this.scene);
            redAppearance.setAmbient(0.9, 0.3, 0.1, 1.0); // Deep red-orange
            redAppearance.setDiffuse(0.9, 0.3, 0.1, 1.0);
            redAppearance.setSpecular(0.1, 0.05, 0.02, 1.0);
            redAppearance.setShininess(15.0);
            redAppearance.setTexture(fireTextureRed);
            redAppearance.setTextureWrap('REPEAT', 'REPEAT');

            const scale = 0.6 + Math.random() * 0.2; // More variation
            const yScale = 1.5 + Math.random() * 0.4;
            const tiltX = Math.random() * 0.5 - 0.25; // Increased tilt
            const tiltZ = Math.random() * 0.5 - 0.25;
            this.firePyramids.push({
                pyramid: redPyramid,
                appearance: redAppearance,
                scale: scale,
                yScale: yScale,
                x: x,
                y: y,
                z: z,
                rotationY: Math.random() * 360,
                tiltX: tiltX,
                tiltZ: tiltZ
            });
        }
    }

    display() {
        for (const { pyramid, appearance, scale, yScale, x, y, z, rotationY, tiltX, tiltZ } of this.firePyramids) {
            this.scene.pushMatrix();
            this.scene.translate(x, y, z);
            this.scene.rotate(rotationY * Math.PI / 180, 0, 1, 0);
            this.scene.rotate(tiltX, 1, 0, 0);
            this.scene.rotate(tiltZ, 0, 0, 1);
            this.scene.scale(scale, yScale, scale);
            appearance.apply();
            pyramid.display();
            this.scene.popMatrix();
        }
    }
}
