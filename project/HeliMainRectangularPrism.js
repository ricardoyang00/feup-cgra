import { CGFobject } from '../lib/CGF.js';

export class HeliMainRectangularPrism extends CGFobject {
    constructor(scene, width, depth, height) {
        super(scene);
        this.width = width;
        this.depth = depth;
        this.height = height;
    }

    display() {
        // Front face
        this.scene.pushMatrix();
        this.scene.translate(0, 0, this.depth / 2);
        this.scene.scale(this.width, this.height, 1);
        this.scene.quad.display();
        this.scene.popMatrix();

        // Back face
        this.scene.pushMatrix();
        this.scene.translate(0, 0, -this.depth / 2);
        this.scene.rotate(Math.PI, 0, 1, 0);
        this.scene.scale(this.width, this.height, 1);
        this.scene.quad.display();
        this.scene.popMatrix();

        // Left face
        this.scene.pushMatrix();
        this.scene.translate(-this.width / 2, 0, 0);
        this.scene.rotate(-Math.PI / 2, 0, 1, 0);
        this.scene.scale(this.depth, this.height, 1);
        this.scene.quad.display();
        this.scene.popMatrix();

        // Right face
        this.scene.pushMatrix();
        this.scene.translate(this.width / 2, 0, 0);
        this.scene.rotate(Math.PI / 2, 0, 1, 0);
        this.scene.scale(this.depth, this.height, 1);
        this.scene.quad.display();
        this.scene.popMatrix();

        // Top face
        this.scene.pushMatrix();
        this.scene.translate(0, this.height / 2, 0);
        this.scene.rotate(-Math.PI / 2, 1, 0, 0);
        this.scene.scale(this.width, this.depth, 1);
        this.scene.quad.display();
        this.scene.popMatrix();

        // Bottom face
        this.scene.pushMatrix();
        this.scene.translate(0, -this.height / 2, 0);
        this.scene.rotate(Math.PI / 2, 1, 0, 0);
        this.scene.scale(this.width, this.depth, 1);
        this.scene.quad.display();
        this.scene.popMatrix();
    }
}