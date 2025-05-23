import { CGFobject, CGFappearance } from '../../../lib/CGF.js';
import { MyQuad } from '../../primitives/MyQuad.js';

/**
 * MyModule
 * @constructor
 * @param scene - Reference to MyScene object
 * @param color - Color to tint the texture
 * @param texture - Texture to apply to the cube
 */
export class MyModule extends CGFobject {
    constructor(scene, color, texture = null) {
        super(scene);
        this.scene.quad = new MyQuad(this.scene);

        // Create an appearance for the cube with the given color
        this.cubeAppearance = new CGFappearance(this.scene);

        // Set the texture if provided
        if (texture) {
            this.cubeAppearance.setTexture(texture);
            this.cubeAppearance.setTextureWrap('REPEAT', 'REPEAT');
        }

        this.cubeAppearance.setAmbient(...color);
        this.cubeAppearance.setDiffuse(...color);
        this.cubeAppearance.setSpecular(0.1, 0.1, 0.1, 1.0);
        this.cubeAppearance.setShininess(10.0);
    }

    display(skipRight = false, skipLeft = false) {
        this.cubeAppearance.apply();

        // Front
        this.scene.pushMatrix();
        this.scene.rotate(Math.PI / 2, 1, 0, 0);
        this.scene.translate(0, 0, 0.5);
        this.scene.quad.display();
        this.scene.popMatrix();

        // Back
        this.scene.pushMatrix();
        this.scene.rotate(-Math.PI / 2, 1, 0, 0);
        this.scene.translate(0, 0, 0.5);
        this.scene.quad.display();
        this.scene.popMatrix();

        // Top
        this.scene.pushMatrix();
        this.scene.translate(0, 0, 0.5);
        this.scene.quad.display();
        this.scene.popMatrix();

        // Bottom
        /*this.scene.pushMatrix();
        this.scene.rotate(Math.PI, 0, 1, 0);
        this.scene.translate(0, 0, 0.5);
        this.scene.quad.display();
        this.scene.popMatrix();*/

        // Right
        if (!skipRight) {
            this.scene.pushMatrix();
            this.scene.rotate(Math.PI / 2, 0, 1, 0);
            this.scene.translate(0, 0, 0.5);
            this.scene.rotate(-Math.PI / 2, 0, 0, 1); // Rotate texture to align bricks horizontally
            this.scene.quad.display();
            this.scene.popMatrix();
        }

        // Left
        if (!skipLeft) {
            this.scene.pushMatrix();
            this.scene.rotate(-Math.PI / 2, 0, 1, 0);
            this.scene.translate(0, 0, 0.5);
            this.scene.rotate(-Math.PI / 2, 0, 0, 1); // Rotate texture to align bricks horizontally
            this.scene.quad.display();
            this.scene.popMatrix();
        }
    }
}