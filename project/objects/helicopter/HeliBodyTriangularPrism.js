import { CGFobject, CGFappearance, CGFtexture } from '../../../lib/CGF.js';

export class HeliBodyTriangularPrism extends CGFobject {
    constructor(scene, width, depth, height, color = [0.5, 0.5, 0.5, 1], texture = null) {
        super(scene);
        this.width = width;  // Length of the prism (horizontal growth along x-axis)
        this.depth = depth;  // Depth of the triangular base (along negative Z-axis)
        this.height = height; // Height of the triangular base (along Y-axis)

        this.appearance = new CGFappearance(this.scene);
        this.appearance.setAmbient(...color);
        this.appearance.setDiffuse(...color);
        this.appearance.setSpecular(0.2, 0.2, 0.2, 1);
        this.appearance.setShininess(10);

        if (texture) {
            this.appearance.setTexture(texture);
            this.appearance.setTextureWrap('REPEAT', 'REPEAT');
        }

        this.initBuffers();
    }

    initBuffers() {
        this.vertices = [
            // Left triangle (ZY plane, 90-degree angle at origin)
            0, 0, 0,                      // Bottom-left (0)
            0, this.height, 0,            // Top-left (1)
            0, 0, -this.depth,            // Bottom-right (2)

            // Right triangle (ZY plane, translated along X-axis)
            this.width, 0, 0,             // Bottom-left (3)
            this.width, this.height, 0,   // Top-left (4)
            this.width, 0, -this.depth,   // Bottom-right (5)

            // Bottom rectangle
            0, 0, 0,                      // Bottom-left (6)
            this.width, 0, 0,             // Bottom-right (7)
            this.width, 0, -this.depth,   // Top-right (8)
            0, 0, -this.depth,            // Top-left (9)

            0, 0, 0,                      // Bottom-left (10)
            0, this.height, 0,            // Top-left (11)
            this.width, this.height, 0,   // Top-right (12)
            this.width, 0, 0,             // Bottom-right (13)

            0, 0, -this.depth,            // Bottom-right (14)
            0, this.height, 0,            // Top-right (15)
            this.width, this.height, 0,   // Top-left (16)
            this.width, 0, -this.depth,   // Bottom-left (17)
        ];

        this.indices = [
            // Left triangle
            0, 1, 2,

            // Right triangle
            3, 5, 4,

            // Bottom face
            6, 8, 7,
            6, 9, 8,

            // Back face
            10, 13, 12,
            10, 12, 11,

            // Front face
            14, 15, 16,
            14, 16, 17,
        ];

        this.normals = [
            // Normals for the left triangle
            -1, 0, 0,
            -1, 0, 0,
            -1, 0, 0,

            // Normals for the right triangle
            1, 0, 0,
            1, 0, 0,
            1, 0, 0,

            // Normals for the bottom face
            0, -1, 0,
            0, -1, 0,
            0, -1, 0,
            0, -1, 0,

            // Normals for the back face (faces positive Z)
            0, 0, 1,
            0, 0, 1,
            0, 0, 1,
            0, 0, 1,
            
            // Normals for the front face (faces negative Z)
            0, 1, -1,
            0, 1, -1,
            0, 1, -1,
            0, 1, -1,
        ];

        this.texCoords = [
            // Left triangle (map whole texture onto triangle)
            0, 0,
            0, 1,
            1, 0,
    
            // Right triangle (same mapping)
            0, 0,
            0, 1,
            1, 0,
    
            // Bottom face (rectangle width x depth)
            0, 0,
            this.width, 0,
            this.width, this.depth,
            0, this.depth,
    
            // Back face (rectangle width x height)
            0, 0,
            0, this.height,
            this.width, this.height,
            this.width, 0,
    
            // Front face (rectangle "diagonal" face)
            0, 0,
            0, Math.sqrt(this.depth * this.depth + this.height * this.height),
            this.width, Math.sqrt(this.depth * this.depth + this.height * this.height),
            this.width, 0,
        ];
        
        this.primitiveType = this.scene.gl.TRIANGLES;
        this.initGLBuffers();
    }

    display() {
        if (this.texture) {
            this.texture.bind();
        }

        this.appearance.apply();
        super.display();
    }
}