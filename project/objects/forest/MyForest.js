import { CGFobject } from '../../../lib/CGF.js';
import { MyTree } from './MyTree.js';

/**
 * MyForest
 * @constructor
 * @param scene - Reference to MyScene object
 * @param rows - Number of rows in the forest (default: 5)
 * @param cols - Number of columns in the forest (default: 4)
 * @param width - Width of the forest area (default: 20)
 * @param height - Height of the forest area (default: 20)
 */
export class MyForest extends CGFobject {
    constructor(scene, rows = 5, cols = 4, width = 20, height = 20) {
        super(scene);

        this.rows = rows;
        this.cols = cols;
        this.width = width;
        this.height = height;
        this.trees = [];

        for (let i = 0; i < rows; i++) {
            this.trees[i] = [];
            for (let j = 0; j < cols; j++) {
                const tree = {
                    object: this.createRandomTree(scene),
                    offsetX: Math.random() * (this.width / this.rows) - (this.width / (2 * this.rows)),
                    offsetZ: Math.random() * (this.height / this.cols) - (this.height / (2 * this.cols))
                };
                this.trees[i].push(tree);
            }
        }
    }

    display() {
        const xSpacing = this.width / (this.rows - 1);
        const zSpacing = this.height / (this.cols - 1);

        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.cols; j++) {
                const tree = this.trees[i][j];
                this.scene.pushMatrix();
                this.scene.translate(i * xSpacing + tree.offsetX, 0, j * zSpacing + tree.offsetZ);
                tree.object.display();
                this.scene.popMatrix();
            }
        }
    }

    createRandomTree(scene) {
        // -10 to 10
        const rotation = -10 + Math.random() * 20;

        // X or Z
        const axis = Math.random() < 0.5 ? 'X' : 'Z';

        // 0.1 to 0.13
        const trunkRadius = 0.1 + Math.random() * 0.03;

        // 2 to 4
        const treeHeight = 2 + Math.random() * 2;

        // greenish colors
        //const foliageColor = [Math.random() * 0.1, 0.5 + Math.random() * 0.4, Math.random() * 0.1];

        // tree type
        const type = Math.floor(Math.random() * 3);

        
        return new MyTree(scene, rotation, axis, trunkRadius, treeHeight, type);
    }
}