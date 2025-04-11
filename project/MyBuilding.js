import { CGFobject, CGFtexture, CGFappearance } from '../lib/CGF.js';
import { MyUnitCubeQuad } from './MyUnitCubeQuad.js';
import { MyQuad } from './MyQuad.js';
import { MyWindow } from './MyWindow.js';

export class MyBuilding extends CGFobject {
    constructor(scene, totalWidth, totalDepth, numFloorsSide, numWindowsPerFloor, windowType, buildingColor) {
        super(scene);

        this.totalWidth = totalWidth;
        this.totalDepth = totalDepth;
        this.numFloorsSide = numFloorsSide;
        this.numFloorsCentral = numFloorsSide + 1; // Central module has one more floor
        this.numWindowsPerFloor = numWindowsPerFloor;
        this.windowType = windowType;
        this.buildingColor = buildingColor;

        // Calculate module dimensions
        this.floorHeight = 1;
        this.centralWidth = totalWidth / 3;
        this.centralDepth = totalDepth / 3;
        this.sideWidth = this.centralWidth * 0.75;
        this.sideDepth = this.centralDepth * 0.75;

        // Create building texture
        this.brickTexture = new CGFtexture(scene, 'textures/brick.jpg');

        // Create modules
        this.sideModule = new MyUnitCubeQuad(scene, buildingColor, this.brickTexture);
        this.centralModule = new MyUnitCubeQuad(scene, buildingColor, this.brickTexture);

        // Create heliport
        this.heliportTexture = new CGFtexture(scene, 'textures/heliport.png');
        this.heliport = new MyQuad(scene);

        // Create windows
        this.window = new MyWindow(scene, windowType);

        // Create door
        this.doorTexture = new CGFtexture(scene, 'textures/door.jpg');
        this.door = new MyQuad(scene);

        // Create sign
        this.signTexture = new CGFtexture(scene, 'textures/firefighter.jpg');
        this.sign = new MyQuad(scene);
    }

    display() {
        const centralModuleX = 0;
        const leftModuleX = -(this.centralWidth + this.sideWidth) / 2;
        const rightModuleX = (this.centralWidth + this.sideWidth) / 2;

        // Display building components
        this.displayModule(centralModuleX, this.centralWidth, this.centralDepth, this.numFloorsCentral, this.centralModule);
        this.displayModule(leftModuleX, this.sideWidth, this.sideDepth, this.numFloorsSide, this.sideModule, true, false);
        this.displayModule(rightModuleX, this.sideWidth, this.sideDepth, this.numFloorsSide, this.sideModule, false, true);

        // Display heliport
        this.displayHeliport();

        // Display sign
        this.displaySign();

        // Display door
        this.displayDoor();

        // Display windows
        this.displayWindows(centralModuleX, this.numFloorsCentral, this.centralWidth, this.centralDepth, true);
        this.displayWindows(leftModuleX, this.numFloorsSide, this.sideWidth, this.sideDepth, false);
        this.displayWindows(rightModuleX, this.numFloorsSide, this.sideWidth, this.sideDepth, false);
    }

    displayModule(xOffset, width, depth, numFloors, module, skipRight = false, skipLeft = false) {
        this.scene.pushMatrix();
        this.scene.translate(
            xOffset,
            - depth / 2,
            (numFloors * this.floorHeight) / 2
        );
        this.scene.scale(width, depth, numFloors * this.floorHeight);
        module.display(skipRight, skipLeft);
        this.scene.popMatrix();
    }

    displayHeliport() {
        this.scene.pushMatrix();
        this.scene.translate(
            0,
            -this.centralDepth / 2,
            (this.numFloorsCentral * this.floorHeight) + 0.01
        );
        this.scene.scale(2, 2, 1);
        this.heliportTexture.bind();
        this.heliport.display();
        this.heliportTexture.unbind();
        this.scene.popMatrix();
    }

    displaySign() {
        this.scene.pushMatrix();
        this.scene.translate(
            0,
            -this.centralDepth - 0.01,
            this.floorHeight / 2 + 0.5
        );
        this.scene.scale(1, 1, 0.2);
        this.scene.rotate(Math.PI / 2, 1, 0, 0);
        this.signTexture.bind();
        this.sign.display();
        this.signTexture.unbind();
        this.scene.popMatrix();
    }

    displayDoor() {
        this.scene.pushMatrix();
        this.scene.translate(
            0,
            - this.centralDepth - 0.01,
            this.floorHeight / 2 - 0.12 // Adjusted to align the bottom of the door
        );
        const doorAspectRatio = 612 / 408; // Aspect ratio of the door texture
        this.scene.scale(doorAspectRatio, 1, 0.75);
        this.scene.rotate(Math.PI / 2, 1, 0, 0);
        this.doorTexture.bind();
        this.door.display();
        this.doorTexture.unbind();
        this.scene.popMatrix();
    }

    displayWindows(xOffset, numFloors, moduleWidth, moduleDepth, isCentralModule) {
        const windowSpacing = moduleWidth / (this.numWindowsPerFloor + 1); // Spacing between windows

        for (let floor = 0; floor < numFloors; floor++) {
            // Skip the first floor for the central module
            if (isCentralModule && floor === 0) {
                continue;
            }
            for (let i = 1; i <= this.numWindowsPerFloor; i++) {
                this.scene.pushMatrix();
                this.scene.translate(
                    xOffset - moduleWidth / 2 + i * windowSpacing, // Position windows along the width
                    - moduleDepth - 0.01, // Position windows along the depth
                    floor * this.floorHeight + this.floorHeight / 2 // Position windows at the center of each floor
                );
                this.scene.rotate(Math.PI / 2, 1, 0, 0);
                this.scene.scale(0.5, 0.5, 0.1);
                this.window.display();
                this.scene.popMatrix();
            }
        }
    }
}