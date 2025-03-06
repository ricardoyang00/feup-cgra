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
            // bottom
            0.5, -0.5, 0.5,     // 0 - Bottom right front   
            -0.5, -0.5, 0.5,    // 1 - Bottom left front
            -0.5, -0.5, -0.5,   // 2 - Bottom left back
            0.5, -0.5, -0.5,    // 3 - Bottom right back

            // top
            -0.5, 0.5, 0.5,     // 4 - Top left front
            0.5, 0.5, 0.5,      // 5 - Top right front
            0.5, 0.5, -0.5,     // 6 - Top right back
            -0.5, 0.5, -0.5,    // 7 - Top left back

            // left
            -0.5, -0.5, -0.5,   // 8 - Bottom left back
            -0.5, -0.5, 0.5,    // 9 - Bottom left front
            -0.5, 0.5, 0.5,     // 10 - Top left front
            -0.5, 0.5, -0.5,    // 11 - Top left back

            // right
            0.5, -0.5, 0.5,     // 12 - Bottom right front   
            0.5, -0.5, -0.5,    // 13 - Bottom right back
            0.5, 0.5, -0.5,     // 14 - Top right back
            0.5, 0.5, 0.5,      // 15 - Top right front
            
            // front
            -0.5, -0.5, 0.5,    // 16 - Bottom left front
            0.5, -0.5, 0.5,     // 17 - Bottom right front   
            0.5, 0.5, 0.5,      // 18 - Top right front
            -0.5, 0.5, 0.5,     // 19 - Top left front

            // back
            0.5, -0.5, -0.5,    // 20 - Bottom right back
            -0.5, -0.5, -0.5,   // 21 - Bottom left back
            -0.5, 0.5, -0.5,    // 22 - Top left back
            0.5, 0.5, -0.5      // 23 - Top right back
        ];
            

        this.normals = [
            0,-1,0,    
            0,-1,0,    
            0,-1,0,     
            0,-1,0,  

            0,1,0,      
            0,1,0,      
            0,1,0,      
            0,1,0,   

            -1,0,0,    
            -1,0,0,    
            -1,0,0,    
            -1,0,0,   

            1,0,0,     
            1,0,0,     
            1,0,0,     
            1,0,0,  

            0,0,1,      
            0,0,1,      
            0,0,1,      
            0,0,1, 

            0,0,-1,     
            0,0,-1,     
            0,0,-1,     
            0,0,-1
        ];

        //Counter-clockwise reference of vertices
        this.indices = [
            0,1,2,
            2,3,0,

            4,5,6,
            6,7,4,

            8,9,10,
            10,11,8,

            12,13,14,
            14,15,12,

            16,17,18,
            18,19,16,

            20,21,22,
            22,23,20
        ];

        //The defined indices (and corresponding vertices)
        //will be read in groups of three to draw triangles
        this.primitiveType = this.scene.gl.TRIANGLES;

        this.initGLBuffers();
    }

}