import {CGFobject} from '../lib/CGF.js';
import { MyQuad } from './MyQuad.js';

/**
 * MyUnitCubeQuad
 * @constructor
 * @param scene - Reference to MyScene object
 */
export class MyUnitCubeQuad extends CGFobject {
    constructor(scene) {
        super(scene);
        this.scene.quad = new MyQuad(this.scene);
    }
    
    display() {
        // base
        this.scene.pushMatrix();
        this.scene.rotate(Math.PI, 1, 0, 0);
        this.scene.translate(0, 0.5, 0);
        this.scene.quad.display();
        this.scene.popMatrix();

        // front
        this.scene.pushMatrix();
        this.scene.rotate(Math.PI / 2, 1, 0, 0);
        this.scene.translate(0, 0.5, 0);
        this.scene.quad.display();
        this.scene.popMatrix();

        // right
        this.scene.pushMatrix();
        this.scene.rotate(- Math.PI / 2, 0, 0, 1);
        this.scene.translate(0, 0.5, 0);
        this.scene.quad.display();
        this.scene.popMatrix();

        // back
        this.scene.pushMatrix();
        this.scene.rotate(- Math.PI / 2, 1, 0, 0);
        this.scene.translate(0, 0.5, 0);
        this.scene.quad.display();
        this.scene.popMatrix();

        // left
        this.scene.pushMatrix();
        this.scene.rotate(Math.PI / 2, 0, 0, 1);
        this.scene.translate(0, 0.5, 0);
        this.scene.quad.display();
        this.scene.popMatrix();

        // top
        this.scene.pushMatrix();
        this.scene.rotate(Math.PI / 2, 0, 1, 0);
        this.scene.translate(0, 0.5, 0);
        this.scene.quad.display();
        this.scene.popMatrix();
    }
}

