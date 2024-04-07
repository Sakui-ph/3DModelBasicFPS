import * as THREE from 'three';
import { Target } from './Target';
import { MovingTarget } from './MovingTarget';

export class TargetSpawner {
    private targetCount: number = 10;
    private currentTargetCount: number = 0;
    private currentMovingTargetCount: number = 0;
    private scene: THREE.Scene;
    private targets: THREE.Object3D = new THREE.Object3D();
    private movingTargets: MovingTarget[] = [];
    private movingTargetModels: THREE.Object3D = new THREE.Object3D();
    private cooldown: number = 100;

    private spawnConstraints = {
        xMin: 10,
        yMin: 10,
        zMin: 10,
        xMax: 20,
        yMax: 20,
        zMax: 20,
    };

    constructor(
        scene: THREE.Scene,
        targetCount: number,
        xMin: number = 10,
        yMin: number = 10,
        zMin: number = 10,
    ) {
        this.scene = scene;
        this.targetCount = targetCount;
        this.spawnConstraints.xMin = xMin;
        this.spawnConstraints.yMin = yMin;
        this.spawnConstraints.zMin = zMin;
        this.spawnConstraints.xMax = xMin + 10;
        this.spawnConstraints.yMax = yMin + 10;
        this.spawnConstraints.zMax = zMin + 10;

        this.scene.add(this.targets);
        this.scene.add(this.movingTargetModels);
    }

    public reachTargetCount() {
        if (this.targetCount < this.currentTargetCount || this.cooldown > 0) {
            this.cooldown--;
            return;
        }
        this.cooldown = 100;
        let x = THREE.MathUtils.randInt(
            -this.spawnConstraints.xMax,
            this.spawnConstraints.xMax,
        );
        let y = THREE.MathUtils.randInt(
            this.spawnConstraints.yMin,
            this.spawnConstraints.yMax,
        );
        let z = THREE.MathUtils.randInt(
            -this.spawnConstraints.zMin,
            -this.spawnConstraints.zMax,
        );

        const position = new THREE.Vector3(x, y, z);
        this.spawnTarget(position, new THREE.Vector3(1, 1, 1));
        this.scene.add(this.targets);
    }

    public reachMovingTargetCount() {
        if (
            this.targetCount < this.currentMovingTargetCount ||
            this.cooldown > 0
        ) {
            this.cooldown--;
            return;
        }
        this.cooldown = 100;
        let x = THREE.MathUtils.randInt(
            -this.spawnConstraints.xMin,
            -this.spawnConstraints.xMax,
        );
        let y = THREE.MathUtils.randInt(
            this.spawnConstraints.yMin,
            this.spawnConstraints.yMax,
        );

        let z = THREE.MathUtils.randInt(
            -this.spawnConstraints.zMax,
            this.spawnConstraints.zMax,
        );

        const position = new THREE.Vector3(x, y, z);
        this.spawnMovingTarget(
            position,
            new THREE.Vector3(1, 1, 1),
            0.1,
            new THREE.Vector3(position.x, position.y, 80),
        );
    }

    public updateMovingTargets() {
        this.movingTargets.forEach((target) => {
            if (target instanceof MovingTarget) {
                target.move();
            }
        });
    }

    public checkRaycaster(raycaster: THREE.Raycaster) {
        this.targets.children.forEach((target) => {
            const intersects = raycaster.intersectObject(target as THREE.Mesh);

            if (intersects.length > 0) {
                this.destroyTarget(intersects[0].object as THREE.Mesh);
                return;
            }
        });

        this.movingTargetModels.children.forEach((target) => {
            const movingIntersects = raycaster.intersectObject(
                target as THREE.Mesh,
            );

            if (movingIntersects.length > 0) {
                this.destroyMovingTarget(
                    movingIntersects[0].object as THREE.Mesh,
                );
                return;
            }
        });
    }

    private spawnMovingTarget(
        position: THREE.Vector3,
        scale: THREE.Vector3,
        speed: number,
        destination: THREE.Vector3,
    ) {
        const movingTarget = new MovingTarget(
            this.scene,
            position,
            scale,
            speed,
            destination,
        );
        this.movingTargetModels.add(movingTarget.model);
        this.movingTargets.push(movingTarget);
        this.currentMovingTargetCount++;
    }

    private spawnTarget(position: THREE.Vector3, scale: THREE.Vector3) {
        const target = new Target(this.scene, position, scale);
        this.targets.add(target.model);
        this.currentTargetCount++;
    }

    private destroyTarget(target: THREE.Mesh) {
        this.targets.remove(target);
        this.currentTargetCount--;
    }

    private destroyMovingTarget(target: THREE.Mesh) {
        this.movingTargetModels.remove(target);
        this.currentMovingTargetCount--;
    }
}
