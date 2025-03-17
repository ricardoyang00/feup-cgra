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

        // small triangles
        this.scene.triangleRed = new MyTriangleSmall(this.scene, [0.5,0.5,0.75,0.75,0.25,0.75,0.5,0.5,0.75,0.75,0.25,0.75]);
        this.scene.trianglePink = new MyTriangleSmall(this.scene, [0.5,1,0,0.5,0,1,0.5,1,0,0.5,0,1]);
        this.scene.trianglePurple = new MyTriangleSmall(this.scene, [0,0,0,0.5,0.25,0.25,0,0,0,0.5,0.25,0.25]);

        // big triangles
        this.scene.triangleBlue = new MyTriangleBig(this.scene, [1,0,0.5,0.5,0,0,1,0,0.5,0.5,0,0]);
        this.scene.triangleOrange = new MyTriangleBig(this.scene, [1,1,1,0,0.5,0.5,1,1,1,0,0.5,0.5]);

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

        this.textureMaterial = new CGFappearance(this.scene);
        this.textureMaterial.setAmbient(0.1, 0.1, 0.1, 1);
        this.textureMaterial.setDiffuse(0.9, 0.9, 0.9, 1);
        this.textureMaterial.setSpecular(0.1, 0.1, 0.1, 1);
        this.textureMaterial.setShininess(100.0);
        this.textureMaterial.loadTexture('images/tangram.png');
    }

    display() {
        this.scene.pushMatrix();
        this.textureMaterial.apply();       // texture
        this.scene.translate(3, 0, 0);
        this.scene.diamond.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.yellowMaterial.apply();        // yellow
        this.textureMaterial.apply();       // texture
        this.scene.rotate(Math.PI, 0, 1, 0);
        this.scene.translate(1, -1, 0);
        this.scene.parallelogram.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.redMaterial.apply();           // red
        this.textureMaterial.apply();       // texture
        this.scene.translate(4, -1, 0);
        this.scene.triangleRed.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.purpleMaterial.apply();        // purple
        this.textureMaterial.apply();       // texture
        this.scene.rotate(Math.PI, 0, 0, 1);
        this.scene.translate(1, 0, 0);
        this.scene.trianglePurple.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.pinkMaterial.apply();          // pink
        this.textureMaterial.apply();       // texture
        this.scene.translate(-4.5, -1, 0);
        this.scene.scale(1.5, 1.5, 1);
        this.scene.trianglePink.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.blueMaterial.apply();          // blue
        this.textureMaterial.apply();       // texture
        this.scene.translate(1, -1, 0);
        this.scene.triangleBlue.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.orangeMaterial.apply();        // orange
        this.textureMaterial.apply();       // texture
        this.scene.translate(-2, 0, 0);
        this.scene.triangleOrange.display();
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