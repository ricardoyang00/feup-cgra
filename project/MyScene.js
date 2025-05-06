import { CGFscene, CGFcamera, CGFaxis, CGFtexture, CGFappearance } from "../lib/CGF.js";
import { MyPlane } from "./MyPlane.js";
import { MyPanorama } from "./MyPanorama.js";
import { MyBuilding } from "./MyBuilding.js";
import { MyCone } from "./MyCone.js";
import { MyPyramid } from "./MyPyramid.js"; 
import { MyTree } from "./MyTree.js";
import { MyForest } from "./MyForest.js";
import { MyHeli } from "./MyHeli.js";
import { updateCameraFromHelicopter, updateCameraThirdPerson } from "./CameraUtils.js";
import { MyFullscreenQuad } from "./MyFullscreenQuad.js";

/**
 * MyScene
 * @constructor
 */
export class MyScene extends CGFscene {
  constructor() {
    super();
    this.cameraView = 'Default';
    this.firstPersonView = false;
    this.thirdPersonView = false;

    this.lastT = null;
    this.deltaT = null;

    this.acceleration = 4;
    this.deceleration = 2;
    this.turnSpeed = 1;

    this.speedFactor = 1;

    this.heliportPosition = [0, 0, 0];
    this.heliportRadius = 1;

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
    
    this.buildingWidth = 15;
    this.buildingDepth = 12;
    this.numFloorsSide = 2;
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
    this.forest = new MyForest(this, 7, 7, 10, 10);
    this.forestSmall = new MyForest(this, 4, 4, 4, 4);
    this.helicopter = new MyHeli(this);
    this.lakeModel = new MyPlane(this, 64, 0, 10, 0, 10);

    this.displayAxis = true;
    this.displayNormals = false;

    this.panoramaTexture = new CGFtexture(this, "textures/panorama-2.png");

    this.panorama = new MyPanorama(this, this.panoramaTexture);

    this.grassTexture = new CGFtexture(this, "textures/grass/grass3.jpg");
    this.planeMaterial = new CGFappearance(this);
    this.planeMaterial.setTexture(this.grassTexture);
    this.planeMaterial.setTextureWrap('REPEAT', 'REPEAT');
    this.planeMaterial.setAmbient(0.5, 0.5, 0.5, 1.0); 
    this.planeMaterial.setDiffuse(0.63, 0.55, 0.26, 1.0); 
    this.planeMaterial.setSpecular(0.0, 0.0, 0.0, 1.0); 
    this.planeMaterial.setShininess(10.0);

    this.fullscreenQuad = new MyFullscreenQuad(this);
    this.glassTexture = new CGFtexture(this, "textures/transparent_glass.png");
    this.glassAppearance = new CGFappearance(this);
    this.glassAppearance.setTexture(this.glassTexture);
    this.glassAppearance.setTextureWrap('CLAMP_TO_EDGE', 'CLAMP_TO_EDGE');
    this.glassAppearance.setAmbient(0.5, 0.5, 0.5, 1);
    this.glassAppearance.setDiffuse(0, 0, 0, 1);
    this.glassAppearance.setSpecular(1, 1, 1, 1);
    this.glassAppearance.setShininess(10.0);
  }
  initLights() {
    this.lights[0].setPosition(200, 200, 200, 1);
    this.lights[0].setDiffuse(1.2, 1.2, 1.2, 1.0);
    this.lights[0].setSpecular(1.5, 1.5, 1.5, 1.0);
    this.lights[0].setAmbient(0.5, 0.5, 0.5, 1.0);
    this.lights[0].enable();
    this.lights[0].update();

    this.lights[1].setPosition(150, 300, 50, 1); // Position directly above the scene
    this.lights[1].setDiffuse(1.0, 1.0, 0.8, 1.0); // Slightly warm light
    this.lights[1].setSpecular(1.0, 1.0, 0.8, 1.0);
    this.lights[1].setAmbient(0, 0, 0, 1.0);
    this.lights[1].enable();
    this.lights[1].update();

    // Light 2: Moonlight or secondary light
    this.lights[2].setPosition(-50, 100, 250, 1); // Position diagonally in the sky
    this.lights[2].setDiffuse(0.5, 0.6, 0.5, 1.0); // Cool blue light
    this.lights[2].setSpecular(0.5, 1.0, 0.5, 1.0);
    this.lights[2].setAmbient(0, 0, 0, 1.0);
    this.lights[2].enable();
    this.lights[2].update();
  }
  initCameras() {
    this.camera = new CGFcamera(
      1.1,
      0.1,
      500,
      vec3.fromValues(30, 30, 30),
      vec3.fromValues(0, 15, 0)
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

    const movementAllowed = this.helicopter.state == "flying";

    switch (true) {
      case this.gui.isKeyPressed("KeyW") && movementAllowed:
          this.helicopter.accelerate(-this.acceleration * this.speedFactor * dt);
          break;

      case this.gui.isKeyPressed("KeyS") && movementAllowed:
          this.helicopter.accelerate(this.acceleration * this.speedFactor * dt * 0.8);
          break;

      case this.gui.isKeyPressed("KeyA") && movementAllowed:
          this.helicopter.turn(this.turnSpeed * this.speedFactor * dt);
          break;

      case this.gui.isKeyPressed("KeyD") && movementAllowed:
          this.helicopter.turn(-this.turnSpeed * this.speedFactor * dt);
          break;

      case this.gui.isKeyPressed("KeyR"):
          this.helicopter.resetHelicopter();
          break;

      default:
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
              const speedChange = -Math.sign(this.helicopter.speed) * this.deceleration * this.speedFactor * dt;
              this.helicopter.accelerate(speedChange);
              // Prevent small oscillations around zero
              if (Math.abs(this.helicopter.speed) < this.speedFactor * 0.1) {
                  this.helicopter.speed = 0;
                  this.helicopter.resetLeanAngle();
              }
          }
          break;
    }

    this.helicopter.update(dt);

    if (this.cameraView === 'First Person') {
      this.firstPersonView = true;
      this.thirdPersonView = false;
      updateCameraFromHelicopter(this.camera, this.helicopter);
    } else if (this.cameraView === 'Third Person') {
        this.firstPersonView = false;
        this.thirdPersonView = true;
        updateCameraThirdPerson(this.camera, this.helicopter);
    } else {
        this.firstPersonView = false;
        this.thirdPersonView = false;
    }
  }

