import { CGFobject } from '../lib/CGF.js';

/**
 * MyTriangle
 * @constructor
 * @param scene - Reference to MyScene object
 */
export class MyTriangleDoubleFaced extends CGFobject {
    constructor(scene, scaleFactor = 1) {
        super(scene);
        this.scaleFactor = scaleFactor
        this.initBuffers();
    }

    initBuffers() {
        this.vertices = [
            0, 1, 0,  // Vertex 0
            -1, -1, 0,  // Vertex 1
            1, -1, 0,   // Vertex 2
        ];

        // Counter-clockwise and clockwise winding order for both faces
        this.indices = [
            0, 1, 2,     // Front face
            2, 1, 0      // Back face (reversed winding order)
        ];

        this.normals = [
            0, 0, 1,  // Normal for Vertex 0 (front)
            0, 0, 1,  // Normal for Vertex 1 (front)
            0, 0, 1,  // Normal for Vertex 2 (front)
            0, 0, -1, // Normal for Vertex 2 (back)
            0, 0, -1, // Normal for Vertex 1 (back)
            0, 0, -1  // Normal for Vertex 0 (back)
        ];

        this.texCoords = [
            0.5 * this.scaleFactor, 0,
            0, 1 * this.scaleFactor,
            1 * this.scaleFactor, 1 * this.scaleFactor
        ];

        this.primitiveType = this.scene.gl.TRIANGLES;
        this.initGLBuffers();
    }
}