import { Scene } from 'three';
import { GLTF, GLTFLoader } from 'three/examples/jsm/Addons.js';

export class Glock {
    private modelLoader: GLTFLoader;

    constructor(scene: Scene, modelPath: string) {
        this.modelLoader = new GLTFLoader();

        this.modelLoader.load(modelPath, (gltf) => {
            const model = gltf.scene;

            model.traverse((object: any) => {
                if (object.isMesh) {
                    object.castShadow = true;
                }
            });

            scene.add(model);
        });
    }
}
