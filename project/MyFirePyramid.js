import { CGFobject } from '../lib/CGF.js';

/**
 * MyFirePyramid - Pyramid with 4 faces
 * @constructor
 * @param scene - Reference to MyScene object
 */
export class MyFirePyramid extends CGFobject {
    constructor(scene) {
        super(scene);
        this.initBuffers();
    }

    initBuffers() {
        this.vertices = [
            // Base vertices
            -1, 0, -1,  // 0: Bottom-left
            1, 0, -1,   // 1: Bottom-right
            1, 0, 1,    // 2: Top-right
            -1, 0, 1,   // 3: Top-left

            // Apex
            0, 1, 0     // 4: Apex
        ];

        this.indices = [
            // Base (square)
            0, 1, 2,
            0, 2, 3,

            // Faces
            0, 4, 1,    // Front face
            1, 4, 2,    // Right face
            2, 4, 3,    // Back face
            3, 4, 0     // Left face
        ];

        this.normals = [
            // Base normals (pointing down)
            0, -1, 0,
            0, -1, 0,
            0, -1, 0,
            0, -1, 0,

            // Apex normal (placeholder, normals for faces are calculated per face)
            0, 1, 0
        ];

        // Calculate normals for the faces
        const apex = [0, 1, 0];
        const baseVertices = [
            [-1, 0, -1], // 0
            [1, 0, -1],  // 1
            [1, 0, 1],   // 2
            [-1, 0, 1]   // 3
        ];

        for (let i = 0; i < 4; i++) {
            const current = baseVertices[i];
            const next = baseVertices[(i + 1) % 4];

            // Calculate two vectors: from apex to current and from apex to next
            const vector1 = [current[0] - apex[0], current[1] - apex[1], current[2] - apex[2]];
            const vector2 = [next[0] - apex[0], next[1] - apex[1], next[2] - apex[2]];

            // Compute the cross product to get the normal
            const normal = [
                vector1[1] * vector2[2] - vector1[2] * vector2[1],
                vector1[2] * vector2[0] - vector1[0] * vector2[2],
                vector1[0] * vector2[1] - vector1[1] * vector2[0]
            ];

            // Normalize the normal
            const length = Math.sqrt(normal[0] ** 2 + normal[1] ** 2 + normal[2] ** 2);
            normal[0] /= length;
            normal[1] /= length;
            normal[2] /= length;

            // Add the same normal for the three vertices of the face
            this.normals.push(...normal, ...normal, ...normal);
        }

        this.texCoords = [
            // Base texture coordinates
            0, 0,
            1, 0,
            1, 1,
            0, 1,

            // Apex texture coordinate
            0.5, 0.5
        ];

        this.primitiveType = this.scene.gl.TRIANGLES;
        this.initGLBuffers();
    }
}