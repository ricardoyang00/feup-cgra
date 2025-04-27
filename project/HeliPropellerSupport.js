import { CGFobject, CGFtexture } from '../lib/CGF.js';
import { MyCylinder } from './MyCylinder.js';
import { HeliBodyTriangularPrism } from './HeliBodyTriangularPrism.js';

export class HeliPropellerSupport extends CGFobject {
    constructor(scene) { 
        super(scene);
        
        this.redMetalTexture = new CGFtexture(scene, 'textures/red_metal.jpg');

        this.supportBottom = new MyCylinder(scene, 12, 1, [1, 1, 1, 1], this.redMetalTexture, true, false);
        this.supportTop = new MyCylinder(scene, 12, 1, [1, 1, 1, 1], this.redMetalTexture, true, false);
        this.base1 = new HeliBodyTriangularPrism(scene, 1, 0.3, 0.7, [1, 1, 1, 1], this.redMetalTexture);
        this.base2 = new HeliBodyTriangularPrism(scene, 1, 1.6, 0.3, [1, 1, 1, 1], this.redMetalTexture);
        this.base3 = new HeliBodyTriangularPrism(scene, 1, 0.6, 2, [1, 1, 1, 1], this.redMetalTexture);
        this.base4 = new HeliBodyTriangularPrism(scene, 1, 0.6, 1, [1, 1, 1, 1], this.redMetalTexture);
        this.base5 = new HeliBodyTriangularPrism(scene, 1, 0.4, 0.6, [1, 1, 1, 1], this.redMetalTexture);
    }

    display() {
        // Display the base of the propeller support
        this.scene.pushMatrix();
        this.scene.translate(0, -1, 0);
        this.scene.rotate(Math.PI / 2, 1, 0, 0);
        this.scene.translate(-0.5, 2, -2.6);
        this.base1.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(0, -1, 0);
        this.scene.translate(-0.5, 2.6, 2);
        this.base2.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(0, -1, 0);
        this.scene.rotate(Math.PI / 2, 1, 0, 0);
        this.scene.translate(0, 0.02, -2.608);
        this.scene.rotate(-Math.PI / 16, 1, 0, 0);
        this.scene.translate(-0.5, 0, 0.1);
        this.base3.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(0, -1, 0);
        this.scene.rotate(Math.PI / 2, 1, 0, 0);
        this.scene.translate(-0.5, -0.08, -2.5);
        this.base4.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(-0.5, 1.5, -0.08);
        this.base5.display();
        this.scene.popMatrix();

        // Display the upper propeller support
        this.scene.pushMatrix();
        this.scene.translate(0, 2, 0.5);
        this.scene.rotate(Math.PI / 30, 1, 0, 0);
        this.scene.scale(0.25, 0.1, 0.25);
        this.supportBottom.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(0, 2, 0.5);
        this.scene.scale(0.1, 0.6, 0.1);
        this.supportTop.display();
        this.scene.popMatrix();
    }
}