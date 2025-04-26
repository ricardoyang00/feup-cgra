import { CGFobject } from '../lib/CGF.js';

export class HeliPyramid extends CGFobject {
    constructor(scene, width, depth, height) {
        super(scene);
        this.width = width;  // Width of the rectangular base (along X-axis)
        this.depth = depth;  // Depth of the rectangular base (along Y-axis)
        this.height = height; // Height of the pyramid (along Z-axis)

        this.initBuffers();
    }

    initBuffers() {
        this.vertices = [
            // Base vertices (XY plane)
            0, 0, 0,                      // Bottom-left corner (0)
            this.width, 0, 0,             // Bottom-right corner (1)
            this.width, this.depth, 0,    // Top-right corner (2)
            0, this.depth, 0,             // Top-left corner (3)

            // Left triangular face (ZY plane)
            0, 0, 0,                      // Bottom-left corner (4)
            0, this.depth, 0,             // Top-left corner (5)
            this.width/2, 0, this.height, // Left Apex (6)

            // Right triangular face (positive X direction)
            this.width, 0, 0,             // Bottom-right corner (7)
            this.width, this.depth, 0,    // Top-right corner (8)
            this.width/2, 0, this.height, // Right Apex (9)

            // Bottom triangular face
            0, 0, 0,                      // Bottom-left corner (10)
            this.width, 0, 0,             // Bottom-right corner (11)
            this.width/2, 0, this.height, // Bottom Apex (12)

            // Top triangular face
            this.width, this.depth, 0,    // Top-right corner (13)
            0, this.depth, 0,             // Top-left corner (14)
            this.width/2, 0, this.height, // Top Apex (15)

            // For side normal calculations
            0, 0, 0,                      // Bottom-left corner (16)
            0, this.depth, 0,             // Top-left corner (17)
            this.width/2, 0, this.height, // Left Apex (18)
            
            this.width, 0, 0,             // Bottom-right corner (19)
            this.width, this.depth, 0,    // Top-right corner (20)
            this.width/2, 0, this.height, // Right Apex (21)

            0, 0, 0,                      // Bottom-left corner (22)
            this.width, 0, 0,             // Bottom-right corner (23)
            this.width/2, 0, this.height, // Bottom Apex (24)

            this.width, this.depth, 0,    // Top-right corner (25)
            0, this.depth, 0,             // Top-left corner (26)
            this.width/2, 0, this.height, // Top Apex (27)
        ];

        this.indices = [
            // Base face (rectangle in XY plane)
            0, 2, 1,
            0, 3, 2,

            // Left triangular face (ZY plane)
            4, 6, 5,

            // Right triangular face (positive X direction)
            7, 8, 9,

            // Bottom triangular face
            10, 11, 12,

            // Top triangular face
            14, 15, 13,
        ];

        this.normals = [
            // Normals for the base face (facing downward in -Z)
            0, 0, -1,
            0, 0, -1,
            0, 0, -1,
            0, 0, -1,

            // Normals for the left triangular face
            -1, 0, 1,
            -1, 0, 1,
            -1, 0, 1,

            // Normals for the right triangular face
            1, 0, 1,
            1, 0, 1,
            1, 0, 1,

            // Normals for the front triangular face
            0, -1, 1,
            0, -1, 1,
            0, -1, 1,

            // Normals for the back triangular face
            0, 1, 1,
            0, 1, 1,
            0, 1, 1,

            // Side Normals
            -1, 0, 0,
            -1, 0, 0,
            -1, 0, 0,

            1, 0, 0,
            1, 0, 0,
            1, 0, 0,

            0, -1, 0,
            0, -1, 0,
            0, -1, 0,

            0, 1, 0,
            0, 1, 0,
            0, 1, 0,
        ];

        this.primitiveType = this.scene.gl.TRIANGLES;
        this.initGLBuffers();
    }

    display() {
        super.display();
    }
}