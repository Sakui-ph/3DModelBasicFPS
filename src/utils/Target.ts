import * as THREE from 'three';

export class Target {
    model: THREE.Mesh;
    private scene: THREE.Scene;

    constructor(
        scene: THREE.Scene,
        position: THREE.Vector3,
        scale: THREE.Vector3,
    ) {
        this.scene = scene;

        const geometry = new THREE.BoxGeometry(3, 3, 3);
        const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
        this.model = new THREE.Mesh(geometry, material);
        this.model.position.copy(position);
        this.model.scale.copy(scale);

        this.scene.add(this.model);
    }
}
