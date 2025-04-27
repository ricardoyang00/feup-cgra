import { CGFobject, CGFappearance, CGFtexture } from '../lib/CGF.js';

export class HeliBodyRectangularPrism extends CGFobject {
    constructor(scene, width, depth, height, color = [1, 1, 1, 1], texture = null) {
        super(scene);
        this.width = width;
        this.depth = depth;
        this.height = height;

        this.appearance = new CGFappearance(this.scene);
        this.appearance.setAmbient(...color);
        this.appearance.setDiffuse(...color);
        this.appearance.setSpecular(0.2, 0.2, 0.2, 1);
        this.appearance.setShininess(10);

        if (texture) {
            this.appearance.setTexture(texture);
            this.appearance.setTextureWrap('REPEAT', 'REPEAT');
        }
    }

    display() {
        if (this.texture) {
            this.texture.bind();
        }

        this.appearance.apply();

        // Front face
        this.scene.pushMatrix();
        this.scene.translate(this.width / 2, this.height / 2, this.depth);
        this.scene.scale(this.width, this.height, 1);
        this.scene.quad.display();
        this.scene.popMatrix();

        // Back face
        this.scene.pushMatrix();
        this.scene.translate(this.width / 2, this.height / 2, 0);
        this.scene.rotate(Math.PI, 0, 1, 0);
        this.scene.scale(this.width, this.height, 1);
        this.scene.quad.display();
        this.scene.popMatrix();

        // Left face
        this.scene.pushMatrix();
        this.scene.translate(0, this.height / 2, this.depth / 2);
        this.scene.rotate(-Math.PI / 2, 0, 1, 0);
        this.scene.scale(this.depth, this.height, 1);
        this.scene.quad.display();
        this.scene.popMatrix();

        // Right face
        this.scene.pushMatrix();
        this.scene.translate(this.width, this.height / 2, this.depth / 2);
        this.scene.rotate(Math.PI / 2, 0, 1, 0);
        this.scene.scale(this.depth, this.height, 1);
        this.scene.quad.display();
        this.scene.popMatrix();

        // Top face
        this.scene.pushMatrix();
        this.scene.translate(this.width / 2, this.height, this.depth / 2);
        this.scene.rotate(-Math.PI / 2, 1, 0, 0);
        this.scene.scale(this.width, this.depth, 1);
        this.scene.quad.display();
        this.scene.popMatrix();

        // Bottom face
        this.scene.pushMatrix();
        this.scene.translate(this.width / 2, 0, this.depth / 2);
        this.scene.rotate(Math.PI / 2, 1, 0, 0);
        this.scene.scale(this.width, this.depth, 1);
        this.scene.quad.display();
        this.scene.popMatrix();
    }
}