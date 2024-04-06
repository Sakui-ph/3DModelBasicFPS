import { AnimationAction, Camera } from 'three';
import { PointerLockControls } from 'three/examples/jsm/Addons.js';
import { Glock } from './Glock';

export class FPSControls {
    private controls: PointerLockControls;
    private domElement: HTMLCanvasElement;
    private run: boolean = false;
    private glock: Glock;
    private currentAnimation: AnimationAction | null = null;

    switchRunToggle() {
        this.run = !this.run;
    }

    constructor(camera: Camera, domElement: HTMLCanvasElement, glock: Glock) {
        this.controls = new PointerLockControls(camera, domElement);
        this.domElement = domElement;
        this.glock = glock;
    }

    public update(delta: number, keysPressed: any, mouseButtonsPressed: any) {
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

        if (mouseButtonsPressed[0] && !this.controls.isLocked) {
            this.controls.lock();
        } else if (mouseButtonsPressed[0]) {
            mouseButtonsPressed[0] = false;
            if (!this.currentAnimation) {
                this.currentAnimation = this.glock.playAnimation('Shoot');
            }

            if (this.currentAnimation?.getClip().name === 'Shoot') {
                if (this.currentAnimation.time > 0.3) {
                    this.currentAnimation = this.glock.playAnimation(
                        'Shoot',
                        false,
                        0.2,
                    );
                }
            }
        }
        if (this.currentAnimation?.getClip().name === 'Shoot') {
            if (this.currentAnimation.time > 0.4) {
                this.currentAnimation.stop();
                this.currentAnimation = null;
            }
        }
    }
}
