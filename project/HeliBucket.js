import { CGFobject } from '../lib/CGF.js';
import { HeliBucketRing } from './HeliBucketRing.js';
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
        this.bucketThickness = options.bucketThickness || 0.01;
        this.numSecondaryRopes = options.numSecondaryRopes || 4;

        this.rope = new MyCylinder(scene, 6, 1, [1, 1, 1, 1], null, true, false);
        this.secondaryRope = new MyCylinder(scene, 6, 1, [1, 1, 1, 1], null, true, false);
        this.bucket = new MyCylinder(scene, 16, 1, [1, 1, 1, 1], null, false, true);
        this.innerBucket = new MyCylinder(scene, 16, 1, [1, 1, 1, 1], null, false, true);
        this.bucketRing = new HeliBucketRing(scene, 16, this.bucketRadius - this.bucketThickness, this.bucketRadius);
    }

    display() {
        // Display the rope
        this.scene.pushMatrix();
        this.scene.scale(0.01, this.ropeLength, 0.01);
        this.scene.translate(0, this.bucketHeight + 0.02, 0);
        this.rope.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();

        // Display secondary ropes
        for (let i = 0; i < this.numSecondaryRopes; i++) {
            const theta = (i * 2 * Math.PI) / this.numSecondaryRopes;
            
            // Calculate end point on the bucket's rim
            const endX = this.bucketRadius * Math.cos(theta);
            const endZ = this.bucketRadius * Math.sin(theta);
            const endY = this.bucketRadius * 0.48;
            
            // Direction from main rope's end to rim point
            const dx = endX;
            const dy = endY;
            const dz = endZ;

            // Calculate rotations and length
            const yRot = Math.atan2(dz, dx); // Azimuth (around Y-axis)
            const horizontalDist = Math.sqrt(dx * dx + dz * dz);
            const xRot = -Math.atan2(dy, horizontalDist); // Elevation (around X-axis)
            const length = Math.sqrt(dx * dx + dy * dy + dz * dz) * 2;

            // Apply transformations for secondary rope
            this.scene.pushMatrix();
            this.scene.translate(0, this.bucketHeight * 2 + 0.06, 0);
            this.scene.rotate(yRot, 0, 1, 0); // Rotate to face the direction
            this.scene.rotate(xRot, 1, 0, 0); // Tilt to align with the slope
            this.scene.scale(0.01, length, 0.01); // Scale to calculated length
            this.scene.rotate(Math.PI, 1, 0, 0); // Rotate to face the bucket
            this.secondaryRope.display();
            this.scene.popMatrix();
        }
        
        // Display the outer bucket
        this.scene.pushMatrix();
        this.scene.scale(this.bucketRadius, this.bucketHeight, this.bucketRadius);
        this.bucket.display();
        this.scene.popMatrix();

        // Display the inner bucket
        this.scene.pushMatrix();
        this.scene.scale(this.bucketRadius - this.bucketThickness, this.bucketHeight, this.bucketRadius - this.bucketThickness);
        this.innerBucket.display();
        this.scene.popMatrix();

        // Display the ring to hide the gap
        this.scene.pushMatrix();
        this.scene.translate(0, this.bucketHeight, 0);
        this.bucketRing.display();
        this.scene.popMatrix();

        this.scene.popMatrix();
    }
}