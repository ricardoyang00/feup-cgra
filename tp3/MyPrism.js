import {CGFobject} from '../lib/CGF.js';
/**
 * MyPrism
 * @constructor
 * @param scene - Reference to MyScene object
 * @param slices
 * @param stacks
 */
export class MyPrism extends CGFobject {
    constructor(scene, slices, stacks)
    {
        super(scene)
        this.slices = slices
        this.stacks = stacks;
        this.initBuffers();
    }
    
    initBuffers() {
        this.vertices = [];
        this.indices = [];
        this.normals = [];

        const angleIncrement = 2 * Math.PI / this.slices;
        const stackHeight = 1.0 / this.stacks;

        for (let stack = 0; stack < this.stacks; stack++) {
            for (let slice = 0; slice < this.slices; slice++) {
                const angle = slice * angleIncrement;
                const nextAngle = (slice + 1) * angleIncrement;

                const x1 = Math.cos(angle);
                const y1 = Math.sin(angle);
                const x2 = Math.cos(nextAngle);
                const y2 = Math.sin(nextAngle);

                // vertices for the current slice
                this.vertices.push(x1, y1, stack * stackHeight);
                this.vertices.push(x2, y2, stack * stackHeight);
                this.vertices.push(x1, y1, (stack + 1) * stackHeight);
                this.vertices.push(x2, y2, (stack + 1) * stackHeight);

                // normals for the current slice
                const normalAngle = angle + angleIncrement / 2;
                const nx = Math.cos(normalAngle);
                const ny = Math.sin(normalAngle);

                this.normals.push(nx, ny, 0);
                this.normals.push(nx, ny, 0);
                this.normals.push(nx, ny, 0);
                this.normals.push(nx, ny, 0);

                if (stack < this.stacks) {
                    const current = stack * this.slices * 4 + slice * 4;

                    // indices for the 2 triangles of the current slice
                    this.indices.push(current, current + 1, current + 2);
                    this.indices.push(current + 1, current + 3, current + 2);
                }
            }
        }

        //The defined indices (and corresponding vertices)
        //will be read in groups of three to draw triangles
        this.primitiveType = this.scene.gl.TRIANGLES;

        this.initGLBuffers();
    }
}

