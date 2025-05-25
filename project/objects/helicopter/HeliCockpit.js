import { CGFobject, CGFappearance, CGFtexture } from '../../../lib/CGF.js';
import { MyQuad } from '../../primitives/MyQuad.js';

/**
 * HeliCockpit
 * @constructor
 * @param scene - Reference to MyScene object
 */
export class HeliCockpit extends CGFobject {
    constructor(scene) {
        super(scene);
        
        // Cockpit
        this.cockpitTexture = new CGFtexture(this.scene, "textures/helicopter/cockpit-5.png");
        
        this.cockpitAppearance = new CGFappearance(this.scene);
        this.cockpitAppearance.setTexture(this.cockpitTexture);
        this.cockpitAppearance.setTextureWrap('CLAMP_TO_EDGE', 'CLAMP_TO_EDGE');
        this.cockpitAppearance.setAmbient(1.0, 1.0, 1.0, 1.0);
        this.cockpitAppearance.setDiffuse(1.0, 1.0, 1.0, 1.0);
        this.cockpitAppearance.setSpecular(0.0, 0.0, 0.0, 1.0);
        this.cockpitAppearance.setShininess(1.0);
        this.cockpitAppearance.setEmission(0.3, 0.3, 0.3, 1.0);

        // cockpit texture numbers
        this.textureWidth = 2000;
        this.textureHeight = 666;
        this.aspectRatio = this.textureWidth / this.textureHeight;
        const textureScale = 1.5;
        const minS = 0.5 - (0.5 * textureScale);
        const maxS = 0.5 + (0.5 * textureScale);
        const minT = 0.75 - (0.5 * textureScale);
        const maxT = 0.75 + (0.5 * textureScale);

        const texCoords = [
            minS, maxT,
            maxS, maxT,
            minS, minT,
            maxS, minT
        ];
        
        this.cockpitQuad = new MyQuad(scene, texCoords);


        // cockpit sides red metal
        this.leftSideQuad = new MyQuad(scene);
        this.rightSideQuad = new MyQuad(scene);

        this.sidePanelDistance = 1.1;
        this.sidePanelHeight = 2.0;
        this.sidePanelWidth = 0.3;

        this.sideTexture = new CGFtexture(this.scene, "textures/helicopter/red_metal.jpg");
        this.sideAppearance = new CGFappearance(this.scene);
        this.sideAppearance.setTexture(this.sideTexture);
        this.sideAppearance.setTextureWrap('CLAMP_TO_EDGE', 'CLAMP_TO_EDGE');
        this.sideAppearance.setAmbient(1.0, 1.0, 1.0, 1.0);
        this.sideAppearance.setDiffuse(1.0, 1.0, 1.0, 1.0);
        this.sideAppearance.setSpecular(0.0, 0.0, 0.0, 1.0);
        this.sideAppearance.setShininess(1.0);
        
        
        // Right indicator (blinks) - for up/down/fire/lake
        this.rightIndicatorQuad = new MyQuad(scene);
        this.indicatorSize = 0.25;
        this.rightIndicatorX = 0.215;
        this.rightIndicatorY = -0.43;
        this.rightIndicatorZ = -0.98;

        // Left indicator - water / no water
        this.leftIndicatorQuad = new MyQuad(scene);
        this.leftIndicatorX = -0.225;
        this.leftIndicatorY = -0.43;
        this.leftIndicatorZ = -0.98;
        
        // indicator textures
        this.indicatorTextures = {
            up: new CGFtexture(this.scene, "textures/helicopter/icon-up.png"),
            down: new CGFtexture(this.scene, "textures/helicopter/icon-down.png"),
            lake: new CGFtexture(this.scene, "textures/helicopter/icon-lake.png"),
            nowater: new CGFtexture(this.scene, "textures/helicopter/icon-nowater.png"),
            water: new CGFtexture(this.scene, "textures/helicopter/icon-water.png"),
            fire: new CGFtexture(this.scene, "textures/helicopter/icon-fire.png")
        };
        
        this.indicatorAppearance = new CGFappearance(this.scene);
        this.indicatorAppearance.setTextureWrap('CLAMP_TO_EDGE', 'CLAMP_TO_EDGE');
        this.indicatorAppearance.setAmbient(1.0, 1.0, 1.0, 1.0);
        this.indicatorAppearance.setDiffuse(1.0, 1.0, 1.0, 1.0);
        this.indicatorAppearance.setSpecular(0.0, 0.0, 0.0, 1.0);
        this.indicatorAppearance.setShininess(1.0);
        this.indicatorAppearance.setEmission(0.5, 0.5, 0.5, 1.0);
        
        // animation right indicator (blinking)
        this.animationTime = 0;
        this.blinkPeriod = 1.0;         // 1s blink cycle
        this.isBlinking = false;
        this.activeIndicator = null;
        this.leftIndicatorState = null;
    }
    
