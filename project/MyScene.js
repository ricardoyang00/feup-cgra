import { CGFscene, CGFcamera, CGFaxis, CGFtexture, CGFappearance } from "../lib/CGF.js";
import { MyPlane } from "./MyPlane.js";
import { MyPanorama } from "./MyPanorama.js";
import { MyBuilding } from "./MyBuilding.js";
import { MyCone } from "./MyCone.js";
import { MyPyramid } from "./MyPyramid.js"; 
import { MyTree } from "./MyTree.js";
import { MyForest } from "./MyForest.js";

/**
 * MyScene
 * @constructor
 */
export class MyScene extends CGFscene {
  constructor() {
    super();
    this.lastT = null;
    this.deltaT = null;
    this.velocity = 0;
    this.acceleration = 0.1;
    this.maxSpeed = 20;
    this.deceleration = 0.05;
  }
  init(application) {
    super.init(application);

    this.initCameras();
    this.initLights();

    //Background color
    this.gl.clearColor(0, 0, 0, 1.0);

    this.gl.clearDepth(100.0);
    this.gl.enable(this.gl.DEPTH_TEST);
    this.gl.enable(this.gl.CULL_FACE);
    this.gl.depthFunc(this.gl.LEQUAL);

    this.enableTextures(true);

    this.setUpdatePeriod(50);

    //Initialize scene objects
    this.axis = new CGFaxis(this, 50, 1);
    this.plane = new MyPlane(this, 64, 0, 100, 0, 100);

    this.buildingWidth = 10;
    this.buildingDepth = 12;
    this.numFloorsSide = 4;
    this.numWindowsPerFloor = 3;
    this.windowTexture = new CGFtexture(this, "textures/window.jpg");
    this.buildingColor = [0.5, 0.5, 0.5, 1];
    this.building = new MyBuilding(
                      this, 
                      this.buildingWidth, 
                      this.buildingDepth, 
                      this.numFloorsSide, 
                      this.numWindowsPerFloor, 
                      this.windowTexture, 
                      this.buildingColor
                    );

    this.cone = new MyCone(this);
    this.pyramid = new MyPyramid(this);
    this.tree = new MyTree(this);
    this.forest = new MyForest(this, 10, 10, 10, 10);

    this.displayAxis = true;
    this.displayNormals = false;

    this.panoramaTexture = new CGFtexture(this, "textures/panorama.jpg");

    this.panorama = new MyPanorama(this, this.panoramaTexture);


    this.grassTexture = new CGFtexture(this, "textures/grass3.jpg");
    this.planeMaterial = new CGFappearance(this);
    this.planeMaterial.setTexture(this.grassTexture);
    this.planeMaterial.setTextureWrap('REPEAT', 'REPEAT');
  }
  initLights() {
    this.lights[0].setPosition(200, 200, 200, 1);
    this.lights[0].setDiffuse(1.5, 1.5, 1.5, 1.0);
    this.lights[0].setSpecular(1.5, 1.5, 1.5, 1.0);
    this.lights[0].setAmbient(0.5, 0.5, 0.5, 1.0);
    this.lights[0].enable();
    this.lights[0].update();
  }
  initCameras() {
    this.camera = new CGFcamera(
      1.2,
      0.1,
      500,
      vec3.fromValues(50, 1, 50),
      vec3.fromValues(0, 0, 0)
    );
  }
  checkKeys() {
    var text = "Keys pressed: ";
    var keysPressed = false;

    // Check for key codes e.g. in https://keycode.info/
    const directions = {
        KeyW: { axis: 2, sign: -1 }, // Move forward (negative Z)
        KeyS: { axis: 2, sign: 1 },  // Move back (positive Z)
        KeyA: { axis: 0, sign: -1 }, // Move left (negative X)
        KeyD: { axis: 0, sign: 1 }   // Move right (positive X)
    };

    if (!this.lastDirection) {
      this.lastDirection = { axis: null, sign: 0 };
    }

    for (const key in directions) {
      if (this.gui.isKeyPressed(key)) {
          const { axis, sign } = directions[key];
          text += ` ${key.replace("Key", "")} `;

          // Check if the new direction is opposite to the last direction
          if (this.lastDirection.axis === axis && this.lastDirection.sign !== sign) {
            // Brake when moving in the opposite direction
            this.velocity = Math.max(this.velocity - this.acceleration * 2, 0);
        
            // If velocity reaches 0, switch direction
            if (this.velocity === 0) {
                this.lastDirection = { axis, sign };
            }
          } else {
              // Accelerate when moving in the same direction or switching to a new direction
              this.velocity = Math.min(this.velocity + this.acceleration, this.maxSpeed);
              this.lastDirection = { axis, sign }; // Update last direction
          }

          this.camera.position[axis] += sign * this.velocity;
          keysPressed = true;
      }
  }

    if (!keysPressed && this.velocity > 0) {
      // Decelerate when no keys are pressed
      this.velocity = Math.max(this.velocity - this.deceleration, 0);

      // Continue moving in the last direction
      if (this.lastDirection.axis !== null) {
          this.camera.position[this.lastDirection.axis] += this.lastDirection.sign * this.velocity;
      }
    }

    //console.log(`Current speed: ${this.velocity.toFixed(2)}`);

    if (keysPressed)
      console.log(text);
  }

  update(t) {
    if (this.lastT != null) {
        this.deltaT = t - this.lastT;
    }
    this.lastT = t;

    this.checkKeys();
  }

  setDefaultAppearance() {
    this.setAmbient(0.5, 0.5, 0.5, 1.0);
    this.setDiffuse(0.5, 0.5, 0.5, 1.0);
    this.setSpecular(0.5, 0.5, 0.5, 1.0);
    this.setShininess(10.0);
  }
  display() {
    if (this.camera.position[1] < 0) {
      this.camera.position[1] = 0.1;
    }

    // ---- BEGIN Background, camera and axis setup
    // Clear image and depth buffer everytime we update the scene
    this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
    // Initialize Model-View matrix as identity (no transformation
    this.updateProjectionMatrix();
    this.loadIdentity();
    // Apply transformations corresponding to the camera position relative to the origin
    this.applyViewMatrix();

    this.gl.depthMask(false);
    this.panorama.display();
    this.gl.depthMask(true); 

    // Draw axis
    if (this.displayAxis) this.axis.display();

    this.setDefaultAppearance();

    // Apply plane material and display the plane
    this.planeMaterial.apply();
    this.scale(1000, 1000, 1000);
    this.rotate(-Math.PI / 2, 1, 0, 0);
    this.plane.display();

    this.setDefaultAppearance();

    // Display the building
    /*this.pushMatrix();
    this.translate(0, 0, 0);
    this.scale(0.01, 0.01, 0.01);
    this.building.display();
    this.popMatrix();
    */

    //// FOREST
    this.pushMatrix();
    
    this.scale(0.01, 0.01, 0.01);
    this.rotate(Math.PI/2, 1, 0, 0); 
    this.translate(0, -0.05, 0);    /// !! this offset is important to make sure the trunk is "inside" the plane
    this.forest.display();
    this.popMatrix();

    this.setDefaultAppearance();
  }
}