  setDefaultAppearance() {
    this.setAmbient(0.5, 0.5, 0.5, 1.0);
    this.setDiffuse(0.5, 0.5, 0.5, 1.0);
    this.setSpecular(0.5, 0.5, 0.5, 1.0);
    this.setShininess(10.0);
  }

  display() {
    if (this.camera.position[1] < 0.2) {
      this.camera.position[1] = 0.2;
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
    this.pushMatrix();
    this.rotate(-Math.PI / 2, 1, 0, 0);
    this.translate(0, 10, 0);
    this.scale(5, 5, 5);
    this.building.display();
    this.popMatrix();
    

    //// FOREST
    this.pushMatrix();
    this.scale(6, 6, 6);
    this.translate(0, -0.05, 0);    /// !! this y-offset is important to make sure the trunk is "inside" the plane
    
    this.translate(0, 0, -12.5); 
    this.forest.display();

    this.translate(-11, 0, 0);
    this.forest.display();

    this.translate(-11, 0, 0);
    this.forest.display();

    this.translate(5.5, 0, 12);
    this.forest.display();

    this.translate(22.5, 0, 0);
    this.forest.display();
    this.popMatrix();

    // Trees, smaller area for details
    this.pushMatrix();
    this.scale(6,6,6);
    this.translate(0,-0.05,0);
    this.translate(-5.5,0,3);
    this.forestSmall.display();

    this.translate(0,0,5);
    this.forestSmall.display();

    this.translate(7,0,0);
    this.forestSmall.display();

    this.translate(0,0,-5);
    this.forestSmall.display();
    this.popMatrix();

    // Helicopter
    const baseHeight = 15.1;
    this.pushMatrix();
    this.translate(0, baseHeight, 0);
    this.scale(0.22, 0.22, 0.22);
    this.rotate(Math.PI / 2, 0, 1, 0);
    this.helicopter.display();
    this.popMatrix();


    this.pushMatrix();
    this.scale(100, 100, 100);
    this.rotate(-Math.PI / 2, 1, 0, 0);
    this.translate(1, 1, 0.01)
    this.lakeModel.display();
    this.popMatrix();

    // Render glass texture in FPV mode
    if (this.firstPersonView) {
      this.gl.enable(this.gl.BLEND);
      this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA);
      
      this.pushMatrix();
      this.loadIdentity();
      this.glassAppearance.apply();
      this.fullscreenQuad.display();
      this.popMatrix();
      
      this.gl.disable(this.gl.BLEND);
    }

    this.setDefaultAppearance();
  }
}
