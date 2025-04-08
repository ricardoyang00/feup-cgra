import { CGFobject, CGFtexture } from '../lib/CGF.js';
import { MyQuad } from './MyQuad.js'; // Assuming MyQuad is a class for rendering a quad

export class MyWindow extends CGFobject {
    constructor(scene) {
        super(scene);
        this.scene = scene;
        this.windowTexture = new CGFtexture(scene, 'textures/window.jpg');
        this.quad = new MyQuad(scene);
    }

    display() {
        // Bind
        this.scene.pushMatrix();
        this.windowTexture.bind();

        this.quad.display();

        // Unbind 
        this.windowTexture.unbind();
        this.scene.popMatrix();
    }
}