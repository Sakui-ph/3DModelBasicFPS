import * as THREE from 'three';

const width = window.innerWidth;
const height = window.innerHeight;

const scene = new THREE.Scene();
const camera = new THREE.OrthographicCamera(-2, 2, 2, -2, -2, 10);
const axesHelper = new THREE.AxesHelper(5);


scene.add(axesHelper);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(width, height);
document.body.appendChild(renderer.domElement);

const cubeGeometry = new THREE.BoxGeometry(1, 1);
const cubeMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
cube.position.x = 1;
cube.position.y = 1;
cube.rotation.x = 0.6;
cube.rotation.y = 0.8;
scene.add(cube);

const octangonColor = new THREE.Color("rgb(255,245,8)")
const octagonGeometry = new THREE.OctahedronGeometry(0.5, 2);
const octagonMaterial = new THREE.MeshBasicMaterial({ color: octangonColor });
const octagon = new THREE.Mesh(octagonGeometry, octagonMaterial);
octagon.position.x = 1;
octagon.position.y = -1;
octagon.rotation.x = 0.5;
octagon.rotation.y = 0.8;
scene.add(octagon);


const octahedronGeometry = new THREE.OctahedronGeometry(0.5);
const octahedronMaterial = new THREE.MeshBasicMaterial({ color: 0x0000ff });
const octahedron = new THREE.Mesh(octahedronGeometry, octahedronMaterial);
octahedron.position.x = -1;
octahedron.position.y = -1;
octahedron.rotation.x = 0.5;
octahedron.rotation.y = 0.5;
scene.add(octahedron);

const torusGeometry = new THREE.TorusGeometry(0.5, 0.2, 16, 100);
const torusMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const torus = new THREE.Mesh(torusGeometry, torusMaterial);
torus.position.x = -1;
torus.position.y = 1;
torus.rotation.x = 0.5;
torus.rotation.y = 0.6;
scene.add(torus);

function onWindowResize() {
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
  render()
}

function rotateObject(object: THREE.Object3D, speed: number) {
  object.rotation.x += speed
  object.rotation.y += speed
  object.rotation.z += speed
}

function animate() {
  requestAnimationFrame(animate)
  onWindowResize()

  rotateObject(cube, 0.01)
  rotateObject(octagon, 0.01)
  rotateObject(octahedron, 0.01)
  rotateObject(torus, 0.01)
  render()
}

function render() {
  renderer.render(scene, camera)
}



animate()
