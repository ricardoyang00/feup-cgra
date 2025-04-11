import { CGFobject, CGFtexture } from '../lib/CGF.js';
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
        this.centralWidth = totalWidth / 3;
        this.centralDepth = totalDepth / 3;
        this.sideWidth = this.centralWidth * 0.75;
        this.sideDepth = this.centralDepth * 0.75;

        // Create modules
        this.sideModule = new MyUnitCubeQuad(scene, buildingColor);
        this.centralModule = new MyUnitCubeQuad(scene, buildingColor);

        // Create heliport
        this.heliportTexture = new CGFtexture(scene, 'textures/heliport.png');
        this.heliportQuad = new MyQuad(scene);

        // Create windows
        this.window = new MyWindow(scene, windowType);
    }

    display() {
        const floorHeight = 1; // Height of each floor
        
        const centralMooduleX = 0;
        const leftModuleX = -(this.centralWidth + this.sideWidth) / 2;
        const rightModuleX = (this.centralWidth + this.sideWidth) / 2;

        // Display the central module
        this.scene.pushMatrix();
        this.scene.translate(
            centralMooduleX, 
            - this.centralDepth / 2,
            (this.numFloorsCentral * floorHeight) / 2
        ); 
        this.scene.scale(this.centralWidth, this.centralDepth, this.numFloorsCentral * floorHeight);
        this.centralModule.display();
        this.scene.popMatrix();
    
        // Display the left side module
        this.scene.pushMatrix();
        this.scene.translate(
            leftModuleX,
            - this.sideDepth / 2,
            (this.numFloorsSide * floorHeight) / 2
        ); 
        this.scene.scale(this.sideWidth, this.sideDepth, this.numFloorsSide * floorHeight);
        this.sideModule.display();
        this.scene.popMatrix();
    
        // Display the right side module
        this.scene.pushMatrix();
        this.scene.translate(
            rightModuleX,
            - this.sideDepth / 2,
            (this.numFloorsSide * floorHeight) / 2
        ); 
        this.scene.scale(this.sideWidth, this.sideDepth, this.numFloorsSide * floorHeight);
        this.sideModule.display();
        this.scene.popMatrix();

        // Display the heliport on top of the central module
        this.scene.pushMatrix();
        this.scene.translate(
            0, 
            - this.centralDepth / 2,
            (this.numFloorsCentral * floorHeight) + 0.01
        );
        this.scene.scale(2, 2, 1);
        this.heliportTexture.bind();
        this.heliportQuad.display();
        this.heliportTexture.unbind();
        this.scene.popMatrix();

        // Display windows on the central module
        this.displayWindows(floorHeight, centralMooduleX, this.numFloorsCentral, this.centralWidth, this.centralDepth, true);

        // Display windows on the left side module
        this.displayWindows(floorHeight, leftModuleX, this.numFloorsSide, this.sideWidth, this.sideDepth, false);

        // Display windows on the right side module
        this.displayWindows(floorHeight, rightModuleX, this.numFloorsSide, this.sideWidth, this.sideDepth, false);
    }

    displayWindows(floorHeight, xOffset, numFloors, moduleWidth, moduleDepth, isCentralModule) {
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
                    floor * floorHeight + floorHeight / 2 // Position windows at the center of each floor
                );
                this.scene.rotate(Math.PI / 2, 1, 0, 0);
                this.scene.scale(0.5, 0.5, 0.1);
                this.window.display();
                this.scene.popMatrix();
            }
        }
    }
}