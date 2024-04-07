import {
    AnimationAction,
    ArrowHelper,
    Camera,
    Raycaster,
    Scene,
    Vector2,
    Vector3,
} from 'three';
import { PointerLockControls } from 'three/examples/jsm/Addons.js';
import { Glock } from './Glock';

export class FPSControls {
    private controls: PointerLockControls;
    private domElement: HTMLCanvasElement;
    private run: boolean = false;
    private glock: Glock;
    private currentAnimation: AnimationAction | null = null;
    private cameraLookAt: Vector3;
    private raycaster = new Raycaster();
    private scene: Scene;

    switchRunToggle() {
        this.run = !this.run;
    }

    constructor(
        camera: Camera,
        domElement: HTMLCanvasElement,
        glock: Glock,
        scene: Scene,
    ) {
        this.controls = new PointerLockControls(camera, domElement);
        this.domElement = domElement;
        this.cameraLookAt = new Vector3(0, 0, -1);
        this.glock = glock;
        this.scene = scene;
    }

    public update(delta: number, keysPressed: any, mouseButtonsPressed: any) {
        this.cameraLookAt = this.controls
            .getObject()
            .getWorldDirection(this.cameraLookAt);

        if (this.glock.mixer) {
            this.glock.mixer.update(delta);
        }

        if (this.run) {
            this.controls.moveForward(0.1);
        }

        if (keysPressed['w']) {
            this.controls.moveForward(0.1);
        }
        if (keysPressed['s']) {
            this.controls.moveForward(-0.1);
        }
        if (keysPressed['a']) {
            this.controls.moveRight(-0.1);
        }
        if (keysPressed['d']) {
            this.controls.moveRight(0.1);
        }
        if (keysPressed['escape']) {
            this.controls.unlock();
        }

        console.log(keysPressed['r'], !this.currentAnimation);
        if (keysPressed['r'] && !this.currentAnimation) {
            this.currentAnimation = this.glock.playAnimation('Reload', false);
        }

        if (mouseButtonsPressed[0] && !this.controls.isLocked) {
            mouseButtonsPressed[0] = false;
            this.controls.lock();
        } else if (mouseButtonsPressed[0]) {
            mouseButtonsPressed[0] = false;
            if (!this.currentAnimation) {
                this.ShootRay();
                this.currentAnimation = this.glock.playAnimation(
                    'Shoot',
                    false,
                );
            }

            if (this.currentAnimation?.getClip().name === 'Shoot') {
                if (this.currentAnimation.time > 0.15) {
                    this.ShootRay();
                    this.currentAnimation = this.glock.playAnimation(
                        'Shoot',
                        false,
                        0.2,
                    );
                }
            }
        }

        if (!this.currentAnimation?.isRunning()) {
            this.currentAnimation = null;
        }
    }

    private ShootRay() {
        const camera = this.controls.getObject();
        this.raycaster.setFromCamera(new Vector2(0, 0), camera);
        this.scene.add(
            new ArrowHelper(
                this.raycaster.ray.direction,
                this.raycaster.ray.origin,
                300,
                0xff0000,
            ),
        );
    }
}
