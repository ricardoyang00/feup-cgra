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

            -0.5, -0.5, 0.5,    // 8 - Bottom left front
            0.5, -0.5, 0.5,     // 9 - Bottom right front   
            0.5, -0.5, -0.5,    // 10 - Bottom right back
            -0.5, -0.5, -0.5,   // 11 - Bottom left back
            
            -0.5, 0.5, 0.5,     // 12 - Top left front
            0.5, 0.5, 0.5,      // 13 - Top right front
            0.5, 0.5, -0.5,     // 14 - Top right back
            -0.5, 0.5, -0.5,    // 15 - Top left back

            -0.5, -0.5, 0.5,    // 16 - Bottom left front
            0.5, -0.5, 0.5,     // 17 - Bottom right front   
            0.5, -0.5, -0.5,    // 18 - Bottom right back
            -0.5, -0.5, -0.5,   // 19 - Bottom left back
            
            -0.5, 0.5, 0.5,     // 20 - Top left front
            0.5, 0.5, 0.5,      // 21 - Top right front
            0.5, 0.5, -0.5,     // 22 - Top right back
            -0.5, 0.5, -0.5,    // 23 - Top left back
        ];

        this.normals = [
            -1,0,0,     // 0
            1,0,0,      // 1
            1,0,0,      // 2
            -1,0,0,     // 3
            -1,0,0,     // 4
            1,0,0,      // 5
            1,0,0,      // 6
            -1,0,0,     // 7

            0,-1,0,     // 8
            0,-1,0,     // 9
            0,-1,0,     // 10
            0,-1,0,     // 11
            0,1,0,      // 12
            0,1,0,      // 13
            0,1,0,      // 14
            0,1,0,      // 15

            0,0,1,      // 16
            0,0,1,      // 17
            0,0,-1,     // 18
            0,0,-1,     // 19
            0,0,1,      // 20
            0,0,1,      // 21
            0,0,-1,     // 22
            0,0,-1,     // 23            
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