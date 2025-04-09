import { CGFobject, CGFtexture } from '../lib/CGF.js';
import { MyQuad } from './MyQuad.js'; // Assuming MyQuad is a class for rendering a quad

export class MyHeliport extends CGFobject {
    constructor(scene) {
        super(scene);
        this.scene = scene;
        this.texture = new CGFtexture(scene, 'textures/heliport.png');
        this.quad = new MyQuad(scene);
    }

    display() {
        // Bind
        this.scene.pushMatrix();
        this.texture.bind();

        this.quad.display();

        // Unbind 
        this.texture.unbind();
        this.scene.popMatrix();
    }
}