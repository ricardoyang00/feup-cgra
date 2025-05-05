import { CGFobject, CGFappearance } from '../lib/CGF.js';

/**
 * MyCone
 * @constructor
 * @param scene - Reference to MyScene object
 * @param slices - Number of slices around the cone
 * @param stacks - Number of stacks along the height
 * @param color - Color to tint the texture
 * @param sideTexture - Texture to apply to the side of the cone
 * @param baseTexture - Texture to apply to the base of the cone
 */
export class MyCone extends CGFobject {
    constructor(scene, slices = 8, stacks = 4, color = [1, 1, 1, 1], sideTexture = null, baseTexture = null, textureScale = 1) {
        super(scene);
        this.slices = slices;
        this.stacks = stacks;
        
        this.coneAppearance = new CGFappearance(this.scene);
        this.baseAppearance = new CGFappearance(this.scene);
        this.textureScale = textureScale;

        if (sideTexture) {
            this.coneAppearance.setTexture(sideTexture);
            this.coneAppearance.setTextureWrap('REPEAT', 'REPEAT');
        }

        if (baseTexture) {
            this.baseAppearance.setTexture(baseTexture);
            this.baseAppearance.setTextureWrap('REPEAT', 'REPEAT');
        }
        
        this.coneAppearance.setAmbient(...color);
        this.coneAppearance.setDiffuse(...color);
        this.coneAppearance.setSpecular(0.1, 0.1, 0.1, 1.0);
        this.coneAppearance.setShininess(10.0);

        this.baseAppearance.setAmbient(...color);
        this.baseAppearance.setDiffuse(...color);
        this.baseAppearance.setSpecular(0.1, 0.1, 0.1, 1.0);
        this.baseAppearance.setShininess(10.0);
        
        this.initBuffers();
    }
    
    initBuffers() {
        this.vertices = [];
        this.indices = [];
        this.normals = [];
        this.texCoords = [];
        
        const angleIncrement = (2 * Math.PI) / this.slices;
        const heightIncrement = 1.0 / this.stacks;
        const radiusIncrement = 1.0 / this.stacks;
        
        for (let stack = 0; stack <= this.stacks; stack++) {
            const radius = 1 - (stack * radiusIncrement);
            const y = stack * heightIncrement; 
            
            for (let slice = 0; slice <= this.slices; slice++) {
                const angle = slice * angleIncrement;
                const x = radius * Math.cos(angle);
                const z = radius * Math.sin(angle);
                
                this.vertices.push(x, y, z);
                
                const normalX = Math.cos(angle);
                const normalZ = Math.sin(angle);
                const normalY = 0.5;
                const normalLength = Math.sqrt(normalX*normalX + normalY*normalY + normalZ*normalZ);
                
                this.normals.push(
                    normalX/normalLength, 
                    normalY/normalLength, 
                    normalZ/normalLength
                );
                
                this.texCoords.push((slice / this.slices) * this.textureScale, (1 - y) * this.textureScale);
            }
        }
        
        for (let stack = 0; stack < this.stacks; stack++) {
            for (let slice = 0; slice < this.slices; slice++) {
                const first = (stack * (this.slices + 1)) + slice;
                const second = first + this.slices + 1;
                
                this.indices.push(first, second, first + 1);
                this.indices.push(second, second + 1, first + 1);
            }
        }
        
        const baseCenterIndex = this.vertices.length / 3;
        this.vertices.push(0, 0, 0);
        this.normals.push(0, -1, 0);
        this.texCoords.push(0.5, 0.5);
        
        for (let slice = 0; slice <= this.slices; slice++) {
            const angle = slice * angleIncrement;
            const x = Math.cos(angle);
            const z = Math.sin(angle);
            
            this.vertices.push(x, 0, z);
            this.normals.push(0, -1, 0);
            this.texCoords.push(
                0.5 + 0.5 * Math.cos(angle) * this.textureScale, 
                0.5 + 0.5 * Math.sin(angle) * this.textureScale
            );
            
            if (slice > 0) {
                this.indices.push(
                    baseCenterIndex,
                    baseCenterIndex + slice,
                    baseCenterIndex + slice + 1
                );
            }
        }
        
        this.primitiveType = this.scene.gl.TRIANGLES;
        this.initGLBuffers();
    }
    
    display() {
        // Display the side of the cone
        this.scene.pushMatrix();
        this.coneAppearance.apply();
        this.scene.scale(1, 1, 1); // Ensure proper scaling for the side
        super.display(); // Render only the side
        this.scene.popMatrix();

        // Display the base of the cone
        this.scene.pushMatrix();
        this.baseAppearance.apply();
        this.scene.rotate(Math.PI, 1, 0, 0); // Flip to render the base
        this.scene.translate(0, 0, -1); // Position the base correctly
        this.scene.scale(1, 1, 1); // Ensure proper scaling for the base
        this.scene.gl.drawArrays(this.scene.gl.TRIANGLE_FAN, this.vertices.length / 3 - this.slices - 2, this.slices + 2); // Render only the base
        this.scene.popMatrix();
    }
}