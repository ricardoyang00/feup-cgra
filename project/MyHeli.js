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

        this.state = "ground";
        this.cruisingAltitude = 5;
        this.groundLevel = 1;
        this.verticalSpeed = 2;
        this.targetPosition = null; // position to automatically fly to
        this.bucketIsEmpty = true;

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
    
    initiateTakeoff() {
        if (this.state === "ground") {
            this.state = "taking_off";
        } else if (this.state === "filling_bucket") {
            this.state = "ascending_from_lake";
        }
    }

    initiateLanding() {
        if (this.state === "flying") {
            if (this.scene.isOverLake(this.position) && this.bucketIsEmpty) {
                this.state = "descending_to_lake";
            } else {
                const heliport = this.scene.heliportPosition;
                const dx = heliport[0] - this.position[0];
                const dz = heliport[2] - this.position[2];
                const distance = Math.sqrt(dx * dx + dz * dz);
                
                if (distance < 0.1) {
                    // Already at heliport — just reorient and land
                    this.state = "reorienting_to_land";
                } else {
                    // Need to fly to heliport
                    this.state = "moving_to_heliport";
                    this.targetPosition = heliport.slice();
                    this.targetPosition[1] = this.cruisingAltitude;
                }                
            }
        }
    }

    update(dt) {
        switch (this.state) {
            case "taking_off":
                this.position[1] += this.verticalSpeed * dt;
                if (this.position[1] >= this.cruisingAltitude) {
                    this.position[1] = this.cruisingAltitude;
                    this.state = "flying";
                }
                break;
        
            case "flying":
                const vx = this.speed * Math.sin(this.orientation);
                const vz = this.speed * Math.cos(this.orientation);
                this.position[0] += vx * dt;
                this.position[2] += vz * dt;
                break;

            case "landing":
                this.position[1] -= this.verticalSpeed * dt;
                if (this.position[1] <= this.groundLevel) {
                    this.position[1] = this.groundLevel;
                    this.state = "ground";
                    this.speed = 0;
                }
                break;

            case "moving_to_heliport":
                const dx = this.targetPosition[0] - this.position[0];
                const dz = this.targetPosition[2] - this.position[2];
                const distance = Math.sqrt(dx * dx + dz * dz);
                const targetAngle = Math.atan2(dx, dz);
    
                let angleDiff = targetAngle - this.orientation;
                angleDiff = Math.atan2(Math.sin(angleDiff), Math.cos(angleDiff));
                
                const turnStep = this.scene.turnSpeed * dt;
    
                if (Math.abs(angleDiff) > 0.05) {
                    // Rotate in place toward heliport, shortest path
                    const turnAmount = Math.sign(angleDiff) * Math.min(Math.abs(angleDiff), turnStep);
                    this.orientation += turnAmount;
                    this.speed = 0;
                } else {
                    this.orientation = targetAngle;
                    this.speed = 4;
                    const vx = this.speed * Math.sin(this.orientation);
                    const vz = this.speed * Math.cos(this.orientation);
                    this.position[0] += vx * dt;
                    this.position[2] += vz * dt;
    
                    if (distance < 0.1) {
                        this.position[0] = this.targetPosition[0];
                        this.position[2] = this.targetPosition[2];
                        this.state = "reorienting_to_land";
                    }
                }
                break;

            case "reorienting_to_land":
                let reorientAngleDiff = 0 - this.orientation;
                reorientAngleDiff = Math.atan2(Math.sin(reorientAngleDiff), Math.cos(reorientAngleDiff));
                const maxTurn = this.scene.turnSpeed * dt;
                const turnAmount = Math.sign(reorientAngleDiff) * Math.min(Math.abs(reorientAngleDiff), maxTurn);
                this.turn(turnAmount);
    
                if (Math.abs(reorientAngleDiff) < 0.01) {
                    this.orientation = 0;
                    this.state = "landing";
                }
                break;

            case "descending_to_lake":
                this.position[1] -= this.verticalSpeed * dt;
                if (this.position[1] <= 3) { // TODO: change 3 to rope length later
                    this.position[1] = 3;
                    this.state = "filling_bucket";
                }
                break;

            case "filling_bucket":
                // TODO: Bucket filling logic
                break;
    
            case "ascending_from_lake":
                this.position[1] += this.verticalSpeed * dt;
                if (this.position[1] >= this.cruisingAltitude) {
                    this.position[1] = this.cruisingAltitude;
                    this.state = "flying";
                }
                break;

            default:
                break;
        }
    }

    display() {
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
