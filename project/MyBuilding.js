import { CGFobject, CGFtexture } from '../lib/CGF.js';
import { MyUnitCubeQuad } from './MyUnitCubeQuad.js';
import { MyQuad } from './MyQuad.js';

export class MyBuilding extends CGFobject {
    constructor(scene, totalWidth, totalDepth, numFloorsSide, buildingColor) {
        super(scene);

        this.totalWidth = totalWidth;
        this.totalDepth = totalDepth;
        this.numFloorsSide = numFloorsSide;
        this.numFloorsCentral = numFloorsSide + 1; // Central module has one more floor
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
    }

    display() {
        const floorHeight = 1; // Height of each floor
    
        // Display the central module
        this.scene.pushMatrix();
        this.scene.translate(
            0, 
            - this.centralDepth / 2,
            (this.numFloorsCentral * floorHeight) / 2
        ); 
        this.scene.scale(this.centralWidth, this.centralDepth, this.numFloorsCentral * floorHeight);
        this.centralModule.display();
        this.scene.popMatrix();
    
        // Display the left side module
        this.scene.pushMatrix();
        this.scene.translate(
            -(this.centralWidth + this.sideWidth) / 2,
            - this.sideDepth / 2,
            (this.numFloorsSide * floorHeight) / 2
        ); 
        this.scene.scale(this.sideWidth, this.sideDepth, this.numFloorsSide * floorHeight);
        this.sideModule.display();
        this.scene.popMatrix();
    
        // Display the right side module
        this.scene.pushMatrix();
        this.scene.translate(
            (this.centralWidth + this.sideWidth) / 2,
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
    }
}