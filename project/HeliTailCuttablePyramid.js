import { CGFobject, CGFappearance } from '../lib/CGF.js';

/**
 * A right pyramid with its apex at the midpoint of the front edge of the base (Y = 0).
 * Base lies in the X–Y plane at Z = 0, extending positively along X (width) and Y (depth).
 * Height extends along +Z. Supports slicing off the tip parallel to the base.
 */
export class HeliTailCuttablePyramid extends CGFobject {
    /**
     * @param {CGFscene} scene
     * @param {number} width     Full width of the base along X
     * @param {number} depth     Full depth of the base along Y
     * @param {number} height    Full height along Z
     * @param {number} cutHeight Height from base (Z=0) where to slice off the apex
     */
    constructor(scene, width, depth, height, cutHeight = 0, color = [1, 1, 1, 1], texture = null) {
        super(scene);
        this.width = width;
        this.depth = depth;
        this.height = height;
        this.cutHeight = Math.max(0, Math.min(cutHeight, height - 1e-6));

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
        const { width, depth, height, cutHeight } = this;
        const apex = [ width / 2, 0, height ];
        
        // Interpolation factor: u=0 at apex, u=1 at base plane Z=0
        const u = (height - cutHeight) / height;

        // Base corners in X–Y plane at Z=0
        const BL = [ 0,      0,      0 ]; // front-left
        const BR = [ width,  0,      0 ]; // front-right
        const TR = [ width,  depth,  0 ]; // back-right
        const TL = [ 0,      depth,  0 ]; // back-left

        // Compute cut-plane via linear interp between apex and each base corner
        const lerp = B => [
            apex[0] + u * (B[0] - apex[0]),
            apex[1] + u * (B[1] - apex[1]),
            apex[2] + u * (B[2] - apex[2])
        ];
        const CBL = lerp(BL);
        const CBR = lerp(BR);
        const CTR = lerp(TR);
        const CTL = lerp(TL);

        this.vertices = [];
        this.indices = [];
        this.normals = [];
        this.texCoords = [];

        // Push a quad (v0, v1, v2, v3) as two tris, computing face normal
        const pushQuad = (v0, v1, v2, v3, tex) => {
            const idx = this.vertices.length / 3;
            [v0, v1, v2, v3].forEach(v => this.vertices.push(...v));
            this.indices.push(idx, idx+1, idx+2, idx, idx+2, idx+3);
            
            // compute normal
            const U = [v1[0]-v0[0], v1[1]-v0[1], v1[2]-v0[2]];
            const V = [v2[0]-v0[0], v2[1]-v0[1], v2[2]-v0[2]];
            let N = [
                U[1]*V[2] - U[2]*V[1],
                U[2]*V[0] - U[0]*V[2],
                U[0]*V[1] - U[1]*V[0]
            ];
            const len = Math.hypot(...N);
            N = N.map(c => c / len);
            for (let i = 0; i < 4; i++) this.normals.push(...N);

            this.texCoords.push(...tex);
        };

        const sideTexCoords = (bottomLen, topLen, heightDelta) => [
            0, 0,
            1, 0,
            1, 1,
            0, 1
        ];
        
        // Base face (points downward along -Z)
        pushQuad(
            BR, BL, TL, TR,
            [
                1, 0,
                0, 0,
                0, 1,
                1, 1
            ]
        );

        // Side faces (trapezoids) connecting base to cut-plane
        pushQuad(BL, BR, CBR, CBL, sideTexCoords(width, width * u, height - cutHeight)); // front
        pushQuad(BR, TR, CTR, CBR, sideTexCoords(depth, depth * u, height - cutHeight)); // right
        pushQuad(TR, TL, CTL, CTR, sideTexCoords(width, width * u, height - cutHeight)); // back
        pushQuad(TL, BL, CBL, CTL, sideTexCoords(depth, depth * u, height - cutHeight)); // left

        // Top face at cut (points upward along +Z) — reverse winding
        const topIdx = this.vertices.length / 3;
        [CBR, CBL, CTL, CTR].forEach(v => this.vertices.push(...v));
        // tri1: CBR, CTL, CBL; tri2: CBR, CTR, CTL
        this.indices.push(topIdx, topIdx+2, topIdx+1,
                          topIdx, topIdx+3, topIdx+2);

        this.texCoords.push(
            1, 0,
            0, 0,
            0, 1,
            1, 1
        );
        
        for (let i = 0; i < 4; i++) this.normals.push(0, 0, 1);

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
