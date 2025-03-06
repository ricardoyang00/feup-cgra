import {CGFobject} from '../lib/CGF.js';
/**
 * MyDiamond
 * @constructor
 * @param scene - Reference to MyScene object
 */
export class MyDiamond extends CGFobject {
	constructor(scene) {
		super(scene);
		this.initBuffers();
	}
	
	initBuffers() {
		this.vertices = [
            // Front face
            -1, 0, 0,	// 0
            0, -1, 0,	// 1
            1, 0, 0,	// 2
            0, 1, 0,	// 3

            // Back face
            -1, 0, 0,	// 4
            0, -1, 0,	// 5
            1, 0, 0,	// 6
            0, 1, 0,	// 7
        ];

        this.normals = [
            // Front face normals
            0, 0, 1,	// 0
            0, 0, 1,	// 1
            0, 0, 1,	// 2
            0, 0, 1,	// 3

            // Back face normals
            0, 0, -1,	// 4
            0, 0, -1,	// 5
            0, 0, -1,	// 6
            0, 0, -1,	// 7
        ];

        // Counter-clockwise reference of vertices
        this.indices = [
            // Front face
            0, 1, 2,
            0, 2, 3,

            // Back face
            4, 6, 5,
            4, 7, 6,
        ];

		//The defined indices (and corresponding vertices)
		//will be read in groups of three to draw triangles
		this.primitiveType = this.scene.gl.TRIANGLES;

		this.initGLBuffers();
	}
}

