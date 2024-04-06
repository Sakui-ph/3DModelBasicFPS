import * as THREE from 'three';
import { FloorGenerator } from './utils/FloorGenerator';
import { AmbientLight, DirectionalLight } from 'three';
import { FPSControls } from './utils/FPSControls';
import { Glock } from './utils/Glock';

const width = window.innerWidth;
const height = window.innerHeight;
const clock = new THREE.Clock();

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.shadowMap.enabled = true;

// Define the scene
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xa8def0);

// Define the camera
const camera = new THREE.PerspectiveCamera(70, width / height, 0.1, 1000);
camera.position.y = 5;

// Define the controls
const fpsControls: FPSControls = new FPSControls(camera, renderer.domElement);

const keysPressed = {};
document.addEventListener(
    'keydown',
    (event) => {
        if (event.shiftKey && fpsControls) {
            fpsControls.switchRunToggle();
        } else {
            (keysPressed as any)[event.key.toLowerCase()] = true;
        }
    },
    false,
);
document.addEventListener(
    'keyup',
    (event) => {
        (keysPressed as any)[event.key.toLowerCase()] = false;
    },
    false,
);
const mouseButtonsPressed = {};
document.addEventListener(
    'mousedown',
    (event) => {
        (mouseButtonsPressed as any)[event.button] = true;
    },
    false,
);
document.addEventListener(
    'mouseup',
    (event) => {
        (mouseButtonsPressed as any)[event.button] = false;
    },
    false,
);

const floor = new FloorGenerator(scene, 80, 80, './textures/placeholder.png');
light();
floor.generate();

function animate() {
    onWindowResize();
    let delta = clock.getDelta();
    fpsControls.update(delta, keysPressed, mouseButtonsPressed);
    render();
    requestAnimationFrame(animate);
}

function render() {
    renderer.render(scene, camera);
}

document.body.appendChild(renderer.domElement);
animate();

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    render();
}

function light() {
    scene.add(new AmbientLight(0xffffff, 1));

    const dirLight = new DirectionalLight(0xffffff, 1);
    dirLight.position.set(-60, 100, -10);
    dirLight.castShadow = true;
    dirLight.shadow.camera.top = 50;
    dirLight.shadow.camera.bottom = -50;
    dirLight.shadow.camera.left = -50;
    dirLight.shadow.camera.right = 50;
    dirLight.shadow.camera.near = 0.1;
    dirLight.shadow.camera.far = 200;
    dirLight.shadow.mapSize.width = 4096;
    dirLight.shadow.mapSize.height = 4096;
    scene.add(dirLight);
}
