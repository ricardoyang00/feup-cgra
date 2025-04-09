import { CGFobject } from '../lib/CGF.js';
import { MyUnitCubeQuad } from './MyUnitCubeQuad.js';

export class MyBuilding extends CGFobject {
    constructor(scene, totalWidth, numFloorsSide, buildingColor) {
        super(scene);

        this.totalWidth = totalWidth;
        this.numFloorsSide = numFloorsSide;
        this.numFloorsCentral = numFloorsSide + 1; // Central module has one more floor
        this.buildingColor = buildingColor;

        // Calculate module dimensions
        this.centralWidth = totalWidth / 3; // Central module width
        this.sideWidth = this.centralWidth * 0.75; // Side modules are 75% of central module width

        // Create modules
        this.sideModule = new MyUnitCubeQuad(scene, buildingColor);
        this.centralModule = new MyUnitCubeQuad(scene, buildingColor);
    }

    display() {
        const floorHeight = 1; // Height of each floor
    
        // Display the central module
        this.scene.pushMatrix();
        this.scene.translate(
            0, 
            - this.centralWidth / 2,
            (this.numFloorsCentral * floorHeight) / 2
        ); 
        this.scene.scale(this.centralWidth, this.centralWidth, this.numFloorsCentral * floorHeight);
        this.centralModule.display();
        this.scene.popMatrix();
    
        // Display the left side module
        this.scene.pushMatrix();
        this.scene.translate(
            -(this.centralWidth + this.sideWidth) / 2,
            - this.sideWidth / 2,
            (this.numFloorsSide * floorHeight) / 2
        ); 
        this.scene.scale(this.sideWidth, this.sideWidth, this.numFloorsSide * floorHeight);
        this.sideModule.display();
        this.scene.popMatrix();
    
        // Display the right side module
        this.scene.pushMatrix();
        this.scene.translate(
            (this.centralWidth + this.sideWidth) / 2,
            - this.sideWidth / 2,
            (this.numFloorsSide * floorHeight) / 2
        ); 
        this.scene.scale(this.sideWidth, this.sideWidth, this.numFloorsSide * floorHeight);
        this.sideModule.display();
        this.scene.popMatrix();
    }
}