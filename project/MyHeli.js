import { CGFobject } from '../lib/CGF.js';
import { HeliPropeller } from './HeliPropeller.js';
import { HeliBucket } from './HeliBucket.js';
import { HeliMainRectangularPrism } from './HeliMainRectangularPrism.js';
import { HeliTriangularPrism } from './HeliTriangularPrism.js';
import { HeliSecondaryRectangularPrism } from './HeliSecondaryRectangularPrism.js';

/**
 * MyHeli
 */
export class MyHeli extends CGFobject {
    constructor(scene, initPos = [0, 1, 0], initOrientation = 0, initSpeed = 0) {
        super(scene);

        this.position = initPos;
        this.orientation = initOrientation;
        this.speed = initSpeed;

        this.state = "ground";
        this.cruisingAltitude = 5;
        this.groundLevel = 0.5;
        this.verticalSpeed = 2;
        this.targetPosition = null; // position to automatically fly to
        this.bucketIsEmpty = true;

        this.upperPropRotation = 0;
        this.upperPropSpeed = 0;
        this.maxPropSpeed = 20;
        this.takeOffPropSpeed = this.maxPropSpeed * 0.7;

        this.leanAngle = 0;
        this.maxLeanAngle = Math.PI / 12; // max 15 degrees
        this.previousSpeed = 0;

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

        this.mainBody = new HeliMainRectangularPrism(scene, 2, 3, 1.2);
        this.triangularPrism = new HeliTriangularPrism(scene, 2, 1, 1);
        this.rectangularPrism = new HeliSecondaryRectangularPrism(scene, 2, 3.25, 1);

        this.triangularPrismTop = new HeliTriangularPrism(scene, 2, 0.75, 0.2);
        this.rectangularPrismMiddle = new HeliSecondaryRectangularPrism(scene, 2, 0.75, 0.5);
        this.triangularPrismBottom = new HeliTriangularPrism(scene, 2, 0.75, 0.5);
        
        this.triangularPrism4 = new HeliTriangularPrism(scene, 2, 1.25, 1.20);
    }

