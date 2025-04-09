import { CGFobject, CGFappearance } from '../lib/CGF.js';
import { MyQuad } from './MyQuad.js';

/**
 * MyUnitCubeQuad
 * @constructor
 * @param scene - Reference to MyScene object
 */
export class MyUnitCubeQuad extends CGFobject {
    constructor(scene, color) {
        super(scene);
        this.scene.quad = new MyQuad(this.scene);

        // Create an appearance for the cube with the given color
        this.cubeAppearance = new CGFappearance(this.scene);
        this.cubeAppearance.setAmbient(...color);
        this.cubeAppearance.setDiffuse(...color);
        this.cubeAppearance.setSpecular(0.1, 0.1, 0.1, 1.0);
        this.cubeAppearance.setShininess(10.0);
    }

    display() {
        this.cubeAppearance.apply();

        // Bottom (-Y)
        this.scene.pushMatrix();
        this.scene.rotate(Math.PI / 2, 1, 0, 0);
        this.scene.translate(0, 0, 0.5);
        this.scene.quad.display();
        this.scene.popMatrix();

        // Top (+Y)
        this.scene.pushMatrix();
        this.scene.rotate(-Math.PI / 2, 1, 0, 0);
        this.scene.translate(0, 0, 0.5);
        this.scene.quad.display();
        this.scene.popMatrix();

        // Front (+Z)
        this.scene.pushMatrix();
        this.scene.translate(0, 0, 0.5);
        this.scene.quad.display();
        this.scene.popMatrix();

        // Back (-Z)
        this.scene.pushMatrix();
        this.scene.rotate(Math.PI, 0, 1, 0);
        this.scene.translate(0, 0, 0.5);
        this.scene.quad.display();
        this.scene.popMatrix();

        // Right (+X)
        this.scene.pushMatrix();
        this.scene.rotate(Math.PI / 2, 0, 1, 0);
        this.scene.translate(0, 0, 0.5);
        this.scene.quad.display();
        this.scene.popMatrix();

        // Left (-X)
        this.scene.pushMatrix();
        this.scene.rotate(-Math.PI / 2, 0, 1, 0);
        this.scene.translate(0, 0, 0.5);
        this.scene.quad.display();
        this.scene.popMatrix();
    }
}