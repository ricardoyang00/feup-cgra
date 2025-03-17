import {CGFobject} from '../lib/CGF.js';
/**
 * MyTriangleBig
 * @constructor
 * @param scene - Reference to MyScene object
 */
export class MyTriangleBig extends CGFobject {
	constructor(scene, textureCoordinates) {
		super(scene);
        this.texCoords = textureCoordinates;
		this.initBuffers();
	}

    initBuffers() {
		this.vertices = [
            // Front
            -2, 0, 0,	// 0
            2, 0, 0,	// 1
            0, 2, 0,	// 2

            // Back
            -2, 0, 0,	// 3
            2, 0, 0,	// 4
            0, 2, 0,	// 5
        ];

        this.normals = [
            // Front
            0, 0, 1,	// 0
            0, 0, 1,	// 1
            0, 0, 1,	// 2

            // Back
            0, 0, -1,	// 3
            0, 0, -1,	// 4
            0, 0, -1,	// 5
        ];

        // Counter-clockwise reference of vertices
        this.indices = [
            // Front
            0, 1, 2,

            // Back
            3, 5, 4
        ];

		//The defined indices (and corresponding vertices)
		//will be read in groups of three to draw triangles
		this.primitiveType = this.scene.gl.TRIANGLES;

		this.initGLBuffers();
	}

}