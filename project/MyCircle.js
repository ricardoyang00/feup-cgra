import { CGFobject, CGFappearance } from '../lib/CGF.js';

export class MyCircle extends CGFobject {
    constructor(scene, slices, bothSides = false) {
        super(scene);
        this.slices = slices;
        this.bothSides = bothSides;
        this.initBuffers();
    }

    initBuffers() {
        this.vertices = [];
        this.indices = [];
        this.normals = [];
        this.texCoords = [];

        const angleIncrement = (2 * Math.PI) / this.slices;

        // Center vertex
        this.vertices.push(0, 0, 0);
        this.normals.push(0, 0, 1);
        this.texCoords.push(0.5, 0.5);

        for (let i = 0; i <= this.slices; i++) {
            const angle = i * angleIncrement;
            const x = Math.cos(angle);
            const y = Math.sin(angle);

            this.vertices.push(x, y, 0);
            this.normals.push(0, 0, 1);
            this.texCoords.push(0.5 + x * 0.5, 0.5 - y * 0.5);

            if (i > 0) {
                this.indices.push(0, i, i + 1);
            }
        }

        if (this.bothSides) {
            const offset = this.vertices.length / 3;
            // Center vertex for back face
            this.vertices.push(0, 0, 0);
            this.normals.push(0, 0, -1);
            this.texCoords.push(0.5, 0.5);

            for (let i = 0; i <= this.slices; i++) {
                const angle = i * angleIncrement;
                const x = Math.cos(angle);
                const y = Math.sin(angle);

                this.vertices.push(x, y, 0);
                this.normals.push(0, 0, -1);
                this.texCoords.push(0.5 + x * 0.5, 0.5 - y * 0.5);

                if (i > 0) {
                    this.indices.push(offset, offset + i + 1, offset + i);
                }
            }
        }

        this.primitiveType = this.scene.gl.TRIANGLES;
        this.initGLBuffers();
    }

    display() {
        if (this.appearance) this.appearance.apply();
        super.display();
    }
}