    resetHelicopter() {
        this.position = [0, 0.5, 0];
        this.orientation = 0;
        this.speed = 0;
        this.state = "ground";
        this.upperPropSpeed = 0;
        this.upperPropRotation = 0;
        this.verticalSpeed = 2;
        this.leanAngle = 0;
        this.previousSpeed = 0;
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

    resetLeanAngle() {
        this.leanAngle = 0;
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
                if (Math.abs(this.speed) > 0.01) {
                    this.state = "automatic_braking";
                } else {
                    this.state = "descending_to_lake";
                }
            } else {
                const heliport = this.scene.heliportPosition;
                const dx = heliport[0] - this.position[0];
                const dz = heliport[2] - this.position[2];
                const distance = Math.sqrt(dx * dx + dz * dz);

                if (distance < 0.2) {
                    // Already at heliport — just reorient and land
                    this.state = "reorienting_to_land";
                } else {
                    // If moving, brake first; otherwise, go directly to moving_to_heliport
                    if (Math.abs(this.speed) > 0.01) {
                        this.state = "automatic_braking";
                    } else {
                        this.state = "moving_to_heliport";
                    }
                }
            }
        }
    }

    update(dt) {
        switch (this.state) {
            case "taking_off":
            case "ascending_from_lake":
                if (this.upperPropSpeed >= this.takeOffPropSpeed) {
                    this.position[1] += this.verticalSpeed * this.scene.speedFactor * dt;
                    if (this.position[1] >= this.cruisingAltitude) {
                        this.position[1] = this.cruisingAltitude;
                        this.state = "flying";
                    }
                }
                this.resetLeanAngle();
                break;

            case "flying":
                const vx = this.speed * Math.sin(this.orientation);
                const vz = this.speed * Math.cos(this.orientation);
                this.position[0] += vx * dt;
                this.position[2] += vz * dt;

                // Update the lean angle based on speed
                this.leanAngle = this.speed * this.maxLeanAngle / 10;

                break;

            case "automatic_braking":
                const deceleration = this.scene.deceleration * this.scene.speedFactor * dt;
                if (this.speed > 0) {
                    this.speed = Math.max(this.speed - deceleration, 0);
                } else if (this.speed < 0) {
                    this.speed = Math.min(this.speed + deceleration, 0);
                }
                const vxBrake = this.speed * Math.sin(this.orientation);
                const vzBrake = this.speed * Math.cos(this.orientation);
                this.position[0] += vxBrake * dt;
                this.position[2] += vzBrake * dt;

                this.leanAngle = this.speed * this.maxLeanAngle / 10;

                if (Math.abs(this.speed) < 0.01) {
                    this.speed = 0;
                    if (this.scene.isOverLake(this.position) && this.bucketIsEmpty) {
                        this.state = "descending_to_lake";
                    } else {
                        this.state = "moving_to_heliport";
                    }
                }
                break;

            case "landing":
                this.verticalSpeed = Math.max(this.verticalSpeed - dt * 0.5 * this.scene.speedFactor, 0.5);
                this.position[1] -= this.verticalSpeed * this.scene.speedFactor * dt;
                this.resetLeanAngle();
                if (this.position[1] <= this.groundLevel) {
                    this.position[1] = this.groundLevel;
                    this.state = "ground";
                    this.speed = 0;
                    this.resetVerticalSpeed();
                }
                break;

            case "moving_to_heliport":
                this.targetPosition = this.scene.heliportPosition.slice();
                this.targetPosition[1] = this.cruisingAltitude;

                const dx = this.targetPosition[0] - this.position[0];
                const dz = this.targetPosition[2] - this.position[2];
                const distance = Math.sqrt(dx * dx + dz * dz);
                const targetAngle = Math.atan2(-dx, -dz);

                let angleDiff = targetAngle - this.orientation;
                angleDiff = Math.atan2(Math.sin(angleDiff), Math.cos(angleDiff));

                const turnStep = this.scene.turnSpeed * this.scene.speedFactor * dt;

                if (Math.abs(angleDiff) > 0.05) {
                    // Rotate in place toward heliport, shortest path
                    const turnAmount = Math.sign(angleDiff) * Math.min(Math.abs(angleDiff), turnStep);
                    this.orientation += turnAmount;
                    this.speed = 0;
                    this.resetLeanAngle();
                } else {
                    this.orientation = targetAngle;
                    const targetSpeed = 5 * this.scene.speedFactor;
                    const acceleration = this.scene.acceleration * this.scene.speedFactor * dt;
                    const deceleration = this.scene.deceleration * this.scene.speedFactor * dt;

                    const oldSpeed = this.speed;

                    if (distance > 2) {
                        this.speed = Math.min(this.speed + acceleration, targetSpeed);
                    } else {
                        const speedFactor = distance / 2;
                        const desiredSpeed = targetSpeed * speedFactor;
                        this.speed = Math.max(this.speed - deceleration, desiredSpeed);
                    }

                    const currentAcceleration = (this.speed - oldSpeed) / dt;

                    const leanConstant = this.maxLeanAngle / this.scene.acceleration;
                    const targetLeanAngle = -leanConstant * currentAcceleration;

                    const smoothingFactor = 3;
                    this.leanAngle += (targetLeanAngle - this.leanAngle) * smoothingFactor * dt;

                    this.leanAngle = Math.max(-this.maxLeanAngle, Math.min(this.maxLeanAngle, this.leanAngle));

                    const vx = -this.speed * Math.sin(this.orientation);
                    const vz = -this.speed * Math.cos(this.orientation);
                    this.position[0] += vx * dt;
                    this.position[2] += vz * dt;

                    if (distance < 0.2) {
                        this.position[0] = this.targetPosition[0];
                        this.position[2] = this.targetPosition[2];
                        this.speed = 0;
                    }

                    if (distance < 0.2 && Math.abs(this.leanAngle) < 0.01) {
                        this.state = "reorienting_to_land";
                    }
                }
                break;

            case "reorienting_to_land":
                let reorientAngleDiff = 0 - this.orientation;
                reorientAngleDiff = Math.atan2(Math.sin(reorientAngleDiff), Math.cos(reorientAngleDiff));
        
                const maxTurn = this.scene.turnSpeed * this.scene.speedFactor * dt;
                const turnAmount = Math.sign(reorientAngleDiff) * Math.min(Math.abs(reorientAngleDiff), maxTurn);
        
                this.turn(turnAmount);
        
                if (Math.abs(reorientAngleDiff) < 0.005) {
                    this.orientation = 0;
                    this.state = "landing";
                }
                break;

            case "descending_to_lake":
                this.resetLeanAngle();
                this.position[1] -= this.verticalSpeed * this.scene.speedFactor * dt * 0.4;
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
                this.upperPropSpeed = Math.min(this.upperPropSpeed + dt * 2 * this.scene.speedFactor, this.maxPropSpeed * this.scene.speedFactor);
                break;

            case "flying":
            case "moving_to_heliport":
            case "reorienting_to_land":
                this.upperPropSpeed = this.maxPropSpeed * this.scene.speedFactor;
                break;

            case "landing":
                this.upperPropSpeed = Math.max(this.upperPropSpeed - dt * 2 * this.scene.speedFactor, this.maxPropSpeed * 0.3 * this.scene.speedFactor);
                break;

            case "ground":
                this.upperPropSpeed = Math.max(this.upperPropSpeed - dt * 2 * this.scene.speedFactor, 0);
                break;

            case "automatic_braking":
            case "descending_to_lake":
                this.upperPropSpeed = Math.max(this.upperPropSpeed - dt * 2 * this.scene.speedFactor, this.maxPropSpeed * 0.3 * this.scene.speedFactor);
                break;

            case "filling_bucket":
                this.upperPropSpeed = this.maxPropSpeed * 0.5 * this.scene.speedFactor;
                break;

            default:
                this.upperPropSpeed = 0;
                break;
        }

        // Update the upper propeller rotation
        this.upperPropRotation += this.upperPropSpeed * dt;
        this.upperPropRotation %= 2 * Math.PI;
    }

    display() {
        this.scene.pushMatrix();
        this.scene.scale(6, 6, 6);
        this.scene.translate(this.position[0], this.position[1], this.position[2]);
        this.scene.rotate(this.orientation, 0, 1, 0);
        this.scene.rotate(this.leanAngle, 1, 0, 0);

        this.scene.pushMatrix();
        this.scene.scale(3, 3, 3);
        this.scene.translate(0, 0.6, 0);
        this.scene.rotate(this.upperPropRotation, 0, 1, 0);
        this.upperProp.display();
        this.scene.popMatrix();

        // cockpit
        this.scene.pushMatrix();
        this.scene.translate(-1, 0.6, -0.5);
        this.triangularPrism.display();
        this.scene.popMatrix();
        
        // prism behind cockpit
        this.scene.pushMatrix();
        this.scene.translate(-1, 0.6, -0.5);
        this.rectangularPrism.display();
        this.scene.popMatrix();

        // prism behind the main body
        this.scene.pushMatrix();
        this.scene.translate(0, -0.5, 0);
        this.scene.rotate(Math.PI, 1, 0, 0);
        this.scene.translate(-1, -1.10, -1.5);
        this.triangularPrism4.display();
        this.scene.popMatrix();
        
        // front of the helicopter
        this.scene.pushMatrix();
        this.scene.translate(-1, 0.40, -1.5);
        this.triangularPrismTop.display();
        this.scene.popMatrix();
        
        this.scene.pushMatrix();
        this.scene.translate(-1, -0.1, -2.25);
        this.rectangularPrismMiddle.display();
        this.scene.popMatrix();
        
        this.scene.pushMatrix();
        this.scene.translate(0, -0.5, 0);
        this.scene.rotate(Math.PI, 1, 0, 0);
        this.scene.rotate(Math.PI, 0, 1, 0);
        this.scene.translate(-1, -0.4, -1.5);
        this.triangularPrismBottom.display();
        this.scene.popMatrix();

        this.mainBody.display();
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
