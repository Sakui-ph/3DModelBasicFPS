import { Scene } from 'three';
import { GLTF, GLTFLoader } from 'three/examples/jsm/Addons.js';

export class Glock {
    private modelLoader: GLTFLoader;

    constructor(scene: Scene, modelPath: string) {
        this.modelLoader = new GLTFLoader();

        this.modelLoader.load(modelPath, (gltf) => {
            scene.add(gltf.scene);
        });
    }
}
