import { CGFobject, CGFappearance, CGFtexture } from '../lib/CGF.js';
import { MyTriangleDoubleFaced } from './MyTriangleDoubleFaced.js';

/**
 * MyFire
 * @constructor
 * @param scene - Reference to MyScene object
 */
export class MyFire2 extends CGFobject {
    constructor(scene) {
        super(scene);
        this.fireTriangles = [];
        this.initFire();
    }

    initFire() {
        this.fireTriangles = [];

        //const fireTexture = new CGFtexture(this.scene, "textures/flame-red.jpg");
        const fireTexture = new CGFtexture(this.scene, "textures/fire/fire-transparent-2.png")

        const numTriangles = 20;
        const baseRadius = 0.7; // Reduced radius to make triangles closer
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
            appearance.setTexture(fireTexture);
            appearance.setTextureWrap('REPEAT', 'REPEAT');

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

    display() {
        this.scene.gl.depthMask(false);
        for (const { triangle, appearance, scaleX, scaleY, scaleZ, positionX, positionY, positionZ, rotationY, tiltX, tiltZ } of this.fireTriangles) {
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
    }
}