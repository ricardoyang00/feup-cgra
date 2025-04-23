import { CGFobject } from '../lib/CGF.js';
import { HeliPropeller } from './HeliPropeller.js';
import { HeliBucket } from './HeliBucket.js';

/**
 * MyHeli
 */
export class MyHeli extends CGFobject {
    constructor(scene) {
        super(scene);
        
        this.upperProp = new HeliPropeller(scene, {
            bladeCount: 4,
            hubRadius: 0.1,
            hubThickness: 0.08,
            bladeLength: 0.8,
            bladeWidth: 0.04,
            bladeThickness: 0.01,
            bladeOffset: 0.1
        });
        this.rearProp = new HeliPropeller(scene, {
            bladeCount: 3,
            hubRadius: 0.05,
            hubThickness: 0.05,
            bladeLength: 0.2,
            bladeWidth: 0.02,
            bladeThickness: 0.01,
            bladeOffset: 0.05
        });

        this.bucket = new HeliBucket(scene, {
            ropeLength: 2.0,
            bucketRadius: 0.2,
            bucketHeight: 0.3
        });
    }

    setRopeLength(length) {
        this.bucket.setRopeLength(length);
    }
    
    display() {
        this.scene.pushMatrix();
        this.scene.rotate(Math.PI / 2, 1, 0, 0);
        this.scene.translate(0, 0.5, 0);
        this.upperProp.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.rotate(Math.PI / 2, 0, 0, 1);
        this.scene.translate(2, 0, 0);
        this.rearProp.display();
        this.scene.popMatrix();

        // Display the bucket and rope
        this.scene.pushMatrix();
        this.scene.translate(0, -0.5, 0); // Position the bucket below the helicopter
        this.bucket.display();
        this.scene.popMatrix();
    }
}
