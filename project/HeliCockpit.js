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
        
        // Status indicator configuration
        this.indicatorQuad = new MyQuad(scene);
        this.indicatorSize = 0.25; // Size of the indicator quad
        this.indicatorX = 0.215;    // X position (left side of cockpit)
        this.indicatorY = -0.43;   // Y position (just above bottom of screen)
        this.indicatorZ = -0.98;   // Z position (in front of cockpit)
        
        // Load indicator textures
        this.indicatorTextures = {
            takeoff: new CGFtexture(this.scene, "textures/helicopter/icon-up.png"),
            landing: new CGFtexture(this.scene, "textures/helicopter/icon-down.png"),
            lake: new CGFtexture(this.scene, "textures/helicopter/icon-lake.png"),
            nowater: new CGFtexture(this.scene, "textures/helicopter/icon-nowater.png"),
            fire: new CGFtexture(this.scene, "textures/helicopter/icon-fire.png")
        };
        
        // Create appearance for indicators
        this.indicatorAppearance = new CGFappearance(this.scene);
        this.indicatorAppearance.setTextureWrap('CLAMP_TO_EDGE', 'CLAMP_TO_EDGE');
        this.indicatorAppearance.setAmbient(1.0, 1.0, 1.0, 1.0);
        this.indicatorAppearance.setDiffuse(1.0, 1.0, 1.0, 1.0);
        this.indicatorAppearance.setSpecular(0.0, 0.0, 0.0, 1.0);
        this.indicatorAppearance.setShininess(1.0);
        this.indicatorAppearance.setEmission(0.5, 0.5, 0.5, 1.0);
        
        // Animation for blinking indicators
        this.animationTime = 0;
        this.blinkPeriod = 1.0; // 1 second for a complete blink cycle
        this.isBlinking = false;
        this.activeIndicator = null;
        
        // Set default indicator
        this.setIndicator(null);
    }
    
    /**
     * Set the active indicator based on helicopter state
     * @param {string} helicopterState - The current state of the helicopter
     */
    setIndicator(helicopterState) {
        // Map helicopter state to indicator
        if (helicopterState === "taking_off" || helicopterState === "ascending_from_lake") {
            this.activeIndicator = "takeoff";
            this.isBlinking = true;
        } else if (helicopterState === "landing" || helicopterState === "reorienting_to_land" || 
                  helicopterState === "descending_to_lake" || helicopterState === "retracting_bucket") {
            this.activeIndicator = "landing";
            this.isBlinking = true;
        } else if (helicopterState === "filling_bucket") {
            this.activeIndicator = "lake";
            this.isBlinking = true;
        } else if (helicopterState === "flying" || helicopterState === "moving_to_heliport" || 
                  helicopterState === "releasing_bucket" || helicopterState === "automatic_braking") {
            this.activeIndicator = "nowater";
            this.isBlinking = false;
        } else if (helicopterState === "ground") {
            this.activeIndicator = null;
            this.isBlinking = false;
        }
    }
    
    /**
     * Update animation for blinking indicators
     * @param {number} deltaTime - The time elapsed since the last update
     */
    update(deltaTime) {
        this.animationTime += deltaTime;
        if (this.animationTime > this.blinkPeriod) {
            this.animationTime = 0;
        }
    }
    
    
    /**
     * Displays the cockpit in first-person view
     * This should be called after loading identity in the scene
     */
    display() {
        // Cockpit
        this.scene.gl.enable(this.scene.gl.BLEND);
        this.scene.gl.blendFunc(this.scene.gl.SRC_ALPHA, this.scene.gl.ONE_MINUS_SRC_ALPHA);

        const originalDepthFunc = this.scene.gl.getParameter(this.scene.gl.DEPTH_FUNC);
        this.scene.gl.depthFunc(this.scene.gl.ALWAYS);
        
        this.scene.pushMatrix();
        this.scene.loadIdentity();
        this.cockpitAppearance.apply();
        this.scene.translate(0, -0.7, -1);
        
        // cockpit texture (2000x666)
        const screenScale = 3;
        const width = screenScale;
        const height = width / this.aspectRatio;        // ratio

        this.scene.scale(width, height, 1);
        this.cockpitQuad.display();
        this.scene.popMatrix();

        this.scene.gl.disable(this.scene.gl.BLEND);
        this.scene.gl.depthFunc(originalDepthFunc);

        // cockpit side red metal
        const sideDepthFunc = this.scene.gl.getParameter(this.scene.gl.DEPTH_FUNC);
        
        this.scene.gl.depthFunc(this.scene.gl.ALWAYS);
        this.scene.gl.enable(this.scene.gl.BLEND);
        
        // left side
        this.scene.pushMatrix();
        this.scene.loadIdentity();
        this.sideAppearance.apply();
        this.scene.translate(-this.sidePanelDistance, 0, -0.99);
        this.scene.rotate(Math.PI/2, 0, 0, 1);
        this.scene.scale(this.sidePanelHeight, this.sidePanelWidth, 1);
        this.leftSideQuad.display();
        this.scene.popMatrix();
        
        // right side
        this.scene.pushMatrix();
        this.scene.loadIdentity();
        this.sideAppearance.apply();
        this.scene.translate(this.sidePanelDistance, 0, -0.99);
        this.scene.rotate(-Math.PI/2, 0, 0, 1);
        this.scene.scale(this.sidePanelHeight, this.sidePanelWidth, 1);
        this.rightSideQuad.display();
        this.scene.popMatrix();
        
        
        // indicator icon
        if (this.activeIndicator) {
            // Calculate visibility for blinking effect
            let visible = true;
            if (this.isBlinking) {
                // Create blinking effect using sine wave
                const blinkPhase = Math.sin(this.animationTime / this.blinkPeriod * 2 * Math.PI);
                visible = blinkPhase > 0;
            }
            
            if (visible) {
                this.scene.pushMatrix();
                this.scene.loadIdentity();
                
                // Set the indicator texture based on active state
                this.indicatorAppearance.setTexture(this.indicatorTextures[this.activeIndicator]);
                this.indicatorAppearance.apply();
                
                // Position and scale the indicator
                this.scene.translate(this.indicatorX, this.indicatorY, this.indicatorZ);
                this.scene.scale(this.indicatorSize, this.indicatorSize, 1);
                
                // Display the indicator
                this.indicatorQuad.display();
                
                this.scene.popMatrix();
            }
        }
        
        this.scene.gl.disable(this.scene.gl.BLEND);
        // Restore original depth function
        this.scene.gl.depthFunc(sideDepthFunc);
    }
}