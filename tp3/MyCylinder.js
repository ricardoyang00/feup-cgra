import {CGFobject} from '../lib/CGF.js';
/**
 * MyCylinder
 * @constructor
 * @param scene - Reference to MyScene object
 * @param slices
 * @param stacks
 */
export class MyCylinder extends CGFobject {
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

        
        for (let stack = 0; stack <= this.stacks; stack++) {
            for (let slice = 0; slice <= this.slices; slice++) {
                const angle = slice * angleIncrement;
                const x = Math.cos(angle);
                const y = Math.sin(angle);

                // vertices for the current slice
                this.vertices.push(x, y, stack * stackHeight);

                // normals for the current slice
                this.normals.push(x, y, 0);

                // indices for the 2 triangles of the current slice
                if (stack < this.stacks && slice < this.slices) {
                    const current = stack * (this.slices + 1) + slice;
                    const next = current + this.slices + 1;

                    this.indices.push(current, current + 1, next);
                    this.indices.push(current + 1, next + 1, next);
                }
            }
        }

        this.primitiveType = this.scene.gl.TRIANGLES;
        this.initGLBuffers();
    }
}

