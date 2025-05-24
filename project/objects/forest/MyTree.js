import { CGFobject, CGFtexture, CGFappearance } from '../../../lib/CGF.js';
import { MyCone } from '../../primitives/MyCone.js';
import { MyCylinder } from '../../primitives/MyCylinder.js';
import { MyCircle } from '../../primitives/MyCircle.js';

/**
 * MyTree
 * @constructor
 * @param scene - Reference to MyScene object
 * @param rotation - Rotation in degrees (0º corresponds to vertical position)
 * @param axis - Axis of rotation ('X' or 'Z')
 * @param trunkRadius - Radius of the trunk base
 * @param treeHeight - Total height of the tree
 * @param treeType - 0 for green, 1 for yellow, 2 for orange
 */
export class MyTree extends CGFobject {
    constructor(scene, rotation = 0, axis = 'X', trunkRadius = 0.1, treeHeight = 2, treeType = 0) {
        super(scene);

        this.rotation = rotation;
        this.axis = axis;
        this.trunkRadius = trunkRadius;
        this.treeHeight = treeHeight;

        this.foliageHeight = 0.8 * this.treeHeight;
        this.numPyramids = Math.ceil(this.foliageHeight / 0.5);
        this.pyramidBaseRadius = this.trunkRadius * 3;

        this.shadowTexture = new CGFtexture(scene, 'textures/tree/shadow.png');
        this.shadowQuad = new MyCircle(scene, 32);
        this.shadowMaterial = new CGFappearance(scene);
        this.shadowMaterial.setDiffuse(0, 0, 0, 1);
        this.shadowMaterial.setTexture(this.shadowTexture);

        const trunkTexture = new CGFtexture(scene, 'textures/tree/trunk.png');
        const darkerTone = 0.7;

        // type
        let textureFolder, foliageColor;
        if (treeType === 0) {           // green / original
            textureFolder = 'textures/tree/leaves/original/';
            foliageColor = [0, 0.8*darkerTone, 0]; 
        } else if (treeType === 1) {    // yellow
            textureFolder = 'textures/tree/leaves/yellow/';
            foliageColor = [1*darkerTone, 1*darkerTone, 0]; 
        } else if (treeType === 2) {    // orange
            textureFolder = 'textures/tree/leaves/orange/';
            foliageColor = [1*darkerTone, 0.5*darkerTone, 0]; 
        } else {
            throw new Error('Invalid treeType. Must be 0 (green), 1 (yellow), or 2 (orange).');
        }

        const baseTexture = new CGFtexture(scene, `${textureFolder}leaves-base.png`);
        const sideTextureShadow = new CGFtexture(scene, `${textureFolder}leaves-shadow.png`);
        const sideTextureTop = new CGFtexture(scene, `${textureFolder}leaves.png`);

        this.trunk = new MyCylinder(scene, 16, 4, [0.55, 0.27, 0.07, 1], trunkTexture, 2);
        this.foliage = [];
        for (let i = 0; i < this.numPyramids; i++) {
            const sideTexture = i === this.numPyramids - 1 ? sideTextureTop : sideTextureShadow;
            this.foliage.push(new MyCone(scene, 16, 4, [...foliageColor, 1], sideTexture, baseTexture, 2));
        }
    }

    display() {
        // shadow
        this.scene.pushMatrix();
        this.scene.translate(0, 0.06, 0); 

        var factorX = 3;
        var factorZ = 3.2;

        this.scene.scale(this.trunkRadius * factorX, 1, this.trunkRadius * factorZ);

        this.scene.rotate(-Math.PI / 2, 1, 0, 0);

        this.scene.gl.enable(this.scene.gl.BLEND);
        this.scene.gl.blendFuncSeparate(this.scene.gl.SRC_ALPHA, this.scene.gl.ONE_MINUS_SRC_ALPHA, this.scene.gl.ONE, this.scene.gl.ONE);
        //this.scene.gl.blendFunc(this.scene.gl.SRC_ALPHA, this.scene.gl.ONE_MINUS_SRC_ALPHA);

        //this.shadowTexture.bind();

        this.shadowMaterial.apply();
        this.shadowQuad.display();

        this.scene.popMatrix();


        this.scene.pushMatrix();

        if (this.axis === 'X') {
            this.scene.rotate(this.rotation * Math.PI / 180, 1, 0, 0);
        } else if (this.axis === 'Z') {
            this.scene.rotate(this.rotation * Math.PI / 180, 0, 0, 1);
        }

        // trunk
        this.scene.pushMatrix();
        const trunkHeight = this.treeHeight * 0.2;          // 20% of the tree height
        this.scene.scale(this.trunkRadius, trunkHeight, this.trunkRadius);
        this.trunk.display();
        this.scene.popMatrix();


        // foliage
        let lastTiltAngle, lastTiltAxis, lastYRotation;

        for (let i = 0; i < this.numPyramids; i++) {
            const scaleFactor = 1 - (i / this.numPyramids) * 0.6;
            const yOffset = (this.treeHeight - this.foliageHeight) + (i * (this.foliageHeight / this.numPyramids)) / 3;

            this.scene.pushMatrix();
            this.scene.translate(0, yOffset, 0);

            if (i !== this.numPyramids - 1) {
                const tiltAngle = (this.pseudoRandom(i) * 6) - 3; // -3° to +3°
                const tiltAxis = [
                    this.pseudoRandom(i + 1) * 2 - 1,
                    0,
                    this.pseudoRandom(i + 2) * 2 - 1
                ];
                const yRotation = this.pseudoRandom(i + 1) * 360;

                this.scene.rotate(tiltAngle * Math.PI / 180, ...tiltAxis);
                this.scene.rotate(yRotation * Math.PI / 180, 0, 1, 0);

                if (i === this.numPyramids - 2) {
                    lastTiltAngle = tiltAngle;
                    lastTiltAxis = tiltAxis;
                    lastYRotation = yRotation;
                }
            } else { 
                this.scene.rotate(lastTiltAngle * Math.PI / 180, ...lastTiltAxis);
                this.scene.rotate(lastYRotation * Math.PI / 180, 0, 1, 0);
            }

            this.scene.scale(this.pyramidBaseRadius * scaleFactor, this.foliageHeight / this.numPyramids, this.pyramidBaseRadius * scaleFactor);
            this.foliage[i].display();
            this.scene.popMatrix();
        }

        this.scene.popMatrix();
    }

    pseudoRandom(i) {
        return (Math.sin(i * 8848) * 10000) % 1;
    }
}