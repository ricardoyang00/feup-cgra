import { CGFobject } from '../lib/CGF.js';
import { HeliTailCuttablePyramid } from './HeliTailCuttablePyramid.js';

export class HeliTail extends CGFobject {
    constructor(scene) {
        super(scene);

        // Main tail
        this.mainTail = new HeliTailCuttablePyramid(scene, 2, 1, 4, 2.5);

        // Calculate dimensions for the secondary tail
        const u = (4 - 2.5) / 4; // u = 0.375
        const width = 2 * u;  // mainTail TopWidth = 0.75
        const depth = 1 * u;  // mainTail TopDepth = 0.375

        // Secondary tail
        this.secondaryTail = new HeliTailCuttablePyramid(scene, width, depth, 3, 2);
    }

    display() {
        // Display the main tail
        this.scene.pushMatrix();
        this.scene.translate(0, -1, 0);
        this.scene.rotate(Math.PI, 1, 0, 0);
        this.scene.rotate(Math.PI, 0, 1, 0);
        this.scene.translate(-1, -2.60, 2.75);
        this.mainTail.display();
        this.scene.popMatrix();

        // Display the secondary tail
        this.scene.pushMatrix();
        this.scene.translate(0, -1, 0);
        this.scene.rotate(Math.PI, 1, 0, 0);
        this.scene.rotate(Math.PI, 0, 1, 0);
        this.scene.translate(-0.375, -2.60, 5.25);
        this.secondaryTail.display();
        this.scene.popMatrix();
    }
}