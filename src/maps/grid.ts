import {
    PlaneGeometry,
    MeshBasicMaterial,
    DoubleSide,
    WireframeGeometry,
    LineBasicMaterial,
    Line,
    Scene,
    Mesh,
} from 'three';

export class GridMap {
    constructor(
        scene: Scene,
        width: number,
        height: number,
        widthSegments: number,
        heightSegments: number,
        color: number = 0xb4d159,
    ) {
        const geometry = new PlaneGeometry(
            width,
            height,
            widthSegments,
            heightSegments,
        );

        var wireframegeo = new WireframeGeometry(geometry);
        var wireframemat = new LineBasicMaterial({
            color: 0xffffff,
            linewidth: 1,
        });
        var wireframe = new Line(wireframegeo, wireframemat);

        const material = new MeshBasicMaterial({
            color: color,
            side: DoubleSide,
        });

        wireframe.rotation.x = -Math.PI / 2;
        scene.add(wireframe);
    }
}
