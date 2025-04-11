import { CGFobject } from '../lib/CGF.js';
import { MyQuad } from './MyQuad.js';

export class MyWindow extends CGFobject {
    constructor(scene, windowTexture) {
        super(scene);
        this.scene = scene;
        this.windowTexture = windowTexture
        this.quad = new MyQuad(scene);
    }

    display() {
        this.scene.pushMatrix();
        this.windowTexture.bind();

        this.quad.display();

        this.windowTexture.unbind();
        this.scene.popMatrix();
    }
}