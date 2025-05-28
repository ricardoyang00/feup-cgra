import { CGFobject, CGFappearance, CGFtexture } from '../../../lib/CGF.js';
import { MyQuad } from '../../primitives/MyQuad.js';

export class HeliBodyCore extends CGFobject {
    constructor(scene, width, depth, height, color = [0.5, 0.5, 0.5, 1], texture = null) {
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

        this.sticker1 = new MyQuad(scene);
        this.sticker1Texture = new CGFtexture(scene, "textures/helicopter/sticker_1.png");
    }

    display() {
        if (this.texture) {
            this.texture.bind();
        }
        
        this.appearance.apply();

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

        // Sticker
        this.scene.gl.enable(this.scene.gl.BLEND);
        this.scene.gl.blendFuncSeparate(this.scene.gl.SRC_ALPHA, this.scene.gl.ONE_MINUS_SRC_ALPHA, this.scene.gl.ONE, this.scene.gl.ONE);
        this.scene.gl.depthMask(false);

        this.scene.pushMatrix();
        this.scene.scale(0.5, 0.5, 0.5);
        this.scene.rotate(Math.PI / 2, 0, 1, 0);
        this.scene.translate(-0.75, 0, 2.01);
        this.scene.scale(4, 2, 2);
        this.sticker1Texture.bind();
        this.sticker1.display();
        this.sticker1Texture.unbind();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.scale(0.5, 0.5, 0.5);
        this.scene.rotate(-Math.PI / 2, 0, 1, 0);
        this.scene.translate(0.75, 0, 2.01);
        this.scene.scale(4, 2, 2);
        this.sticker1Texture.bind();
        this.sticker1.display();
        this.sticker1Texture.unbind();
        this.scene.popMatrix();

        this.scene.gl.depthMask(true);
        this.scene.gl.disable(this.scene.gl.BLEND);
    }
}