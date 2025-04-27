import { CGFobject } from '../lib/CGF.js';
import { HeliTailCuttablePyramid } from './HeliTailCuttablePyramid.js';
import { HeliBodyRectangularPrism } from './HeliBodyRectangularPrism.js';
import { MyCylinder } from './MyCylinder.js';

export class HeliTail extends CGFobject {
    constructor(scene) {
        super(scene);

        // Main tail
        this.mainTail = new HeliTailCuttablePyramid(scene, 2, 1, 4, 2.5);

        // Calculate dimensions for the secondary tail
        const u = (4 - 2.5) / 4; // u = 0.375
        const width = 2 * u;  // mainTail TopWidth = 0.75
        const depth = 1 * u;  // mainTail TopDepth = 0.375

        // Secondary tail
        this.secondaryTail = new HeliTailCuttablePyramid(scene, width, depth, 3, 2);

        this.tailDetailMain = new HeliBodyRectangularPrism(scene, 2, 0.35, 0.1);
        this.tailDetailLeft = new HeliBodyRectangularPrism(scene, 0.5, 0.35, 0.1);
        this.tailDetailRight = new HeliBodyRectangularPrism(scene, 0.5, 0.35, 0.1);
        this.tailProppellerSupport = new MyCylinder(scene, 12, 1, [1, 1, 1, 1], null, true, false);
    }

    display() {
        // Display the main tail
        this.scene.pushMatrix();
        this.scene.translate(0, -1, 0);
        this.scene.rotate(Math.PI, 1, 0, 0);
        this.scene.rotate(Math.PI, 0, 1, 0);
        this.scene.translate(-1, -2.60, 2.75);
        this.mainTail.display();
        this.scene.popMatrix();

        // Display the secondary tail
        this.scene.pushMatrix();
        this.scene.translate(0, -1, 0);
        this.scene.rotate(Math.PI, 1, 0, 0);
        this.scene.rotate(Math.PI, 0, 1, 0);
        this.scene.translate(-0.375, -2.60, 5.25);
        this.secondaryTail.display();
        this.scene.popMatrix();

        // Display the tail detail
        this.scene.pushMatrix();
        this.scene.translate(-1, 1.4, 5.25);
        this.tailDetailMain.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(0, -1, 0);
        this.scene.rotate(Math.PI / 2, 0, 0, 1);
        this.scene.translate(2.20, 1, 5.25);
        this.tailDetailLeft.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(0, -1, 0);
        this.scene.rotate(Math.PI / 2, 0, 0, 1);
        this.scene.translate(2.20, -1, 5.25);
        this.tailDetailRight.display();
        this.scene.popMatrix();

        // Display the tail propeller support
        this.scene.pushMatrix();
        this.scene.translate(0, -1, 0);
        this.scene.rotate(-Math.PI / 2, 0, 0, 1);
        this.scene.scale(0.06, 0.25, 0.06);
        this.scene.translate(-42, 0, 118);
        this.tailProppellerSupport.display();
        this.scene.popMatrix();
    }
}