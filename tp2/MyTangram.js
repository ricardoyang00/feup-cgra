import {CGFobject} from '../lib/CGF.js';
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
		this.initBuffers();

        this.scene.diamond = new MyDiamond(this.scene);
        this.scene.parallelogram = new MyParallelogram(this.scene);
        this.scene.triangleSmall = new MyTriangleSmall(this.scene);
        this.scene.triangleBig = new MyTriangleBig(this.scene);
	}

    display() {
        this.scene.pushMatrix();
        this.scene.setDiffuse(0, 1, 0, 1);  // green
        this.scene.translate(3, 0, 0);
        this.scene.diamond.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.setDiffuse(1, 1, 0, 1);  // yellow
        this.scene.rotate(Math.PI, 0, 1, 0);
        this.scene.translate(1, -1, 0);
        this.scene.parallelogram.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.setDiffuse(1, 0, 0, 1);  // red
        this.scene.translate(4, -1, 0);
        this.scene.triangleSmall.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.setDiffuse(0.5, 0, 0.5, 1);  // purple
        this.scene.rotate(Math.PI, 0, 0, 1);
        this.scene.translate(1, 0, 0);
        this.scene.triangleSmall.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.setDiffuse(1, 0.75, 0.8, 1);  // pink
        this.scene.translate(-4.5, -1, 0);
        this.scene.scale(1.5, 1.5, 1);
        this.scene.triangleSmall.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.setDiffuse(0, 0, 1, 1);  // blue
        this.scene.translate(1, -1, 0);
        this.scene.triangleBig.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.setDiffuse(1, 0.5, 0, 1);  // orange
        this.scene.translate(-2, 0, 0);
        this.scene.triangleBig.display();
        this.scene.popMatrix();
    };
}