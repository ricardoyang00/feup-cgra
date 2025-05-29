import { CGFinterface, dat } from '../lib/CGF.js';

/**
* MyInterface
* @constructor
*/
export class MyInterface extends CGFinterface {
    constructor() {
        super();
    }

    init(application) {
        // call CGFinterface init
        super.init(application);

        // init GUI. For more information on the methods, check:
        // https://github.com/dataarts/dat.gui/blob/master/API.md
        this.gui = new dat.GUI();

        this.initKeys();

        let displays = this.gui.addFolder('Displays')
        displays.add(this.scene, 'displayAxis').name('Display Axis');
        displays.add(this.scene, 'displayForest').name('Display Forest');
        displays.add(this.scene, 'showFireParticles').name('Display Particles');

        let camera = this.gui.addFolder('Camera/POV');
        camera.add(this.scene, 'resetCamera').name('Reset Camera');
        camera.add(this.scene, 'cameraView', ['0: Default', '1: First Person', '2: Third Person']).name('Camera View');

        let controls = this.gui.addFolder('Controls');
        controls.add(this.scene, 'resetHelicopter').name('Reset Helicopter (R key)');
        controls.add(this.scene, 'setFire').name('Set a Fire (F key)');
        controls.add(this.scene, 'resetFires').name('Reset Fires');
        controls.add(this.scene, 'toggleBucketFill').name('Toggle Bucket Fill (B key)');
        
        this.gui.add(this.scene, 'speedFactor', 0.1, 3).name('Speed Factor');
        this.gui.add(this.scene, 'fpsRate', [24, 30, 60, 120]).name('FPS Rate').onChange((value) => {
            this.scene.setUpdatePeriod(1000 / value);
        });
        
        return true;
    }

    initKeys() {
        // create reference from the scene to the GUI
        this.scene.gui = this;

        // disable the processKeyboard function
        this.processKeyboard = function () { };

        // create a named array to store which keys are being pressed
        this.activeKeys = {};
    }
    processKeyDown(event) {
        // called when a key is pressed down
        // mark it as active in the array
        this.activeKeys[event.code] = true;
    };

    processKeyUp(event) {
        // called when a key is released, mark it as inactive in the array
        this.activeKeys[event.code] = false;
    };

    isKeyPressed(keyCode) {
        // returns true if a key is marked as pressed, false otherwise
        return this.activeKeys[keyCode] || false;
    }

}