import { CGFobject } from '../../lib/CGF.js';

export class MySphere extends CGFobject {
    constructor(scene, slices, stacks, inverted = false) {
        super(scene);
        this.slices = slices;
        this.stacks = stacks;
        this.inverted = inverted;
        this.initBuffers();
    }

    initBuffers() {
        this.vertices = [];
        this.indices = [];
        this.normals = [];
        this.texCoords = [];

        const angleIncrement = 2 * Math.PI / this.slices;
        const stackIncrement = Math.PI / this.stacks;

        for (let stack = 0; stack <= this.stacks; stack++) {
            const phi = stack * stackIncrement; // Angle from the positive Y-axis
            const sinPhi = Math.sin(phi);
            const cosPhi = Math.cos(phi);

            for (let slice = 0; slice <= this.slices; slice++) {
                const theta = slice * angleIncrement; // Angle around the Y-axis
                const sinTheta = Math.sin(theta);
                const cosTheta = Math.cos(theta);

                // Calculate vertex position
                const x = sinPhi * cosTheta;
                const y = cosPhi;
                const z = sinPhi * sinTheta;

                this.vertices.push(x, y, z);

                if (this.inverted) {
                    this.normals.push(-x, -y, -z);
                } else {
                    this.normals.push(x, y, z);
                }

                // Texture coordinates
                const u = slice / this.slices;
                const v = stack / this.stacks;
                this.texCoords.push(u, v);

                // Indices for the two triangles of the current slice
                if (stack < this.stacks && slice < this.slices) {
                    const current = stack * (this.slices + 1) + slice;
                    const next = current + this.slices + 1;

                    if (this.inverted) {
                        this.indices.push(current, next, current + 1);
                        this.indices.push(current + 1, next, next + 1);
                    } else {
                        this.indices.push(current, current + 1, next);
                        this.indices.push(current + 1, next + 1, next);
                    }
                }
            }
        }

        this.primitiveType = this.scene.gl.TRIANGLES;
        this.initGLBuffers();
    }
}