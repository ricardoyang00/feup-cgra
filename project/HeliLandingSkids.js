import { CGFobject, CGFtexture } from '../lib/CGF.js';
import { HeliBodyRectangularPrism } from './HeliBodyRectangularPrism.js';

export class HeliLandingSkids extends CGFobject {
    constructor(scene) {
        super(scene);
        
        this.blackMetalTexture = new CGFtexture(scene, 'textures/black_metal.jpg');

        this.mainSkidSupport = new HeliBodyRectangularPrism(scene, 0.3, 0.05, 2.5, [0.5, 0.5, 0.5, 1], this.blackMetalTexture);
        this.skidSupportMiddle = new HeliBodyRectangularPrism(scene, 0.3, 0.05, 0.15, [0.5, 0.5, 0.5, 1], this.blackMetalTexture);
        this.skidSupportBottom = new HeliBodyRectangularPrism(scene, 0.3, 0.05, 0.3, [0.5, 0.5, 0.5, 1], this.blackMetalTexture);

        this.landingSkid = new HeliBodyRectangularPrism(scene, 0.3, 0.05, 3.5, [0.5, 0.5, 0.5, 1], this.blackMetalTexture);
        this.landingSkidDetail = new HeliBodyRectangularPrism(scene, 0.3, 0.05, 0.35, [0.5, 0.5, 0.5, 1], this.blackMetalTexture);
    }

