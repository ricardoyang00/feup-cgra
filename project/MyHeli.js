import { CGFobject } from '../lib/CGF.js';
import { HeliPropeller } from './HeliPropeller.js';
import { HeliBucket } from './HeliBucket.js';
import { MyCylinder } from './MyCylinder.js';

/**
 * MyHeli
 */
export class MyHeli extends CGFobject {
    constructor(scene, initPos = [0, 0, 0], initOrientation = 0, initSpeed = 0) {
        super(scene);

        this.position = initPos;
        this.orientation = initOrientation;
        this.speed = initSpeed;

        this.state = "ground";
        this.cruisingAltitude = 5;
        this.groundLevel = 0;
        this.verticalSpeed = 2;
        this.targetPosition = null; // position to automatically fly to
        this.bucketIsEmpty = true;

        this.upperPropRotation = 0;
        this.upperPropSpeed = 0;
        this.maxPropSpeed = 20;
        this.takeOffPropSpeed = this.maxPropSpeed * 0.7;

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

        this.model = new MyCylinder(scene, 4, 4, [1, 1, 1, 1], null);
    }

    resetHelicopter() {
        this.position = [0, 0, 0];
        this.orientation = 0;
        this.speed = 0;
        this.state = "ground";
        this.upperPropSpeed = 0;
        this.upperPropRotation = 0;
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

    resetVerticalSpeed() {
        this.verticalSpeed = 2;
    }

    initiateTakeoff() {
        if (this.state === "ground") {
            this.resetVerticalSpeed();
            this.state = "taking_off";
        } else if (this.state === "filling_bucket") {
            this.resetVerticalSpeed();
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
            case "ascending_from_lake":
                if (this.upperPropSpeed >= this.takeOffPropSpeed) {
                    this.position[1] += this.verticalSpeed * dt;
                    if (this.position[1] >= this.cruisingAltitude) {
                        this.position[1] = this.cruisingAltitude;
                        this.state = "flying";
                    }
                }
                break;

            case "flying":
                const vx = this.speed * Math.sin(this.orientation);
                const vz = this.speed * Math.cos(this.orientation);
                this.position[0] += vx * dt;
                this.position[2] += vz * dt;
                break;

            case "landing":
                this.verticalSpeed = Math.max(this.verticalSpeed - dt * 0.5, 0.5);
                this.position[1] -= this.verticalSpeed * dt;
                if (this.position[1] <= this.groundLevel) {
                    this.position[1] = this.groundLevel;
                    this.state = "ground";
                    this.speed = 0;
                    this.resetVerticalSpeed();
                }
                break;

            case "moving_to_heliport":
                const dx = this.targetPosition[0] - this.position[0];
                const dz = this.targetPosition[2] - this.position[2];
                const distance = Math.sqrt(dx * dx + dz * dz);
                const targetAngle = Math.atan2(-dx, -dz);

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
                    this.speed = 5;
                    const vx = -this.speed * Math.sin(this.orientation);
                    const vz = -this.speed * Math.cos(this.orientation);
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
                let reorientAngleDiff = - this.orientation;
                reorientAngleDiff = Math.atan2(Math.sin(reorientAngleDiff), Math.cos(reorientAngleDiff));
                
                const maxTurn = this.scene.turnSpeed * dt;
                const turnAmount = Math.sign(reorientAngleDiff) * Math.min(Math.abs(reorientAngleDiff), maxTurn);
                
                this.turn(turnAmount);

                if (Math.abs(reorientAngleDiff) < 0.005) {
                    this.orientation = 0;
                    this.state = "landing";
                }
                break;

            case "descending_to_lake":
                this.position[1] -= this.verticalSpeed * dt * 0.4;
                if (this.position[1] <= 3) { // TODO: change 3 to rope length later
                    this.position[1] = 3;
                    this.state = "filling_bucket";
                }
                break;

            case "filling_bucket":
                // TODO: Bucket filling logic
                break;

            default:
                break;
        }

        switch (this.state) {
            case "taking_off":
            case "ascending_from_lake":
                this.upperPropSpeed = Math.min(this.upperPropSpeed + dt * 2, this.maxPropSpeed);
                break;
    
            case "flying":
            case "moving_to_heliport":
            case "reorienting_to_land":
                this.upperPropSpeed = this.maxPropSpeed;
                break;
    
            case "landing":
                this.upperPropSpeed = Math.max(this.upperPropSpeed - dt * 2, this.maxPropSpeed * 0.3);
                break;

            case "ground":
                this.upperPropSpeed = Math.max(this.upperPropSpeed - dt * 2, 0);
                break;

            case "descending_to_lake":
                this.upperPropSpeed = Math.max(this.upperPropSpeed - dt * 2, this.maxPropSpeed * 0.3);    
                break;

            case "filling_bucket":
                this.upperPropSpeed = this.maxPropSpeed * 0.3;
                break;
    
            default:
                this.upperPropSpeed = 0;
                break;
        }

        this.upperPropRotation += this.upperPropSpeed * dt;
        this.upperPropRotation %= 2 * Math.PI;
    }

    display() {
        this.scene.pushMatrix();
        this.scene.scale(6, 6, 6);
        this.scene.translate(this.position[0], this.position[1], this.position[2]);
        this.scene.rotate(this.orientation, 0, 1, 0);
        
        this.scene.pushMatrix();
        this.scene.scale(3, 3, 3);
        this.scene.translate(0, 0.4, 0);
        this.scene.rotate(this.upperPropRotation, 0, 1, 0);
        this.upperProp.display();
        this.scene.popMatrix();

        this.model.display();
        this.scene.popMatrix();

        /*this.scene.pushMatrix();
        this.scene.scale(10, 10, 10);
        this.scene.rotate(Math.PI / 2, 0, 0, 1);
        this.scene.translate(1, -1, -2);
        this.rearProp.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.scale(6, 6, 6);
        this.scene.translate(-1, 3, 1);
        this.bucket.display();
        this.scene.popMatrix();*/
    }
}
