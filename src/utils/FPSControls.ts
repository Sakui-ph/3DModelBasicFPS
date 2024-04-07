import {
    AnimationAction,
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
    private raycaster;
    private scene: Scene;

    private ammo: number = 10;
    private totalAmmo: number = 10;

    private ammoDocument: HTMLElement | null =
        document.getElementById('ammoLabel');

    switchRunToggle() {
        this.run = !this.run;
    }

    constructor(
        camera: Camera,
        domElement: HTMLCanvasElement,
        glock: Glock,
        raycaster: Raycaster,
        scene: Scene,
    ) {
        this.raycaster = raycaster;
        this.controls = new PointerLockControls(camera, domElement);
        this.domElement = domElement;
        this.cameraLookAt = new Vector3(0, 0, -1);
        this.glock = glock;
        this.scene = scene;
        this.controls.pointerSpeed = 0.4;
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

        if (keysPressed['r'] && !this.currentAnimation) {
            this.Reload();
        }

        this.glock.CheckAnimationEnd();
        if (this.currentAnimation?.getClip().name === 'Reload') {
            if (!this.glock.animating) {
                this.FinishReload();
            }
        }

        this.HandleShootingAnimation(mouseButtonsPressed);

        if (!this.currentAnimation?.isRunning()) {
            this.currentAnimation = null;
        }

        this.updateAmmoDisplay();
    }

    private Reload() {
        this.currentAnimation = this.glock.playAnimation('Reload', false);
    }

    private FinishReload() {
        this.currentAnimation = null;
        this.RefillAmmo();
    }
    private HandleShootingAnimation(mouseButtonsPressed: any) {
        if (mouseButtonsPressed[0] && !this.controls.isLocked) {
            mouseButtonsPressed[0] = false;
            this.controls.lock();
        } else if (
            mouseButtonsPressed[0] &&
            this.currentAnimation?.getClip().name !== 'Reload'
        ) {
            if (this.ammo <= 0) {
                return;
            }
            mouseButtonsPressed[0] = false;
            if (!this.currentAnimation) {
                this.ShootRay();
                this.currentAnimation = this.glock.playAnimation(
                    'Shoot',
                    false,
                );
            }

            if (this.currentAnimation?.getClip().name === 'Shoot') {
                if (this.currentAnimation.time > 0.1) {
                    this.ShootRay();
                    this.currentAnimation = this.glock.playAnimation(
                        'Shoot',
                        false,
                        0.2,
                    );
                }
            }
        }
    }

    private ShootRay() {
        const camera = this.controls.getObject();
        this.raycaster.setFromCamera(new Vector2(0, 0), camera);

        this.ammo--;
    }

    private RefillAmmo() {
        this.ammo = this.totalAmmo;
    }

    private updateAmmoDisplay() {
        if (this.ammoDocument) {
            this.ammoDocument.innerHTML = this.ammo.toString();
        }
    }
}
