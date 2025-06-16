import './style.css'

import * as THREE from 'three';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

const geometry = new THREE.BoxGeometry( 1, 1, 1 );
const materials = [
  new THREE.MeshPhongMaterial( { color: 0xff0000, shininess: 150, } ),
  new THREE.MeshPhongMaterial( { color: 0x00ff00, shininess: 150, } ),
  new THREE.MeshPhongMaterial( { color: 0x0000ff, shininess: 150, } ),
  new THREE.MeshPhongMaterial( { color: 0xffff00, shininess: 150, } ),
  new THREE.MeshPhongMaterial( { color: 0x00ffff, shininess: 150, } ),
  new THREE.MeshPhongMaterial( { color: 0xff00ff, shininess: 150, } ),
];
const cube = new THREE.Mesh( geometry, materials );
scene.add( cube );

const light = new THREE.DirectionalLight(0xFFFFFF, 5);
light.position.set(0, 0, 4);
scene.add(light);

camera.position.z = 5;

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );

const container = document.getElementById('app');
container && container.appendChild( renderer.domElement );

function animate() {
  const offset = 0.01;
  cube.rotation.x += offset;
  cube.rotation.y += offset;
  renderer.render( scene, camera );
}
renderer.setAnimationLoop( animate );
