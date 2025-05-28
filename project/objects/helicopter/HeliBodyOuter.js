import { CGFobject, CGFtexture } from '../../../lib/CGF.js';
import { HeliBodyRectangularPrism } from './HeliBodyRectangularPrism.js';
import { HeliBodyTriangularPrism } from './HeliBodyTriangularPrism.js';
import { HeliPropellerSupport } from './HeliPropellerSupport.js';
import { MyQuad } from '../../primitives/MyQuad.js';
import { MyCircle } from '../../primitives/MyCircle.js';

export class HeliBodyOuter extends CGFobject {
    constructor(scene) {
        super(scene);

        this.redMetalTexture = new CGFtexture(scene, 'textures/helicopter/red_metal.jpg');
        this.whiteMaterialTexture = new CGFtexture(scene, 'textures/helicopter/white_material.jpg');

        this.cockpit = new HeliBodyTriangularPrism(scene, 2, 1, 1, [0.5, 0.5, 0.5, 1], this.redMetalTexture);
        this.backOfCockpit = new HeliBodyRectangularPrism(scene, 2, 3.25, 1, [0.5, 0.5, 0.5, 1], this.redMetalTexture);
        this.backOfMainBody = new HeliBodyTriangularPrism(scene, 2, 1.25, 1.20, [0.5, 0.5, 0.5, 1], this.redMetalTexture);

        this.headTop = new HeliBodyTriangularPrism(scene, 2, 0.75, 0.2, [0.5, 0.5, 0.5, 1], this.whiteMaterialTexture);
        this.headMiddle = new HeliBodyRectangularPrism(scene, 2, 0.75, 0.5, [0.5, 0.5, 0.5, 1], this.whiteMaterialTexture);
        this.headBottom = new HeliBodyTriangularPrism(scene, 2, 0.75, 0.5, [0.5, 0.5, 0.5, 1], this.whiteMaterialTexture);

        this.support = new HeliPropellerSupport(scene);

        this.glassTexture = new CGFtexture(scene, 'textures/helicopter/glass.jpg');
        this.window = new MyQuad(scene);

        this.heliDetail = new MyQuad(scene);

        this.sticker = new MyCircle(scene, 32);
        this.sticker2Texture = new CGFtexture(scene, "textures/helicopter/sticker_2.png");
    }

    display() {
        // Display the cockpit
        this.scene.pushMatrix();
        this.scene.translate(-1, 0.6, -0.5);
        this.cockpit.display();
        this.scene.popMatrix();
        
        // Display back of cockpit
        this.scene.pushMatrix();
        this.scene.translate(-1, 0.6, -0.5);
        this.backOfCockpit.display();
        this.scene.popMatrix();

        // Display the upper propeller support
        this.scene.pushMatrix();
        this.support.display();
        this.scene.popMatrix();

        // Display back of main body
        this.scene.pushMatrix();
        this.scene.translate(0, -0.5, 0);
        this.scene.rotate(Math.PI, 1, 0, 0);
        this.scene.translate(-1, -1.10, -1.5);
        this.backOfMainBody.display();
        this.scene.popMatrix();
        
        // Display the front of the helicopter
        this.scene.pushMatrix();
        this.scene.translate(-1, 0.40, -1.5);
        this.headTop.display();
        this.scene.popMatrix();
        
        this.scene.pushMatrix();
        this.scene.translate(-1, -0.1, -2.25);
        this.headMiddle.display();
        this.scene.popMatrix();
        
        this.scene.pushMatrix();
        this.scene.translate(0, -0.5, 0);
        this.scene.rotate(Math.PI, 1, 0, 0);
        this.scene.rotate(Math.PI, 0, 1, 0);
        this.scene.translate(-1, -0.4, -1.5);
        this.headBottom.display();
        this.scene.popMatrix();

        // Display the glass
        this.scene.pushMatrix();
        this.scene.scale(1.5, 1.5, 1.5);
        this.scene.rotate(Math.PI, 1, 0, 0);
        this.scene.rotate(Math.PI / 4, 1, 0, 0);
        this.scene.translate(0, 0, 1);
        this.scene.scale(1, 0.5, 1);
        this.glassTexture.bind();
        this.window.display();
        this.glassTexture.unbind();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.scale(1.5, 1.5, 1.5);
        this.scene.rotate(Math.PI / 2, 0, 1, 0);
        this.scene.translate(-0.35, 0.65, 0.67);
        this.scene.scale(1, 0.5, 1);
        this.glassTexture.bind();
        this.window.display();
        this.glassTexture.unbind();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.scale(1.5, 1.5, 1.5);
        this.scene.rotate(-Math.PI / 2, 0, 1, 0);
        this.scene.translate(0.35, 0.65, 0.67);
        this.scene.scale(1, 0.5, 1);
        this.glassTexture.bind();
        this.window.display();
        this.glassTexture.unbind();
        this.scene.popMatrix();

        // Stickers
        this.scene.gl.enable(this.scene.gl.BLEND);
        this.scene.gl.blendFuncSeparate(this.scene.gl.SRC_ALPHA, this.scene.gl.ONE_MINUS_SRC_ALPHA, this.scene.gl.ONE, this.scene.gl.ONE);
        this.scene.gl.depthMask(false);

        this.scene.pushMatrix();
        this.scene.scale(0.5, 0.5, 0.5);
        this.scene.rotate(Math.PI / 2, 0, 1, 0);
        this.scene.translate(-4, 1.8, 2.01);
        this.scene.scale(1.2, 1.2, 1.2);
        this.sticker2Texture.bind();
        this.sticker.display();
        this.sticker2Texture.unbind();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.scale(0.5, 0.5, 0.5);
        this.scene.rotate(-Math.PI / 2, 0, 1, 0);
        this.scene.translate(4, 1.8, 2.01);
        this.scene.scale(1.2, 1.2, 1.2);
        this.sticker2Texture.bind();
        this.sticker.display();
        this.sticker2Texture.unbind();
        this.scene.popMatrix();

        this.scene.gl.depthMask(true);
        this.scene.gl.disable(this.scene.gl.BLEND);
    }
}