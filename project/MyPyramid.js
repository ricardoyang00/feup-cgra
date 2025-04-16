import { CGFobject, CGFappearance } from '../lib/CGF.js';
import { MyTriangle } from './MyTriangle.js';
import { MyQuad } from './MyQuad.js';

/**
 * MyPyramid
 * @constructor
 * @param scene - Reference to MyScene object
 * @param slices - Number of slices (around the pyramid)
 * @param stacks - Number of stacks (height divisions)
 * @param color - Color to tint the texture
 * @param texture - Texture to apply to the pyramid
 */
export class MyPyramid extends CGFobject {
    constructor(scene, slices = 4, stacks = 1, color = [1, 1, 1, 1], texture = null) {
        super(scene);
        this.slices = slices;
        this.stacks = stacks;
        
        this.pyramidAppearance = new CGFappearance(this.scene);
        
        if (texture) {
            this.pyramidAppearance.setTexture(texture);
            this.pyramidAppearance.setTextureWrap('REPEAT', 'REPEAT');
        }
        
        this.pyramidAppearance.setAmbient(...color);
        this.pyramidAppearance.setDiffuse(...color);
        this.pyramidAppearance.setSpecular(0.1, 0.1, 0.1, 1.0);
        this.pyramidAppearance.setShininess(10.0);
        
        this.initBuffers();
    }
    
    initBuffers() {
        this.vertices = [];
        this.indices = [];
        this.normals = [];
        this.texCoords = [];
        
        const angleIncrement = (2 * Math.PI) / this.slices;
        const heightIncrement = 1.0 / this.stacks;
        
        for (let stack = 0; stack <= this.stacks; stack++) {
            const radius = 1 - (stack * heightIncrement);
            const y = stack * heightIncrement;
            
            for (let slice = 0; slice <= this.slices; slice++) {
                const angle = slice * angleIncrement;
                const x = radius * Math.cos(angle);
                const z = radius * Math.sin(angle);
                
                this.vertices.push(x, y, z);
                
                const normalX = Math.cos(angle);
                const normalZ = Math.sin(angle);
                const normalY = 0.5;
                const normalLength = Math.sqrt(normalX * normalX + normalY * normalY + normalZ * normalZ);
                
                this.normals.push(normalX / normalLength, normalY / normalLength, normalZ / normalLength);
                
                this.texCoords.push(slice / this.slices, 1 - (stack / this.stacks));
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
        
        for (let slice = 0; slice < this.slices; slice++) {
            const angle = slice * angleIncrement;
            const nextAngle = (slice + 1) * angleIncrement;
            
            const x1 = Math.cos(angle);
            const z1 = Math.sin(angle);
            const x2 = Math.cos(nextAngle);
            const z2 = Math.sin(nextAngle);
            
            this.vertices.push(x1, 0, z1);
            this.normals.push(0, -1, 0);
            this.texCoords.push(0.5 + 0.5 * Math.cos(angle), 0.5 + 0.5 * Math.sin(angle));

            const baseVertexIndex = baseCenterIndex + 1 + slice;
            this.indices.push(
                baseCenterIndex,
                baseVertexIndex,
                slice === this.slices - 1 ? baseCenterIndex + 1 : baseVertexIndex + 1
            );
        }
        
        this.primitiveType = this.scene.gl.TRIANGLES;
        this.initGLBuffers();
    }
    
    display() {
        this.pyramidAppearance.apply();
        super.display();
    }
}