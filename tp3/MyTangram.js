import {CGFobject, CGFappearance} from '../lib/CGF.js';
import { MyDiamond } from "./MyDiamond.js";
import { MyParallelogram } from "./MyParallelogram.js";
import { MyTriangleSmall } from "./MyTriangleSmall.js";
import { MyTriangleBig } from "./MyTriangleBig.js";

/**
 * MyTangram
 * @constructor
 * @param scene - Reference to MyScene object
 */
export class MyTangram extends CGFobject {
	constructor(scene) {
		super(scene);

        this.scene.diamond = new MyDiamond(this.scene);
        this.scene.parallelogram = new MyParallelogram(this.scene);
        this.scene.triangleSmall = new MyTriangleSmall(this.scene);
        this.scene.triangleBig = new MyTriangleBig(this.scene);

        this.initMaterials();
	}

    initMaterials() {
        // materials for the pieces
        this.greenMaterial = new CGFappearance(this.scene);
        this.greenMaterial.setAmbient(0, 1, 0, 1);
        this.greenMaterial.setDiffuse(0, 1, 0, 1);
        this.greenMaterial.setSpecular(1, 1, 1, 1);
        this.greenMaterial.setShininess(100.0);

        this.yellowMaterial = new CGFappearance(this.scene);
        this.yellowMaterial.setAmbient(1, 1, 0, 1);
        this.yellowMaterial.setDiffuse(1, 1, 0, 1);
        this.yellowMaterial.setSpecular(1, 1, 1, 1);
        this.yellowMaterial.setShininess(100.0);

        this.redMaterial = new CGFappearance(this.scene);
        this.redMaterial.setAmbient(1, 0, 0, 1);
        this.redMaterial.setDiffuse(1, 0, 0, 1);
        this.redMaterial.setSpecular(1, 1, 1, 1);
        this.redMaterial.setShininess(100.0);

        this.purpleMaterial = new CGFappearance(this.scene);
        this.purpleMaterial.setAmbient(0.5, 0, 0.5, 1);
        this.purpleMaterial.setDiffuse(0.5, 0, 0.5, 1);
        this.purpleMaterial.setSpecular(1, 1, 1, 1);
        this.purpleMaterial.setShininess(100.0);

        this.pinkMaterial = new CGFappearance(this.scene);
        this.pinkMaterial.setAmbient(1, 0.75, 0.8, 1);
        this.pinkMaterial.setDiffuse(1, 0.75, 0.8, 1);
        this.pinkMaterial.setSpecular(1, 1, 1, 1);
        this.pinkMaterial.setShininess(100.0);

        this.blueMaterial = new CGFappearance(this.scene);
        this.blueMaterial.setAmbient(0, 0, 1, 1);
        this.blueMaterial.setDiffuse(0, 0, 1, 1);
        this.blueMaterial.setSpecular(1, 1, 1, 1);
        this.blueMaterial.setShininess(100.0);

        this.orangeMaterial = new CGFappearance(this.scene);
        this.orangeMaterial.setAmbient(1, 0.5, 0, 1);
        this.orangeMaterial.setDiffuse(1, 0.5, 0, 1);
        this.orangeMaterial.setSpecular(1, 1, 1, 1);
        this.orangeMaterial.setShininess(100.0);
    }

    display() {
        this.scene.pushMatrix();
        this.scene.customMaterial.apply();  // custom
        this.scene.translate(3, 0, 0);
        this.scene.diamond.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.yellowMaterial.apply();        // yellow
        this.scene.rotate(Math.PI, 0, 1, 0);
        this.scene.translate(1, -1, 0);
        this.scene.parallelogram.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.redMaterial.apply();           // red
        this.scene.translate(4, -1, 0);
        this.scene.triangleSmall.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.purpleMaterial.apply();        // purple
        this.scene.rotate(Math.PI, 0, 0, 1);
        this.scene.translate(1, 0, 0);
        this.scene.triangleSmall.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.pinkMaterial.apply();          // pink
        this.scene.translate(-4.5, -1, 0);
        this.scene.scale(1.5, 1.5, 1);
        this.scene.triangleSmall.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.blueMaterial.apply();          // blue
        this.scene.translate(1, -1, 0);
        this.scene.triangleBig.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.orangeMaterial.apply();        // orange
        this.scene.translate(-2, 0, 0);
        this.scene.triangleBig.display();
        this.scene.popMatrix();
    };


    enableNormalViz() {
        this.scene.diamond.enableNormalViz();
        this.scene.parallelogram.enableNormalViz();
        this.scene.triangleSmall.enableNormalViz();
        this.scene.triangleBig.enableNormalViz();
    }

    disableNormalViz() {
        this.scene.diamond.disableNormalViz();
        this.scene.parallelogram.disableNormalViz();
        this.scene.triangleSmall.disableNormalViz();
        this.scene.triangleBig.disableNormalViz();
    }

}