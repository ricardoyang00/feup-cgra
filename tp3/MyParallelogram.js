import {CGFobject} from '../lib/CGF.js';
/**
 * MyParallelogram
 * @constructor
 * @param scene - Reference to MyScene object
 */
export class MyParallelogram extends CGFobject {
	constructor(scene) {
		super(scene);
		this.initBuffers();
	}

    initBuffers() {
		this.vertices = [
            // Front
            0, 0, 0,	// 0
            2, 0, 0, 	// 1
            3, 1, 0,	// 2
            1, 1, 0,	// 3

            // Back
            0, 0, 0,	// 4
            2, 0, 0, 	// 5
            3, 1, 0,	// 6
            1, 1, 0,	// 7
        ];

        this.normals = [
            // Front
            0, 0, 1,	// 0
            0, 0, 1,	// 1
            0, 0, 1,	// 2
            0, 0, 1,	// 3

            // Back
            0, 0, -1,	// 4
            0, 0, -1,	// 5
            0, 0, -1,	// 6
            0, 0, -1,	// 7
        ];

        // Counter-clockwise reference of vertices
        this.indices = [
            // Front
            0, 1, 3, 
            1, 2, 3,

            // Back
            4, 7, 5,
            5, 7, 6,
        ];

		//The defined indices (and corresponding vertices)
		//will be read in groups of three to draw triangles
		this.primitiveType = this.scene.gl.TRIANGLES;

		this.initGLBuffers();
	}

}