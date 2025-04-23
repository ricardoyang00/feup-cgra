import { CGFobject } from '../lib/CGF.js';
import { HeliPropeller } from './HeliPropeller.js';
import { HeliBucket } from './HeliBucket.js';
import { MyCylinder } from './MyCylinder.js';

/**
 * MyHeli
 */
export class MyHeli extends CGFobject {
    constructor(scene, initPos = [0, 1, 0], initOrientation = 0, initSpeed = 0  ) {
        super(scene);
        
        this.position = initPos;
        this.orientation = initOrientation;
        this.speed = initSpeed;

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

        this.model = new MyCylinder(scene, 16, 4, [1, 1, 1, 1], null);
    }

    setRopeLength(length) {
        this.bucket.setRopeLength(length);
    }

    turn(v) {
        this.orientation += v;
    }

    accelerate(v) {
        this.speed += v;
    }
    
    update(dt) {
        const vx = this.speed * Math.sin(this.orientation);
        const vz = this.speed * Math.cos(this.orientation);
        this.position[0] += vx * dt; // Update x position
        this.position[2] += vz * dt; // Update z position
    }

    display() {
        if (this.position[1] < 1) {
            this.position[1] = 1;
        }

        /*this.scene.pushMatrix();
        this.scene.rotate(Math.PI / 2, 1, 0, 0);
        this.scene.translate(0, 0.5, 0);
        this.upperProp.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.rotate(Math.PI / 2, 0, 0, 1);
        this.scene.translate(2, 0, 0);
        this.rearProp.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(0, -0.5, 0);
        this.bucket.display();
        this.scene.popMatrix();*/

        this.scene.pushMatrix();
        this.scene.scale(0.005, 0.005, 0.005);
        this.scene.translate(this.position[0], this.position[2], this.position[1]);
        this.scene.rotate(this.orientation, 0, 0, -1);
        this.model.display();
        this.scene.popMatrix();
    }
}
