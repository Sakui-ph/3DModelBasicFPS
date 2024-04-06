import {
    Camera,
    Object3DEventMap,
    Scene,
    Group,
    AnimationMixer,
    AnimationAction,
    LoopOnce,
    LoopRepeat,
} from 'three';
import { GLTFLoader } from 'three/examples/jsm/Addons.js';

export class Glock {
    private modelLoader: GLTFLoader;
    model: Group = new Group();
    animationsMap: Map<string, AnimationAction> = new Map();
    mixer: AnimationMixer | null = null;
    constructor(scene: Scene, modelPath: string, camera: Camera) {
        this.modelLoader = new GLTFLoader();
        this.loadModel(modelPath, camera);
    }

    private loadModel(modelPath: string, camera: Camera) {
        let model: Group;
        this.modelLoader.load(modelPath, (gltf) => {
            model = gltf.scene;

            model.traverse((object: any) => {
                if (object.isMesh) {
                    object.castShadow = true;
                }
            });

            const gltfAnimations = gltf.animations;
            this.mixer = new AnimationMixer(model);
            this.animationsMap = new Map();
            gltfAnimations
                .filter((a) => a.name !== 'idle')
                .forEach((animation) => {
                    this.animationsMap.set(
                        animation.name,
                        this.mixer!.clipAction(animation),
                    );
                });

            model.scale.set(0.5, 0.5, 0.5);
            model.position.set(
                camera.position.x,
                camera.position.y - 6,
                camera.position.z + 1,
            );
            model.rotateY(-Math.PI);
            this.model.add(model);
        });
    }

    public playAnimation(
        animationName: string,
        loop: boolean = false,
        startAt: number = 0,
    ): AnimationAction {
        const animation = this.animationsMap.get(animationName);
        if (animation) {
            animation.setLoop(loop ? LoopRepeat : LoopOnce, 1);
            animation.startAt(startAt);
            animation.play();
            animation.reset();
            return animation;
        }
        throw new Error('Animation not found');
    }
}
