import { CGFobject } from '../lib/CGF.js';
import { MyQuad } from './MyQuad.js';

/**
 * MyUnitCubeQuad
 * @constructor
 * @param scene - Reference to MyScene object
 */
export class MyUnitCubeQuad extends CGFobject {
    // top (+Y), front (+Z), right (+X), back (-Z), left (-X), bottom (-Y)
    constructor(scene, textures) {
        super(scene);
        this.scene.quad = new MyQuad(this.scene);

        this.texTop = textures.texTop;
        this.texFront = textures.texFront;
        this.texRight = textures.texRight;
        this.texBack = textures.texBack;
        this.texLeft = textures.texLeft;
        this.texBottom = textures.texBottom;
    }
    
    applyFilter() {
        this.scene.gl.texParameteri(this.scene.gl.TEXTURE_2D, this.scene.gl.TEXTURE_MAG_FILTER, this.scene.gl.LINEAR);
        if (this.scene.applyFilter) this.scene.gl.texParameteri(this.scene.gl.TEXTURE_2D, this.scene.gl.TEXTURE_MAG_FILTER, this.scene.gl.NEAREST);
    }

    display() {
        this.scene.cubeMaterial.apply();
        
        // Bottom (-Y)
        this.scene.pushMatrix();
        this.scene.rotate(Math.PI / 2, 1, 0, 0);
        this.scene.translate(0, 0, 0.5);
        this.texBottom.bind();
        this.applyFilter();
        this.scene.quad.display();
        this.scene.popMatrix();
        
        // Top (+Y)
        this.scene.pushMatrix();
        this.scene.rotate(-Math.PI / 2, 1, 0, 0);
        this.scene.translate(0, 0, 0.5);
        this.texTop.bind();
        this.applyFilter();
        this.scene.quad.display();
        this.scene.popMatrix();
        
        // Front (+Z)
        this.scene.pushMatrix();
        this.scene.translate(0, 0, 0.5);
        this.texFront.bind();
        this.applyFilter();
        this.scene.quad.display();
        this.scene.popMatrix();
    
        // Back (-Z)
        this.scene.pushMatrix();
        this.scene.rotate(Math.PI, 0, 1, 0);
        this.scene.translate(0, 0, 0.5);
        this.texBack.bind();
        this.applyFilter();
        this.scene.quad.display();
        this.scene.popMatrix();
    
        // Right (+X)
        this.scene.pushMatrix();
        this.scene.rotate(Math.PI / 2, 0, 1, 0);
        this.scene.translate(0, 0, 0.5);
        this.texRight.bind();
        this.applyFilter();
        this.scene.quad.display();
        this.scene.popMatrix();
    
        // Left (-X)
        this.scene.pushMatrix();
        this.scene.rotate(-Math.PI / 2, 0, 1, 0);
        this.scene.translate(0, 0, 0.5);
        this.texLeft.bind();
        this.applyFilter();
        this.scene.quad.display();
        this.scene.popMatrix();
    }

}

