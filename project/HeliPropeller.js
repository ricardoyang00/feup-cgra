import { CGFobject } from '../lib/CGF.js';
import { MyCylinder } from './MyCylinder.js';

/**
 * HeliPropeller
 * Models the main rotor hub and blades (static)
 */
export class HeliPropeller extends CGFobject {
    constructor(scene, options = {}) {
        super(scene);

        this.bladeCount = options.bladeCount
        this.hubRadius = options.hubRadius
        this.hubThickness = options.hubThickness
        this.bladeLength = options.bladeLength
        this.bladeWidth = options.bladeWidth
        this.bladeThickness = options.bladeThickness
        this.bladeOffset = options.bladeOffset

        this.hub = new MyCylinder(scene, 12, 1);
        this.blade = new MyCylinder(scene, 4, 1);
    }

    display() {
        this.scene.pushMatrix();
        this.scene.scale(this.hubRadius, this.hubThickness, this.hubRadius);
        this.hub.display();
        this.scene.popMatrix();

        // Draw each blade around the hub
        for (let i = 0; i < this.bladeCount; i++) {
            const angle = (2 * Math.PI / this.bladeCount) * i;
            this.scene.pushMatrix();
            this.scene.rotate(angle, 0, 1, 0);
            // center the blade on the hub
            this.scene.translate(0, this.hubThickness / 2, 0);
            // rotate blade to be horizontal
            this.scene.rotate(Math.PI / 2, 0, 0, 1);
            this.scene.scale(
                this.bladeThickness,
                this.bladeLength,
                this.bladeWidth
            );

            // Apply a cut to the blade
            this.scene.pushMatrix();
            this.scene.translate(-0.01, 0.3, -0.05);
            this.scene.rotate(Math.PI / 30, 1, 0, 0);
            this.blade.display();
            this.scene.popMatrix();
                        
            this.blade.display();
            this.scene.popMatrix();
        }
    }
}
