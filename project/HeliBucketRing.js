import { CGFobject } from '../lib/CGF.js';

export class HeliBucketRing extends CGFobject {
    constructor(scene, slices, innerRadius, outerRadius) {
        super(scene);
        this.slices = slices;
        this.innerRadius = innerRadius;
        this.outerRadius = outerRadius;

        this.initBuffers();
    }

    initBuffers() {
        this.vertices = [];
        this.indices = [];
        this.normals = [];
        this.texCoords = [];

        const angleIncrement = (2 * Math.PI) / this.slices;

        // Generate vertices, normals, and texture coordinates
        for (let i = 0; i <= this.slices; i++) {
            const angle = i * angleIncrement;
            const xOuter = this.outerRadius * Math.cos(angle);
            const zOuter = this.outerRadius * Math.sin(angle);
            const xInner = this.innerRadius * Math.cos(angle);
            const zInner = this.innerRadius * Math.sin(angle);

            // Outer vertex
            this.vertices.push(xOuter, 0, zOuter);
            this.normals.push(0, 1, 0);
            this.texCoords.push(0.5 + 0.5 * Math.cos(angle), 0.5 + 0.5 * Math.sin(angle));

            // Inner vertex
            this.vertices.push(xInner, 0, zInner);
            this.normals.push(0, 1, 0);
            this.texCoords.push(0.5 + 0.5 * Math.cos(angle), 0.5 + 0.5 * Math.sin(angle));
        }

        // Generate indices
        for (let i = 0; i < this.slices; i++) {
            const firstOuter = 2 * i;
            const firstInner = 2 * i + 1;
            const nextOuter = 2 * (i + 1);
            const nextInner = 2 * (i + 1) + 1;

            this.indices.push(firstOuter, firstInner, nextOuter);
            this.indices.push(firstInner, nextInner, nextOuter);
        }

        this.primitiveType = this.scene.gl.TRIANGLES;
        this.initGLBuffers();
    }

    display() {
        super.display();
    }
}