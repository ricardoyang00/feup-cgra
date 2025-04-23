import { CGFobject } from '../lib/CGF.js';
import { MyCylinder } from './MyCylinder.js';

/**
 * HeliBucket
 * Models a bucket connected to the helicopter with an adjustable rope
 */
export class HeliBucket extends CGFobject {
    constructor(scene, options = {}) {
        super(scene);

        this.ropeLength = options.ropeLength || 2.0;
        this.bucketRadius = options.bucketRadius || 0.2;
        this.bucketHeight = options.bucketHeight || 0.3;

        this.rope = new MyCylinder(scene, 6, 1, [1, 1, 1, 1], null, true, false);
        this.bucket = new MyCylinder(scene, 12, 1, [1, 1, 1, 1], null, false, true);
    }

    display() {
        // Display the rope
        this.scene.pushMatrix();
        this.scene.scale(0.02, this.ropeLength, 0.02);
        this.rope.display();
        this.scene.popMatrix();

        // Display the bucket
        this.scene.pushMatrix();
        this.scene.scale(this.bucketRadius, this.bucketHeight, this.bucketRadius);
        this.bucket.display();
        this.scene.popMatrix();
    }
}