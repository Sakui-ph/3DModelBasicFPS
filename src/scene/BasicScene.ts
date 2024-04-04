// import { Scene, Renderer, PerspectiveCamera, Light } from 'three';
// import { BasicSceneProps, LightOptions } from './types';
// import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
// import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// export class BasicScene extends Scene {
//     private _renderer: Renderer;
//     loader: GLTFLoader;
//     camera: PerspectiveCamera;
//     orbitals: OrbitControls;

//     lights: Array<Light> = [];
//     lightHelpers: boolean;

//     width = window.innerWidth;
//     height = window.innerHeight;

//     resizeListener: () => void;

//     abstract init(): void;

//     constructor() {props: BasicSceneProps} {
//         super();
//         const { renderer, loader, options } = props;
//     }

//     private onWindowResize(camera: PerspectiveCamera) {
//         this.resizeListener = () => {
//             camera.aspect = window.innerWidth / window.innerHeight;
//             camera.updateProjectionMatrix();
//         };
//     }
// }
