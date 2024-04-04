import {
    Scene,
    PlaneGeometry,
    Texture,
    TextureLoader,
    MeshPhongMaterial,
    Mesh,
    RepeatWrapping,
} from 'three';

export class FloorGenerator {
    scene: Scene;
    width: number;
    height: number;
    widthSegments: number;
    heightSegments: number;
    color1: number = 0x000000;
    color2: number = 0xffffff;
    texture: Texture;

    private textureLoader = new TextureLoader();

    constructor(
        scene: Scene,
        width: number,
        height: number,
        texturePath: string,
    ) {
        this.scene = scene;
        this.width = width;
        this.height = height;
        this.texture = this.textureLoader.load(texturePath);
        this.widthSegments = 512;
        this.heightSegments = 512;
    }

    generate() {
        const geometry = new PlaneGeometry(
            this.width,
            this.height,
            this.widthSegments,
            this.heightSegments,
        );

        let material = new MeshPhongMaterial({
            map: this.texture,
        });

        if (material.map != null) this.fillWorld(material.map);
        const floor = new Mesh(geometry, material);
        floor.receiveShadow = true;
        floor.rotation.x = -Math.PI / 2;

        this.scene.add(floor);
    }

    private fillWorld(map: Texture) {
        map.wrapS = map.wrapT = RepeatWrapping;
        map.repeat.x = map.repeat.y = 10;
    }
}
