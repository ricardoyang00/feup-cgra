import { CGFobject, CGFtexture } from '../lib/CGF.js';
import { MyQuad } from './MyQuad.js'; // Assuming MyQuad is a class for rendering a quad

export class MyDoor extends CGFobject {
    constructor(scene) {
        super(scene);
        this.scene = scene;
        this.doorTexture = new CGFtexture(scene, 'textures/door.jpg');
        this.quad = new MyQuad(scene);
    }

    display() {
        // Bind the door texture
        this.scene.pushMatrix();
        this.doorTexture.bind();

        // Scale the quad to match the door's aspect ratio (612x408)
        const width = 612;
        const height = 408;
        const scaleX = width / height; // Aspect ratio for X-axis
        this.scene.scale(scaleX, 1, 1); // Scale the quad

        // Display the quad with the door texture
        this.quad.display();

        // Unbind the door texture
        this.doorTexture.unbind();
        this.scene.popMatrix();
    }
}