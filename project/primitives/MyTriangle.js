import {CGFobject} from '../../lib/CGF.js';
/**
 * MyTriangle
 * @constructor
 * @param {MyScene} scene - Reference to MyScene object
 * @param {Array} coords - Array of texture coordinates (optional)
 */
export class MyTriangle extends CGFobject {
    constructor(scene, coords) {
        super(scene);
        this.initBuffers();
        if (coords != undefined)
            this.updateTexCoords(coords);
    }

    initBuffers() {
        this.vertices = [
            -1, -1, 0,  // 0
            1, -1, 0,   // 1
            -1, 1, 0    // 2
        ];

        // Counter-clockwise reference of vertices
        this.indices = [
            0, 1, 2
        ];

        // Facing Z positive
        this.normals = [
            0, 0, 1,
            0, 0, 1,
            0, 0, 1
        ];
        
        /*
        Texture coords (s,t)
        +----------> s
        |
        |
        |
        v
        t
        */

        this.texCoords = [
            0, 1,    // bottom-left
            1, 1,    // bottom-right
            0, 0     // top-left
        ];

        this.primitiveType = this.scene.gl.TRIANGLES;
        this.initGLBuffers();
    }

    /**
     * @method updateTexCoords
     * Updates the list of texture coordinates of the triangle
     * @param {Array} coords - Array of texture coordinates
     */
    updateTexCoords(coords) {
        this.texCoords = [...coords];
        this.updateTexCoordsGLBuffers();
    }
}