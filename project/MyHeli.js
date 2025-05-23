import { CGFobject, CGFtexture } from '../lib/CGF.js';
import { HeliPropeller } from './HeliPropeller.js';
import { HeliBucket } from './HeliBucket.js';
import { HeliBodyCore } from './HeliBodyCore.js';
import { HeliBodyOuter } from './HeliBodyOuter.js';
import { HeliTail } from './HeliTail.js';
import { HeliLandingSkids } from './HeliLandingSkids.js';
import { MyCircle } from './primitives/MyCircle.js';
import { MyQuad } from './primitives/MyQuad.js';

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
        this.cruisingAltitude = 12;
        this.groundLevel = 1;
        this.verticalSpeed = 2;
        this.targetPosition = null; // position to automatically fly to
        this.bucketIsEmpty = true;
        this.bucketRelativePosition;

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
            hubThickness: 0.06,
            bladeLength: 1,
            bladeWidth: 0.06,
            bladeThickness: 0.01,
            bladeOffset: 0.1
        });
        this.rearProp = new HeliPropeller(scene, {
            bladeCount: 3,
            hubRadius: 0.06,
            hubThickness: 0.02,
            bladeLength: 0.4,
            bladeWidth: 0.03,
            bladeThickness: 0.01,
            bladeOffset: 0.05
        });

        this.initialRopeLength = 0.5;
        
        this.bucket = new HeliBucket(scene, {
            ropeLength: this.initialRopeLength,
            bucketRadius: 0.3,
            bucketHeight: 0.5,
            bucketThickness: 0.01,
            numSecondaryRopes: 4,
        });

        this.bucketReleaseSpeed = 0.5;
        this.bucketOffset = this.bucket.bucketHeight * 2;
        this.bucketInitialY = this.cruisingAltitude - 0.5 - this.bucketOffset;
        this.bucketMaxExtendedY = this.cruisingAltitude - 2 - this.bucketOffset;
        this.bucketTouchWaterY = this.bucketMaxExtendedY - 15 - this.bucket.bucketHeight * 3; // 3 because of the bucker scale

        this.redMetalTexture = new CGFtexture(scene, 'textures/helicopter/red_metal.jpg');
        this.bodyCore = new HeliBodyCore(scene, 2, 3, 1.2, [0.5, 0.5, 0.5, 1], this.redMetalTexture);
        this.bodyOuter = new HeliBodyOuter(scene);
        this.tail = new HeliTail(scene);
        this.landingSkids = new HeliLandingSkids(scene);

        this.waterTexture = new CGFtexture(scene, "textures/lake/water.jpg");
        this.waterCircle = new MyCircle(scene, 16);
    }

    getWorldPosition() {
        const scaleFactor = 0.22 * 6; // Combined scaling from MyScene and MyHeli
        const baseHeight = 15.1;
        const x_world = scaleFactor * this.position[2];
        const y_world = scaleFactor * this.position[1] + baseHeight;
        const z_world = -scaleFactor * this.position[0];
        return [x_world, y_world, z_world];
    }

    resetHelicopter() {
        this.position = [0, 1, 0];
        this.orientation = 0;
        this.speed = 0;
        this.state = "ground";
        this.upperPropSpeed = 0;
        this.upperPropRotation = 0;
        this.verticalSpeed = 2;
        this.leanAngle = 0;
        this.previousSpeed = 0;

        this.bucket.setVisible(false);
        this.bucket.setRopeLength(this.initialRopeLength);
        this.bucket.setPosition(
            this.position[0],
            this.bucketInitialY,
            this.position[2]
        );
    }

    turn(v) {
        this.orientation += v;
    }

    accelerate(v) {
        const maxSpeed = 12 * this.scene.speedFactor;
        this.speed += v;
        if (this.speed > maxSpeed) {
            this.speed = maxSpeed;
        } else if (this.speed < -maxSpeed) {
            this.speed = -maxSpeed;
        }
    }

    resetVerticalSpeed() {
        this.verticalSpeed = 2;
    }

    resetLeanAngle() {
        this.leanAngle = 0;
    }

    getBucketIsEmpty() {
        return this.bucketIsEmpty;
    }

    setBucketEmpty() {
        this.bucketIsEmpty = true;
    }

    bucketFollowMovement() {
        this.bucket.setPosition(
            this.position[0],
            this.bucket.position[1],
            this.position[2]
        );
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
            const worldPosition = this.getWorldPosition();
            if (this.scene.isOverLake(worldPosition) && this.bucketIsEmpty) {
                if (Math.abs(this.speed) > 0.01) {
                    this.state = "automatic_braking";
                } else {
                    this.state = "descending_to_lake";
                }
            } else {
                const heliport = this.scene.heliportPosition;
                const dx = heliport[0] - worldPosition[0];
                const dz = heliport[2] - worldPosition[2];
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
        this.bucket.update(dt);
        //console.log("HELI STATE: " + this.state, "ORIENTATION: " + this.orientation);
        switch (this.state) {
            case "taking_off":
                if (this.upperPropSpeed >= this.takeOffPropSpeed) {
                    this.position[1] += this.verticalSpeed * this.scene.speedFactor * dt;
                    if (this.position[1] >= this.cruisingAltitude) {
                        this.position[1] = this.cruisingAltitude;
                        this.bucket.setVisible(true);
                        this.bucket.setRopeLength(this.initialRopeLength);
                        this.bucket.setPosition(
                            this.position[0],
                            this.bucketInitialY,
                            this.position[2]
                        );
                        this.state = "releasing_bucket";
                    }
                }
                break;

            case "releasing_bucket":
                const deltaLength = this.bucketReleaseSpeed * this.scene.speedFactor * dt;
                const newRopeLength = this.bucket.ropeLength + deltaLength;
                const newBucketY = this.bucketInitialY - newRopeLength;
            
                if (newBucketY > this.bucketMaxExtendedY) {
                    this.bucket.setRopeLength(newRopeLength + 0.7);
                    this.bucket.setPosition(
                        this.bucket.position[0],
                        newBucketY,
                        this.bucket.position[2]
                    );
                } else {
                    this.bucketRelativePosition = this.bucket.position[1];
                    this.state = "flying";
                }
                break;

            case "ascending_from_lake":
                if (this.upperPropSpeed  >= this.takeOffPropSpeed) {
                    const yChange = this.verticalSpeed * this.scene.speedFactor * dt;
                    this.position[1] += yChange;
                    this.bucket.position[1] += yChange;
                    if (this.position[1] >= this.cruisingAltitude) {
                        this.position[1] = this.cruisingAltitude;
                        this.bucket.position[1] = this.bucketRelativePosition;
                        this.state = "flying";
                    }
                }
                this.resetLeanAngle();
                this.bucketFollowMovement();
                break;

            case "flying":
                const vx = this.speed * Math.sin(this.orientation);
                const vz = this.speed * Math.cos(this.orientation);
                this.position[0] += vx * dt;
                this.position[2] += vz * dt;
                
                // Update the lean angle based on speed
                const maxSpeed1 = 12 * this.scene.speedFactor;
                this.leanAngle = (this.speed / maxSpeed1) * this.maxLeanAngle;
                this.leanAngle = Math.max(-this.maxLeanAngle, Math.min(this.maxLeanAngle, this.leanAngle));

                this.bucketFollowMovement();
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
                this.bucketFollowMovement();

                const maxSpeed2 = 12 * this.scene.speedFactor;
                this.leanAngle = (this.speed / maxSpeed2) * this.maxLeanAngle;
                this.leanAngle = Math.max(-this.maxLeanAngle, Math.min(this.maxLeanAngle, this.leanAngle));

                if (Math.abs(this.speed) < 0.01) {
                    this.speed = 0;
                    if (this.scene.isOverLake(this.getWorldPosition()) && this.bucketIsEmpty) {
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

                if (Math.abs(angleDiff) > 0.05 && distance > 0.5) {
                    // Rotate in place toward heliport, shortest path
                    const turnAmount = Math.sign(angleDiff) * Math.min(Math.abs(angleDiff), turnStep);
                    this.orientation += turnAmount;
                    this.bucketFollowMovement();
                    this.speed = 0;
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
                    this.bucketFollowMovement();

                    if (distance <= 0.5) {
                        this.position[0] = this.targetPosition[0];
                        this.position[2] = this.targetPosition[2];
                        this.speed = 0;
                    }

                    if (this.speed === 0) {
                        this.state = "reorienting_to_land";
                    }
                }
                break;

            case "reorienting_to_land":
                let reorientAngleDiff = 0 - this.orientation;
                reorientAngleDiff = Math.atan2(Math.sin(reorientAngleDiff), Math.cos(reorientAngleDiff));
        
                const maxTurn = this.scene.turnSpeed * this.scene.speedFactor * dt;
                
                if (Math.abs(reorientAngleDiff) > 0.01) {
                    const turnAmount = Math.sign(reorientAngleDiff) * Math.min(Math.abs(reorientAngleDiff), maxTurn);
                    this.turn(turnAmount);
                    this.bucketFollowMovement();
                } else {
                    this.orientation = 0;
                    this.state = "retracting_bucket";
                }
                break;

            case "retracting_bucket":
                const retractDeltaLength = this.bucketReleaseSpeed * this.scene.speedFactor * dt;
                const retractNewRopeLength = this.bucket.ropeLength - retractDeltaLength;
                const retractNewBucketY = this.bucket.position[1] + retractDeltaLength;
            
                if (retractNewBucketY < this.bucketInitialY) {
                    this.bucket.setRopeLength(retractNewRopeLength);
                    this.bucket.setPosition(
                        this.bucket.position[0],
                        retractNewBucketY,
                        this.bucket.position[2]
                    );
                } else {
                    this.bucket.setRopeLength(this.initialRopeLength);
                    this.bucket.setPosition(
                        this.position[0],
                        this.bucketInitialY,
                        this.position[2]
                    );
                    this.bucket.setVisible(false);
                    this.state = "landing";
                }
                break;

            case "descending_to_lake":
                this.resetLeanAngle();
                if (this.bucket.position[1] > this.bucketTouchWaterY) {
                    const yChange = this.verticalSpeed * this.scene.speedFactor * dt * 0.8;
                    this.position[1] -= yChange;
                    this.bucket.setPosition(
                        this.bucket.position[0],
                        this.bucket.position[1] - yChange,
                        this.bucket.position[2]
                    );
                } else {
                    this.state = "filling_bucket";
                }
                break;

            case "filling_bucket":
                this.bucketIsEmpty = false;
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
            case "releasing_bucket":
            case "retracting_bucket":
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
        this.scene.translate(0, 0.8, 0.17);
        this.scene.rotate(this.upperPropRotation, 0, 1, 0);
        this.upperProp.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.scale(1.5, 1.5, 1.5);
        this.scene.rotate(Math.PI / 2, 0, 0, 1);
        this.scene.translate(1.01, -0.17, 4.72);
        this.scene.rotate(this.upperPropRotation, 0, 1, 0);
        this.rearProp.display();
        this.scene.popMatrix();

        this.bodyOuter.display();
        this.tail.display();
        this.landingSkids.display();
        this.bodyCore.display();

        this.scene.pushMatrix();
        this.scene.scale(3, 3, 3);
        if (this.bucket.visible) {
            this.scene.translate(
                this.bucket.position[0] - this.position[0],
                this.bucket.position[1] - this.position[1],
                this.bucket.position[2] - this.position[2]
            );
            this.bucket.display();

            //if (this.state === "flying") {
            if (!this.bucketIsEmpty) {
                this.scene.pushMatrix();
                this.scene.translate(0, this.bucket.bucketHeight / 1.5, 0);
                const waterCircleScale = 0.92;
                this.scene.scale(this.bucket.bucketRadius * waterCircleScale, 1, this.bucket.bucketRadius * waterCircleScale);
                this.scene.rotate(this.leanAngle * 0.5, 1, 0, 0);
                this.scene.rotate(-Math.PI / 2, 1, 0, 0);
                this.scene.setActiveShader(this.scene.waterShader);
                this.waterTexture.bind(0);
                this.scene.gl.texParameteri(this.scene.gl.TEXTURE_2D, this.scene.gl.TEXTURE_WRAP_S, this.scene.gl.REPEAT);
                this.scene.gl.texParameteri(this.scene.gl.TEXTURE_2D, this.scene.gl.TEXTURE_WRAP_T, this.scene.gl.REPEAT);
                this.waterCircle.display();
                this.scene.setActiveShader(this.scene.defaultShader);
                this.scene.popMatrix();
            }
        }
        this.scene.popMatrix();

        this.scene.popMatrix();
    }
}
