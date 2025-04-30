import { CGFobject, CGFtexture, CGFappearance } from '../lib/CGF.js';
import { MyCone } from './MyCone.js';
import { MyCylinder } from './MyCylinder.js';
import { MyQuad } from './MyQuad.js';
import { MyCircle } from './MyCircle.js';

/**
 * MyTree
 * @constructor
 * @param scene - Reference to MyScene object
 * @param rotation - Rotation in degrees (0º corresponds to vertical position)
 * @param axis - Axis of rotation ('X' or 'Z')
 * @param trunkRadius - Radius of the trunk base
 * @param treeHeight - Total height of the tree
 * @param foliageColor - RGB color of the foliage (e.g., [0, 1, 0] for green)
 */
export class MyTree extends CGFobject {
    constructor(scene, rotation = 0, axis = 'X', trunkRadius = 0.1, treeHeight = 2, foliageColor = [0, 0.8, 0]) {
        super(scene);

        this.rotation = rotation;
        this.axis = axis;
        this.trunkRadius = trunkRadius;
        this.treeHeight = treeHeight;
        this.foliageColor = foliageColor;

        this.foliageHeight = 0.8 * this.treeHeight;
        this.numPyramids = Math.ceil(this.foliageHeight / 0.5);
        this.pyramidBaseRadius = this.trunkRadius * 3;

        this.shadowTexture = new CGFtexture(scene, 'textures/shadow.png');
        this.shadowQuad = new MyCircle(scene, 32);
        this.shadowMaterial = new CGFappearance(scene);
        this.shadowMaterial.setDiffuse(0,0,0,1);
        this.shadowMaterial.setTexture(this.shadowTexture);

        const trunkTexture = new CGFtexture(scene, 'textures/trunk.png');
        const leavesTextures = [
            new CGFtexture(scene, 'textures/leaves5.png'),
            new CGFtexture(scene, 'textures/leaves6.png'),
            new CGFtexture(scene, 'textures/leaves7.png'),
            new CGFtexture(scene, 'textures/leaves8.png')
        ];

        this.trunk = new MyCylinder(scene, 16, 4, [0.55, 0.27, 0.07, 1], trunkTexture, 2); 
        this.foliage = [];
        for (let i = 0; i < this.numPyramids; i++) {
            const scaleFactor = 1 - (i / this.numPyramids);
            const randomTexture = leavesTextures[Math.floor(Math.random() * leavesTextures.length)];
            this.foliage.push(new MyCone(scene, 16, 4, [...this.foliageColor, 1], randomTexture, 2));
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
        for (let i = 0; i < this.numPyramids; i++) {
            const scaleFactor = 1 - (i / this.numPyramids) * 0.6;
            const yOffset = (this.treeHeight - this.foliageHeight) + (i * (this.foliageHeight / this.numPyramids))/3;

            const tiltAngle = (this.pseudoRandom(i) * 6) - 3;       // -3° to +3°
            const tiltAxis = [
                this.pseudoRandom(i + 1) * 2 - 1,
                0,
                this.pseudoRandom(i + 2) * 2 - 1
            ];
            const yRotation = this.pseudoRandom(i + 1) * 360;
            
            this.scene.pushMatrix();
            this.scene.translate(0, yOffset, 0);
            this.scene.rotate(tiltAngle * Math.PI / 180, ...tiltAxis);
            this.scene.rotate(yRotation * Math.PI / 180, 0, 1, 0);
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