    display() {
        // Front skid support
        this.scene.pushMatrix();
        this.scene.translate(0, -1, 0);
        this.scene.rotate(Math.PI / 2, 0, 1, 0);
        this.scene.rotate(-Math.PI / 2, 1, 0, 0);
        this.scene.translate(0.8, -1.25, 0.35);
        this.mainSkidSupport.display();
        this.scene.popMatrix();

        // Front left
        this.scene.pushMatrix();
        this.scene.translate(0, -1, 0);
        this.scene.rotate(Math.PI / 2, 0, 1, 0);
        this.scene.rotate(-Math.PI / 2, 1, 0, 0);
        this.scene.translate(0.8, 1.2146, 0.3646);
        this.scene.rotate(-Math.PI / 4, 1, 0, 0);
        this.skidSupportMiddle.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(0, -1, 0);
        this.scene.rotate(Math.PI / 2, 0, 1, 0);
        this.scene.rotate(-Math.PI / 2, 1, 0, 0);
        this.scene.translate(0.8, 1.30917, 0.2764);
        this.scene.rotate(-Math.PI / 2.6, 1, 0, 0);
        this.skidSupportBottom.display();
        this.scene.popMatrix();

        // Front right
        this.scene.pushMatrix();
        this.scene.translate(0, -1, 0);
        this.scene.scale(-1, 1, 1);
        this.scene.gl.cullFace(this.scene.gl.FRONT);
        this.scene.rotate(Math.PI / 2, 0, 1, 0);
        this.scene.rotate(-Math.PI / 2, 1, 0, 0);
        this.scene.translate(0.8, 1.2146, 0.3646);
        this.scene.rotate(-Math.PI / 4, 1, 0, 0);
        this.skidSupportMiddle.display();
        this.scene.gl.cullFace(this.scene.gl.BACK);
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(0, -1, 0);
        this.scene.scale(-1, 1, 1);
        this.scene.gl.cullFace(this.scene.gl.FRONT);
        this.scene.rotate(Math.PI / 2, 0, 1, 0);
        this.scene.rotate(-Math.PI / 2, 1, 0, 0);
        this.scene.translate(0.8, 1.30917, 0.2764);
        this.scene.rotate(-Math.PI / 2.6, 1, 0, 0);
        this.skidSupportBottom.display();
        this.scene.gl.cullFace(this.scene.gl.BACK);
        this.scene.popMatrix();

        // Rear skid support
        this.scene.pushMatrix();
        this.scene.translate(0, -1, 0);
        this.scene.rotate(Math.PI / 2, 0, 1, 0);
        this.scene.rotate(-Math.PI / 2, 1, 0, 0);
        this.scene.translate(-1, -1.25, 0.35);
        this.mainSkidSupport.display();
        this.scene.popMatrix();

        // Rear left
        this.scene.pushMatrix();
        this.scene.translate(0, -1, 0);
        this.scene.rotate(Math.PI / 2, 0, 1, 0);
        this.scene.rotate(-Math.PI / 2, 1, 0, 0);
        this.scene.translate(-1, 1.2146, 0.3646);
        this.scene.rotate(-Math.PI / 4, 1, 0, 0);
        this.skidSupportMiddle.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(0, -1, 0);
        this.scene.rotate(Math.PI / 2, 0, 1, 0);
        this.scene.rotate(-Math.PI / 2, 1, 0, 0);
        this.scene.translate(-1, 1.30917, 0.2764);
        this.scene.rotate(-Math.PI / 2.6, 1, 0, 0);
        this.skidSupportBottom.display();
        this.scene.popMatrix();

        // Rear right
        this.scene.pushMatrix();
        this.scene.translate(0, -1, 0);
        this.scene.scale(-1, 1, 1);
        this.scene.gl.cullFace(this.scene.gl.FRONT);
        this.scene.rotate(Math.PI / 2, 0, 1, 0);
        this.scene.rotate(-Math.PI / 2, 1, 0, 0);
        this.scene.translate(-1, 1.2146, 0.3646);
        this.scene.rotate(-Math.PI / 4, 1, 0, 0);
        this.skidSupportMiddle.display();
        this.scene.gl.cullFace(this.scene.gl.BACK);
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(0, -1, 0);
        this.scene.scale(-1, 1, 1);
        this.scene.gl.cullFace(this.scene.gl.FRONT);
        this.scene.rotate(Math.PI / 2, 0, 1, 0);
        this.scene.rotate(-Math.PI / 2, 1, 0, 0);
        this.scene.translate(-1, 1.30917, 0.2764);
        this.scene.rotate(-Math.PI / 2.6, 1, 0, 0);
        this.skidSupportBottom.display();
        this.scene.gl.cullFace(this.scene.gl.BACK);
        this.scene.popMatrix();

        
        // Left landing skid
        this.scene.pushMatrix();
        this.scene.translate(0, -1, 0);
        this.scene.rotate(Math.PI / 2, 1, 0, 0);
        this.scene.translate(-1.6, -1.75, -0.04);
        this.landingSkid.display();
        this.scene.popMatrix();

        // Front left skid detail
        this.scene.pushMatrix();
        this.scene.translate(0, -1, 0);
        this.scene.rotate(-Math.PI / 2, 1, 0, 0);
        this.scene.translate(-1.6, 1.747, -0.009);
        this.scene.rotate(Math.PI / 6, 1, 0, 0);
        this.scene.translate(0, 0.002, -0.002);
        this.landingSkidDetail.display();
        this.scene.popMatrix();

        // Front right skid detail
        this.scene.pushMatrix();
        this.scene.translate(0, -1, 0);
        this.scene.scale(-1, 1, 1);
        this.scene.gl.cullFace(this.scene.gl.FRONT);
        this.scene.rotate(-Math.PI / 2, 1, 0, 0);
        this.scene.translate(-1.6, 1.747, -0.009);
        this.scene.rotate(Math.PI / 6, 1, 0, 0);
        this.scene.translate(0, 0.002, -0.002);
        this.landingSkidDetail.display();
        this.scene.gl.cullFace(this.scene.gl.BACK);
        this.scene.popMatrix();

        // Right landing skid
        this.scene.pushMatrix();
        this.scene.translate(0, -1, 0);
        this.scene.scale(-1, 1, 1);
        this.scene.gl.cullFace(this.scene.gl.FRONT);
        this.scene.rotate(Math.PI / 2, 1, 0, 0);
        this.scene.translate(-1.6, -1.75, -0.04);
        this.landingSkid.display();
        this.scene.gl.cullFace(this.scene.gl.BACK);
        this.scene.popMatrix();

        // Rear left skid detail
        this.scene.pushMatrix();
        this.scene.translate(0, -1, 0);
        this.scene.scale(1, 1, -1);
        this.scene.gl.cullFace(this.scene.gl.FRONT);
        this.scene.rotate(-Math.PI / 2, 1, 0, 0);
        this.scene.translate(-1.6, 1.747, -0.009);
        this.scene.rotate(Math.PI / 6, 1, 0, 0);
        this.scene.translate(0, 0.002, -0.002);
        this.landingSkidDetail.display();
        this.scene.gl.cullFace(this.scene.gl.BACK);
        this.scene.popMatrix();

        // Rear right skid detail
        this.scene.pushMatrix();
        this.scene.translate(0, -1, 0);
        this.scene.scale(-1, 1, -1);
        this.scene.rotate(-Math.PI / 2, 1, 0, 0);
        this.scene.translate(-1.6, 1.747, -0.009);
        this.scene.rotate(Math.PI / 6, 1, 0, 0);
        this.scene.translate(0, 0.002, -0.002);
        this.landingSkidDetail.display();
        this.scene.popMatrix();
    }
}