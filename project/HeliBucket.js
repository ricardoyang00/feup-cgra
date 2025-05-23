import { CGFobject, CGFtexture } from '../lib/CGF.js';
import { HeliBucketRing } from './HeliBucketRing.js';
import { MyCylinder } from './MyCylinder.js';
import { MyCircle } from './MyCircle.js';

/**
 * HeliBucket
 * Models a bucket connected to the helicopter with an adjustable rope
 */
export class HeliBucket extends CGFobject {
    constructor(scene, options = {}) {
        super(scene);
        this.visible = false;

        this.ropeLength = options.ropeLength || 2.0;
        this.bucketRadius = options.bucketRadius || 0.2;
        this.bucketHeight = options.bucketHeight || 0.3;
        this.bucketThickness = options.bucketThickness || 0.01;
        this.numSecondaryRopes = options.numSecondaryRopes || 4;

        this.maxRopeLength = 2.0;
        this.position = null;

        this.bottomOpenAngle = 0;
        this.bottomOpening = false;
        this.bottomHingeSide = 0;

        this.metalTexture = new CGFtexture(scene, 'textures/helicopter/bucket_metal.jpg');
        this.metalTexture2 = new CGFtexture(scene, 'textures/helicopter/bucket_metal2.jpg');
        this.ropeTexture = new CGFtexture(scene, 'textures/helicopter/rope.jpg');
        
        this.rope = new MyCylinder(scene, 6, 1, [1, 1, 1, 1], this.ropeTexture, true, false, 1.0, 1.0, 10);
        this.secondaryRope = new MyCylinder(scene, 6, 1, [1, 1, 1, 1], this.ropeTexture, true, false, 1.0, 1.0, 10);
        this.bucket = new MyCylinder(scene, 16, 1, [1, 1, 1, 1], this.metalTexture, false, false, 1, 1, 1, false);
        this.innerBucket = new MyCylinder(scene, 16, 1, [1, 1, 1, 1], this.metalTexture2, false, true, 1, 1, 1, false);
        this.bucketRing = new HeliBucketRing(scene, 16, this.bucketRadius - this.bucketThickness, this.bucketRadius);
        this.bucketBottom = new MyCircle(scene, 16, true, this.metalTexture2, [1, 1, 1, 1]);
    }

    setPosition(x, y, z) {
        this.position = [x, y, z];
    }
    
    setRopeLength(length) {
        this.ropeLength = Math.min(Math.max(length, 0.1), this.maxRopeLength);
    }

    setVisible(visible) {
        this.visible = visible;
    }

    openBottom() {
        this.bottomOpening = true;
    }

    update(dt) {
        if (this.bottomOpening && this.bottomOpenAngle < Math.PI / 2) {
            this.bottomOpenAngle += dt * 2;
            if (this.bottomOpenAngle > Math.PI / 2) {
                this.bottomOpenAngle = Math.PI / 2;
                this.bottomOpening = false;
            }
        }
    }

    display() {
        if (!this.visible) return;
        
        // Display the rope
        this.scene.pushMatrix();
        this.scene.translate(0, 1, 0);
        this.scene.scale(0.01, this.ropeLength, 0.01);
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
            this.scene.translate(0, this.bucketHeight * 2 + 0.03, 0);
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

        // Display the bottom of the bucket
        this.scene.pushMatrix();
        const hingeAngle = this.bottomHingeSide;
        const r = this.bucketRadius;
        this.scene.translate(r * Math.cos(hingeAngle), 0, r * Math.sin(hingeAngle));
        this.scene.rotate(-this.bottomOpenAngle, 0, 0, 1); // Open around Z axis
        this.scene.translate(-r * Math.cos(hingeAngle), 0, -r * Math.sin(hingeAngle));
        this.scene.scale(this.bucketRadius, 1, this.bucketRadius);
        this.scene.rotate(-Math.PI / 2, 1, 0, 0);
        this.bucketBottom.display();
        this.scene.popMatrix();

        this.scene.popMatrix();
    }
}