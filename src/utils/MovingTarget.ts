import { Target } from './Target';
import * as THREE from 'three';

export class MovingTarget extends Target {
    private speed: number;
    private destination: THREE.Vector3;
    private t: number = 0;
    returning: boolean = false;

    constructor(
        scene: THREE.Scene,
        position: THREE.Vector3,
        scale: THREE.Vector3,

        speed: number,
        destination: THREE.Vector3,
    ) {
        super(scene, position, scale, 0x0000ff);
        this.speed = speed;
        this.destination = destination;
    }

    public move() {
        if (this.model.position.z >= this.destination.z) {
            this.returning = true;
        }
        if (
            this.model.position.z <=
            this.destination.z - this.destination.z * 2
        ) {
            this.returning = false;
        }

        if (!this.returning) {
            this.model.position.z += this.speed;
        }
        if (this.returning) {
            this.model.position.z -= this.speed;
        }
    }
}
