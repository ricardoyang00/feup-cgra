import { CGFobject, CGFappearance } from '../lib/CGF.js';

/**
 * MyCone
 * @constructor
 * @param scene - Reference to MyScene object
 * @param slices - Number of slices around the cone
 * @param stacks - Number of stacks along the height
 * @param color - Color to tint the texture
 * @param texture - Texture to apply to the cone
 */
export class MyCone extends CGFobject {
    constructor(scene, slices = 8, stacks = 4, color = [1, 1, 1, 1], texture = null) {
        super(scene);
        this.slices = slices;
        this.stacks = stacks;
        
        this.coneAppearance = new CGFappearance(this.scene);
        
        if (texture) {
            this.coneAppearance.setTexture(texture);
            this.coneAppearance.setTextureWrap('REPEAT', 'REPEAT');
        }
        
        this.coneAppearance.setAmbient(...color);
        this.coneAppearance.setDiffuse(...color);
        this.coneAppearance.setSpecular(0.1, 0.1, 0.1, 1.0);
        this.coneAppearance.setShininess(10.0);
        
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
                
                this.texCoords.push(slice / this.slices, 1 - (y));
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
                0.5 + 0.5 * Math.cos(angle), 
                0.5 + 0.5 * Math.sin(angle)
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
        this.coneAppearance.apply();
        super.display();
    }
}