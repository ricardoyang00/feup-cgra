import { CGFscene, CGFcamera, CGFaxis, CGFtexture, CGFappearance } from "../lib/CGF.js";
import { MyPlane } from "./MyPlane.js";
import { MyPanorama } from "./MyPanorama.js";
import { MyBuilding } from "./MyBuilding.js";
import { MyCone } from "./MyCone.js";
import { MyPyramid } from "./MyPyramid.js"; 
import { MyTree } from "./MyTree.js";
import { MyForest } from "./MyForest.js";
import { MyHeli } from "./MyHeli.js";

/**
 * MyScene
 * @constructor
 */
export class MyScene extends CGFscene {
  constructor() {
    super();
    this.lastT = null;
    this.deltaT = null;

    this.acceleration = 4;
    this.deceleration = 2;
    this.turnSpeed = 1;

    this.lakePosition = [17, 0, -17];
    this.lakeRadius = 10;

    this.prevP = false;
    this.prevL = false;
  }

  isOverLake(position) {
    const dx = position[0] - this.lakePosition[0];
    const dz = position[2] - this.lakePosition[2];
    const distance = Math.sqrt(dx * dx + dz * dz);
    return distance < this.lakeRadius;
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
    this.helicopter = new MyHeli(this);
    this.lakeModel = new MyPlane(this, 64, 0, 10, 0, 10);

    this.displayAxis = true;
    this.displayNormals = false;

    this.panoramaTexture = new CGFtexture(this, "textures/panorama.jpg");

    this.panorama = new MyPanorama(this, this.panoramaTexture);

    this.grassTexture = new CGFtexture(this, "textures/grass3.jpg");
    this.planeMaterial = new CGFappearance(this);
    this.planeMaterial.setTexture(this.grassTexture);
    this.planeMaterial.setTextureWrap('REPEAT', 'REPEAT');
    this.planeMaterial.setAmbient(0.5, 0.5, 0.5, 1.0); 
    this.planeMaterial.setDiffuse(0.8, 0.8, 0.8, 1.0); 
    this.planeMaterial.setSpecular(0.0, 0.0, 0.0, 1.0); 
    this.planeMaterial.setShininess(10.0);
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
      vec3.fromValues(50, 30, 50),
      vec3.fromValues(0, 0, 0)
    );
  }

  update(t) {
    if (this.lastT != null) {
        this.deltaT = t - this.lastT;
    } else {
      this.deltaT = 0;
    }
    this.lastT = t;
    const dt = this.deltaT / 1000;

    const rotateAllowed = this.helicopter.state !== "ground" 
                        && this.helicopter.state !== "moving_to_heliport" 
                        && this.helicopter.state !== "reorienting_to_land";

    if (this.gui.isKeyPressed("KeyW")) {
      this.helicopter.accelerate(-this.acceleration * dt);
    }
    if (this.gui.isKeyPressed("KeyS")) {
      this.helicopter.accelerate(this.acceleration * dt * 0.8);
    }
    if (this.gui.isKeyPressed("KeyA") && rotateAllowed) {
      this.helicopter.turn(this.turnSpeed * dt);
    }
    if (this.gui.isKeyPressed("KeyD") && rotateAllowed) {
      this.helicopter.turn(-this.turnSpeed * dt);
    }
    if (this.gui.isKeyPressed("KeyR")) {
      this.helicopter.position = [0, 0, 0];
      this.helicopter.orientation = 0;
      this.helicopter.speed = 0;
      this.helicopter.state = "ground";
    }

    const currentP = this.gui.isKeyPressed("KeyP");
    const currentL = this.gui.isKeyPressed("KeyL");

    if (currentP && !this.prevP) {
        this.helicopter.initiateTakeoff();
    }
    if (currentL && !this.prevL) {
        this.helicopter.initiateLanding();
    }

    this.prevP = currentP;
    this.prevL = currentL;

    if (!this.gui.isKeyPressed("KeyW") && !this.gui.isKeyPressed("KeyS")) {
      const speedChange = -Math.sign(this.helicopter.speed) * this.deceleration * dt;
      this.helicopter.accelerate(speedChange);
      // Prevent small oscillations around zero
      if (Math.abs(this.helicopter.speed) < 0.01) {
          this.helicopter.speed = 0;
      }
    }

    this.helicopter.update(dt);
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
    this.pushMatrix();
    this.planeMaterial.apply();
    this.scale(1000, 1000, 1000);
    this.rotate(-Math.PI / 2, 1, 0, 0);
    this.plane.display();
    this.popMatrix();


    // Display the building
    /*this.pushMatrix();
    this.rotate(-Math.PI / 2, 1, 0, 0);
    this.translate(0, 10, 0);
    this.scale(5, 5, 5);
    this.building.display();
    this.popMatrix();*/
    

    //// FOREST
    /*this.pushMatrix();
    this.scale(5, 5, 5);
    //this.rotate(0, 1, 0, 0); 
    this.translate(0, -0.05, 0);    /// !! this offset is important to make sure the trunk is "inside" the plane
    this.forest.display();
    this.popMatrix();*/

    // Helicopter
    this.pushMatrix();
    this.helicopter.display();
    this.popMatrix();

    this.pushMatrix();
    this.scale(100, 100, 100);
    this.rotate(-Math.PI / 2, 1, 0, 0);
    this.translate(1, 1, 0.01)
    this.lakeModel.display();
    this.popMatrix();

    this.setDefaultAppearance();
  }
}
