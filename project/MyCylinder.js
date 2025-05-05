import { CGFobject, CGFappearance } from '../lib/CGF.js';

/**
 * MyCylinder
 * @constructor
 * @param scene - Reference to MyScene object
 * @param slices - Number of slices around the cylinder
 * @param stacks - Number of stacks along the height
 * @param color - Color to tint the texture
 * @param texture - Texture to apply to the cylinder
 * @param includeTopCap - Whether to include the top cap
 * @param doubleSided - Whether to make both sides of the cylinder visible
 */
export class MyCylinder extends CGFobject {
    constructor(
        scene, 
        slices = 8, 
        stacks = 4, 
        color = [1, 1, 1, 1], 
        texture = nul, 
        includeTopCap = true, 
        doubleSided = false,
        topRadius = 1.0,
        bottomRadius = 1.0
    ) {
        super(scene);
        this.slices = slices;
        this.stacks = stacks;
        this.includeTopCap = includeTopCap;
        this.doubleSided = doubleSided;
        this.topRadius = topRadius;
        this.bottomRadius = bottomRadius;

        this.cylinderAppearance = new CGFappearance(this.scene);

        if (texture) {
            this.cylinderAppearance.setTexture(texture);
            this.cylinderAppearance.setTextureWrap('REPEAT', 'REPEAT');
        }

        this.cylinderAppearance.setAmbient(...color);
        this.cylinderAppearance.setDiffuse(...color);
        this.cylinderAppearance.setSpecular(0.1, 0.1, 0.1, 1.0);
        this.cylinderAppearance.setShininess(10.0);

        this.initBuffers();
    }

    initBuffers() {
        this.vertices = [];
        this.indices = [];
        this.normals = [];
        this.texCoords = [];

        const angleIncrement = (2 * Math.PI) / this.slices;
        const heightIncrement = 1.0 / this.stacks;

        // Side vertices
        for (let stack = 0; stack <= this.stacks; stack++) {
            const y = stack * heightIncrement;

            for (let slice = 0; slice <= this.slices; slice++) {
                const angle = slice * angleIncrement;
                const x = Math.cos(angle);
                const z = Math.sin(angle);

                this.vertices.push(x, y, z);
                this.normals.push(x, 0, z);
                this.texCoords.push(slice / this.slices, 1 - y);
            }
        }

        // Side indices
        for (let stack = 0; stack < this.stacks; stack++) {
            for (let slice = 0; slice < this.slices; slice++) {
                const first = stack * (this.slices + 1) + slice;
                const second = first + this.slices + 1;

                this.indices.push(first, second, first + 1);
                this.indices.push(second, second + 1, first + 1);
            }
        }

        // Bottom cap
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
            this.texCoords.push(0.5 + 0.5 * x, 0.5 + 0.5 * z);

            if (slice > 0) {
                this.indices.push(baseCenterIndex, baseCenterIndex + slice, baseCenterIndex + slice + 1);
            }
        }

        // Top cap (only if includeTopCap is true)
        if (this.includeTopCap) {
            const topCenterIndex = this.vertices.length / 3;
            this.vertices.push(0, 1, 0);
            this.normals.push(0, 1, 0);
            this.texCoords.push(0.5, 0.5);
        
            for (let slice = 0; slice <= this.slices; slice++) {
                const angle = slice * angleIncrement;
                const x = Math.cos(angle);
                const z = Math.sin(angle);
            
                this.vertices.push(x, 1, z);
                this.normals.push(0, 1, 0);
                this.texCoords.push(0.5 + 0.5 * x, 0.5 + 0.5 * z);
            
                if (slice > 0) {
                    this.indices.push(topCenterIndex, topCenterIndex + slice + 1, topCenterIndex + slice);
                }
            }
        }

        // If double-sided is enabled, duplicate vertices and normals for inside faces
        if (this.doubleSided) {
            const vertexCount = this.vertices.length / 3;
            const originalVertices = [...this.vertices];
            const originalNormals = [...this.normals];
            const originalIndices = [...this.indices];

            // Duplicate vertices and reverse normals for the inside faces
            for (let i = 0; i < vertexCount; i++) {
                this.vertices.push(originalVertices[i * 3], originalVertices[i * 3 + 1], originalVertices[i * 3 + 2]);
                this.normals.push(-originalNormals[i * 3], -originalNormals[i * 3 + 1], -originalNormals[i * 3 + 2]);
            }

            // Duplicate indices for the inside faces (reversed order)
            for (let i = 0; i < originalIndices.length; i += 3) {
                this.indices.push(
                    originalIndices[i + 2] + vertexCount,
                    originalIndices[i + 1] + vertexCount,
                    originalIndices[i] + vertexCount
                );
            }
        }

        this.primitiveType = this.scene.gl.TRIANGLES;
        this.initGLBuffers();
    }

    display() {
        if (this.texture) {
            this.texture.bind();
        }

        this.cylinderAppearance.apply();
        super.display();
    }
}