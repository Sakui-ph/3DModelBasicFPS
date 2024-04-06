import { Camera } from 'three';
import { PointerLockControls } from 'three/examples/jsm/Addons.js';

export class FPSControls {
    private controls: PointerLockControls;
    private domElement: HTMLCanvasElement;
    private run: boolean = false;

    switchRunToggle() {
        this.run = !this.run;
    }

    constructor(camera: Camera, domElement: HTMLCanvasElement) {
        this.controls = new PointerLockControls(camera, domElement);
        this.domElement = domElement;
    }

    public update(delta: number, keysPressed: any, mouseButtonsPressed: any) {
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

        if (mouseButtonsPressed[0] && !this.controls.isLocked) {
            this.controls.lock();
        }
    }
}
