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

        const texture = this.textureLoader.load('./textures/placeholder.png');

        console.log(texture);

        let material = new MeshPhongMaterial({
            map: texture,
        });

        console.log(material);

        const floor = new Mesh(geometry, material);
        floor.receiveShadow = true;
        floor.rotation.x = -Math.PI / 2;

        this.scene.add(floor);
    }

    private fillWorld() {
        const map = this.texture;
        map.wrapS = map.wrapT = RepeatWrapping;
        map.repeat.x = map.repeat.y = 10;
    }
}
