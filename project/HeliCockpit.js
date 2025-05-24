
import { CGFobject, CGFappearance, CGFtexture } from '../lib/CGF.js';
import { MyQuad } from './primitives/MyQuad.js';

/**
 * HeliCockPit
 * @constructor
 * @param scene - Reference to MyScene object
 */
export class HeliCockpit extends CGFobject {
    constructor(scene) {
        super(scene);
        
        // Initialize the cockpit texture
        this.cockpitTexture = new CGFtexture(this.scene, "textures/helicopter/cockpit-5.png");
        
        // Create appearance for the cockpit
        this.cockpitAppearance = new CGFappearance(this.scene);
        this.cockpitAppearance.setTexture(this.cockpitTexture);
        this.cockpitAppearance.setTextureWrap('CLAMP_TO_EDGE', 'CLAMP_TO_EDGE');
        
        // Set the material properties to ensure proper rendering with transparency
        this.cockpitAppearance.setAmbient(1.0, 1.0, 1.0, 1.0);
        this.cockpitAppearance.setDiffuse(1.0, 1.0, 1.0, 1.0);
        this.cockpitAppearance.setSpecular(0.0, 0.0, 0.0, 1.0);
        this.cockpitAppearance.setShininess(1.0);
        
        // For transparent textures, setting a slight emission helps visibility
        this.cockpitAppearance.setEmission(0.3, 0.3, 0.3, 1.0);

        // Calculate the aspect ratio of the texture
        this.textureWidth = 2000;
        this.textureHeight = 666;
        this.aspectRatio = this.textureWidth / this.textureHeight; // ~3.0
        
        // Set initial texture scale - smaller values show less of the texture (zoom in)
        const textureScale = 1.5; // Show 60% of the texture (slightly zoomed in)
        
        // Calculate texture coordinates based on scale
        const minS = 0.5 - (0.5 * textureScale); // Center point minus half the scaled width
        const maxS = 0.5 + (0.5 * textureScale); // Center point plus half the scaled width
        
        // For the vertical portion, we want to show the bottom part of the texture
        // So we adjust the texture coordinates to focus on the bottom
        const minT = 0.75 - (0.5 * textureScale); // Focus on lower portion
        const maxT = 0.75 + (0.5 * textureScale); // Focus on lower portion
        
        // Create texture coordinates array
        const texCoords = [
            minS, maxT,  // bottom left
            maxS, maxT,  // bottom right
            minS, minT,  // top left
            maxS, minT   // top right
        ];
        
        // Create a quad with custom texture coordinates
        this.cockpitQuad = new MyQuad(scene, texCoords);

        // Create quads for the left and right sides
        this.leftSideQuad = new MyQuad(scene);
        this.rightSideQuad = new MyQuad(scene);

        // Side panel configuration
        this.sidePanelDistance = 1.1; // Distance from center to side panels
        this.sidePanelHeight = 2.0;    // Height of side panels
        this.sidePanelWidth = 0.3;     // Width of side panels

        // Set up textures for side panels
        this.sideTexture = new CGFtexture(this.scene, "textures/helicopter/red_metal.jpg");
        this.sideAppearance = new CGFappearance(this.scene);
        this.sideAppearance.setTexture(this.sideTexture);
        this.sideAppearance.setTextureWrap('CLAMP_TO_EDGE', 'CLAMP_TO_EDGE');
        
        // Set the material properties for side panels
        this.sideAppearance.setAmbient(1.0, 1.0, 1.0, 1.0);
        this.sideAppearance.setDiffuse(1.0, 1.0, 1.0, 1.0);
        this.sideAppearance.setSpecular(0.0, 0.0, 0.0, 1.0);
        this.sideAppearance.setShininess(1.0);
    }
    
    
    /**
     * Displays the cockpit in first-person view
     * This should be called after loading identity in the scene
     */

    display() {
        // Instead of disabling depth testing completely, we'll use a better approach
        // that keeps the cockpit in front of other objects
        
        // Enable transparency
        this.scene.gl.enable(this.scene.gl.BLEND);
        this.scene.gl.blendFunc(this.scene.gl.SRC_ALPHA, this.scene.gl.ONE_MINUS_SRC_ALPHA);
        
        // Save current depth function
        const originalDepthFunc = this.scene.gl.getParameter(this.scene.gl.DEPTH_FUNC);
        
        // Use ALWAYS depth function to ensure cockpit is drawn on top of everything
        this.scene.gl.depthFunc(this.scene.gl.ALWAYS);
        
        this.scene.pushMatrix();
        this.scene.loadIdentity();
        
        // Position the cockpit at the bottom portion of the screen
        // Move it closer to the bottom and adjust the z position for proper depth
        this.cockpitAppearance.apply();
        
        // Adjust position
        //this.scene.translate(0, -0.6, -1);
        this.scene.translate(0, -0.7, -1);
        
        // Scale to maintain the exact aspect ratio of the texture (2000x666)
        const screenScale = 3; // Overall scale of the cockpit on screen
        const width = screenScale;
        const height = width / this.aspectRatio; // Preserves the exact 2000:666 ratio
        this.scene.scale(width, height, 1);
        
        this.cockpitQuad.display();
        
        this.scene.popMatrix();
        
        this.scene.gl.disable(this.scene.gl.BLEND);
        
        // Restore original depth function
        this.scene.gl.depthFunc(originalDepthFunc);

        // Render side panels
        // Get the depth function again for side panels
        const sideDepthFunc = this.scene.gl.getParameter(this.scene.gl.DEPTH_FUNC);
        
        // Use ALWAYS depth function to ensure side panels are drawn on top of everything
        this.scene.gl.depthFunc(this.scene.gl.ALWAYS);
        this.scene.gl.enable(this.scene.gl.BLEND);
        
        // Left side panel
        this.scene.pushMatrix();
        this.scene.loadIdentity();
        this.sideAppearance.apply();
        // Position on the left side of the screen using the constant
        this.scene.translate(-this.sidePanelDistance, 0, -0.99);
        // Rotate to be vertical
        this.scene.rotate(Math.PI/2, 0, 0, 1);
        // Scale to fit the side of the screen using constants
        this.scene.scale(this.sidePanelHeight, this.sidePanelWidth, 1);
        this.leftSideQuad.display();
        this.scene.popMatrix();
        
        // Right side panel
        this.scene.pushMatrix();
        this.scene.loadIdentity();
        this.sideAppearance.apply();
        // Position on the right side of the screen using the constant
        this.scene.translate(this.sidePanelDistance, 0, -0.99);
        // Rotate to be vertical
        this.scene.rotate(-Math.PI/2, 0, 0, 1);
        // Scale to fit the side of the screen using constants
        this.scene.scale(this.sidePanelHeight, this.sidePanelWidth, 1);
        this.rightSideQuad.display();
        this.scene.popMatrix();
        
        this.scene.gl.disable(this.scene.gl.BLEND);
        // Restore original depth function
        this.scene.gl.depthFunc(sideDepthFunc);
    }
}