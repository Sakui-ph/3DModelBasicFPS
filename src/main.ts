import * as THREE from 'three';
import { FloorGenerator } from './utils/FloorGenerator';
import { AmbientLight, DirectionalLight } from 'three';
import { FPSControls } from './utils/FPSControls';
import { Glock } from './utils/Glock';
import { Crosshair } from './utils/Crosshair';
import { TargetSpawner } from './utils/TargetSpawner';

const FLOOR_WIDTH = 80;
const FLOOR_HEIGHT = 80;
const ARENA_HEIGHT = 1;

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
const camera = new THREE.PerspectiveCamera(90, width / height, 0.1, 1000);
camera.position.set(0, 5, -5);

const axisHelper = new THREE.AxesHelper(5);
scene.add(axisHelper);

// Define the controls
const glock = new Glock(scene, './models/gun2.gltf', camera);
const raycaster = new THREE.Raycaster();

const fpsControls: FPSControls = new FPSControls(
    camera,
    renderer.domElement,
    glock,
    raycaster,
    scene,
);

scene.add(camera);
scene.add(glock.model);
camera.add(glock.model);
glock.model.position.set(2, 0, 1);
console.log(glock.model.position);

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

// add the crosshair
var sprite = Crosshair();
scene.add(sprite);
camera.add(sprite);
sprite.position.set(0, 0, -1);

const floor = new FloorGenerator(
    scene,
    FLOOR_WIDTH,
    FLOOR_HEIGHT,
    './textures/placeholder.png',
);
light();
floor.generate();

// Create Target thing
const targetSpawner = new TargetSpawner(
    scene,
    10,
    FLOOR_HEIGHT / 2,
    ARENA_HEIGHT / 2,
    FLOOR_WIDTH,
);

function animate() {
    onWindowResize();
    let delta = clock.getDelta();

    requestAnimationFrame(animate);
    targetSpawner.reachTargetCount();
    targetSpawner.checkRaycaster(raycaster);
    fpsControls.update(delta, keysPressed, mouseButtonsPressed);

    render();
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
