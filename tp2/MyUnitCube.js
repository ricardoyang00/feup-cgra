import {CGFobject} from '../lib/CGF.js';
/**
 * MyUnitCube
 * @constructor
 * @param scene - Reference to MyScene object
 */
export class MyUnitCube extends CGFobject {
    constructor(scene) {
        super(scene);
        this.initBuffers();
    }

    initBuffers() {
        this.vertices = [
            -0.5, -0.5, 0.5,    // 0 - Bottom left front
            0.5, -0.5, 0.5,     // 1 - Bottom right front   
            0.5, -0.5, -0.5,    // 2 - Bottom right back
            -0.5, -0.5, -0.5,   // 3 - Bottom left back

            -0.5, 0.5, 0.5,     // 4 - Top left front
            0.5, 0.5, 0.5,      // 5 - Top right front
            0.5, 0.5, -0.5,     // 6 - Top right back
            -0.5, 0.5, -0.5,    // 7 - Top left back
        ];

        //Counter-clockwise reference of vertices
        this.indices = [
            // base
            1, 0, 3,
            3, 2, 1,

            // front
            4, 0, 1,
            1, 5, 4,

            // right
            5, 1, 2,
            2, 6, 5,

            // back
            6, 2, 3,
            3, 7, 6,

            // left
            7, 3, 0,
            0, 4, 7,

            // top
            7, 4, 5,
            5, 6, 7,
        ];

        //The defined indices (and corresponding vertices)
        //will be read in groups of three to draw triangles
        this.primitiveType = this.scene.gl.TRIANGLES;

        this.initGLBuffers();
    }

}