    setLeftIndicator(waterState) {
        if (waterState === "no_water") {
            this.leftIndicatorState = "nowater";
        } else if (waterState === "water") {
            this.leftIndicatorState = "water";
        } else {
            this.leftIndicatorState = null;
        }
    }

    setRightIndicator(heliState) {
        if (heliState === "up") {
            this.activeIndicator = "up";
            this.isBlinking = true;
        } else if (heliState === "down") {
            this.activeIndicator = "down";
            this.isBlinking = true;
        } else if (heliState === "over_fire") {
            this.activeIndicator = "fire";
            this.isBlinking = false;
        } else if (heliState === "over_lake") {
            this.activeIndicator = "lake";
            this.isBlinking = false;
        } else {
            // No indicator for null state
            this.activeIndicator = null;
            this.isBlinking = false;
        }
    }
    
    update(deltaTime) {
        this.animationTime += deltaTime;
        if (this.animationTime > this.blinkPeriod) {
            this.animationTime = 0;
        }
    }
    
    /**
     * Displays the cockpit in first-person view
     * This should be called after loading identity in the scene
     * @param {string} waterState - The water state for left indicator ("no_water", "water", or null)
     * @param {string} heliState - The helicopter state for right indicator
     */
    display(waterState, heliState) {
        
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
        
        
        this.setLeftIndicator(waterState);
        this.setRightIndicator(heliState);

        // Left indicator
        if (this.leftIndicatorState) {
            this.scene.pushMatrix();
            this.scene.loadIdentity();
            this.indicatorAppearance.setTexture(this.indicatorTextures[this.leftIndicatorState]);
            this.indicatorAppearance.apply();
            this.scene.translate(this.leftIndicatorX, this.leftIndicatorY, this.leftIndicatorZ);
            this.scene.scale(this.indicatorSize, this.indicatorSize, 1);
            this.leftIndicatorQuad.display();
            this.scene.popMatrix();
        }
        
        // Right indicator (blink)
        if (this.activeIndicator) {
            let visible = true;

            if (this.isBlinking) {
                
                //blinking effect using sine wave
                const blinkPhase = Math.sin(this.animationTime / this.blinkPeriod * 2 * Math.PI);
                visible = blinkPhase > 0;
            }
            
            if (visible) {
                this.scene.pushMatrix();
                this.scene.loadIdentity();
                
                this.indicatorAppearance.setTexture(this.indicatorTextures[this.activeIndicator]);
                this.indicatorAppearance.apply();
                
                this.scene.translate(this.rightIndicatorX, this.rightIndicatorY, this.rightIndicatorZ);
                this.scene.scale(this.indicatorSize, this.indicatorSize, 1);
                
                this.rightIndicatorQuad.display();
                
                this.scene.popMatrix();
            }
        }
        
        this.scene.gl.disable(this.scene.gl.BLEND);
        this.scene.gl.depthFunc(sideDepthFunc);
    }
}