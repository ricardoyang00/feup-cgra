import { CGFappearance } from '../lib/CGF.js';
import { MySphere } from "./primitives/MySphere.js"

export class MyPanorama {
    constructor(scene, texture) {
        this.scene = scene;
        this.texture = texture;

        this.sphere = new MySphere(scene, 50, 50, true);

        this.material = new CGFappearance(scene);
        this.material.setAmbient(0, 0, 0, 1);    
        this.material.setDiffuse(0, 0, 0, 1);
        this.material.setSpecular(0, 0, 0, 1);
        this.material.setEmission(1, 1, 1, 1);
        this.material.setTexture(this.texture);
    }

    display() {
        const camPos = this.scene.camera.position;

        this.scene.pushMatrix();
        
        this.scene.translate(camPos[0], camPos[1], camPos[2]);
        this.scene.scale(200, 200, 200);
        
        this.material.apply();
        this.sphere.display();
        
        this.scene.popMatrix();
    }
}