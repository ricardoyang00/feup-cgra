import { CGFobject } from '../lib/CGF.js';

export class MyFullscreenQuad extends CGFobject {
    constructor(scene) {
        super(scene);
        this.initBuffers();
    }

    initBuffers() {
        const z = -0.1;  // near plane
        const size = 10; // adjust as needed
        this.vertices = [
            -size, -size, z,
            size, -size, z,
            -size, size, z,
            size, size, z
        ];

        this.texCoords = [
            0, 0,
            1, 0,
            0, 1,
            1, 1
        ];

        this.indices = [
            0, 1, 2,
            1, 3, 2
        ];

        this.primitiveType = this.scene.gl.TRIANGLES;
        this.initGLBuffers();
    }
}