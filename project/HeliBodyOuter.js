import { CGFobject } from '../lib/CGF.js';
import { HeliBodyRectangularPrism } from './HeliBodyRectangularPrism.js';
import { HeliBodyTriangularPrism } from './HeliBodyTriangularPrism.js';
import { HeliPropellerSupport } from './HeliPropellerSupport.js';

export class HeliBodyOuter extends CGFobject {
    constructor(scene) {
        super(scene);

        this.cockpit = new HeliBodyTriangularPrism(scene, 2, 1, 1);
        this.backOfCockpit = new HeliBodyRectangularPrism(scene, 2, 3.25, 1);
        this.backOfMainBody = new HeliBodyTriangularPrism(scene, 2, 1.25, 1.20);

        this.headTop = new HeliBodyTriangularPrism(scene, 2, 0.75, 0.2);
        this.headMiddle = new HeliBodyRectangularPrism(scene, 2, 0.75, 0.5);
        this.headBottom = new HeliBodyTriangularPrism(scene, 2, 0.75, 0.5);

        this.support = new HeliPropellerSupport(scene);
    }

    display() {
        // Display the cockpit
        this.scene.pushMatrix();
        this.scene.translate(-1, 0.6, -0.5);
        this.cockpit.display();
        this.scene.popMatrix();
        
        // Display back of cockpit
        this.scene.pushMatrix();
        this.scene.translate(-1, 0.6, -0.5);
        this.backOfCockpit.display();
        this.scene.popMatrix();

        // Display the upper propeller support
        this.scene.pushMatrix();
        this.support.display();
        this.scene.popMatrix();

        // Display back of main body
        this.scene.pushMatrix();
        this.scene.translate(0, -0.5, 0);
        this.scene.rotate(Math.PI, 1, 0, 0);
        this.scene.translate(-1, -1.10, -1.5);
        this.backOfMainBody.display();
        this.scene.popMatrix();
        
        // Display the front of the helicopter
        this.scene.pushMatrix();
        this.scene.translate(-1, 0.40, -1.5);
        this.headTop.display();
        this.scene.popMatrix();
        
        this.scene.pushMatrix();
        this.scene.translate(-1, -0.1, -2.25);
        this.headMiddle.display();
        this.scene.popMatrix();
        
        this.scene.pushMatrix();
        this.scene.translate(0, -0.5, 0);
        this.scene.rotate(Math.PI, 1, 0, 0);
        this.scene.rotate(Math.PI, 0, 1, 0);
        this.scene.translate(-1, -0.4, -1.5);
        this.headBottom.display();
        this.scene.popMatrix();
    }
}