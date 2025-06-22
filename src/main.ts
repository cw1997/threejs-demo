import Stats from 'stats.js';
import './style.css'

import * as THREE from 'three';
import {Reflector} from "three/examples/jsm/objects/Reflector.js";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls.js";

const stats = new Stats()
stats.showPanel(0) // 0: fps, 1: ms, 2: mb, 3+: custom
document.body.appendChild(stats.dom)

const container = document.getElementById('app');

function renderCube() {
  const scene = new THREE.Scene();

  const cameraDistance = 5;
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight);
  camera.position.set(cameraDistance / 2, cameraDistance / 2, cameraDistance);
  camera.lookAt(0, 0, 0);

  const cameraHelper = new THREE.CameraHelper(camera);
  cameraHelper.matrixAutoUpdate = true
  cameraHelper.castShadow = true;
  scene.add(cameraHelper);

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
  cube.castShadow = true;
  cube.position.set(0, 1, 0);
  scene.add( cube );


  const planeSize = 5;

  const loader = new THREE.TextureLoader();
  const texture = loader.load('/src/resources/images/checker.png');
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.magFilter = THREE.NearestFilter;
  texture.colorSpace = THREE.SRGBColorSpace;
  const repeats = planeSize;
  texture.repeat.set(repeats, repeats);

  const groundGeometry = new THREE.BoxGeometry(planeSize, planeSize, 0.1);
  // const groundMaterial = new THREE.MeshPhongMaterial({ /*color: 0x0F0F0F,*/ map: texture, side: THREE.DoubleSide });
  const ground = new THREE.Mesh(groundGeometry, [
    new THREE.MeshStandardMaterial({ color: 0xF0F0F0, }), // front
    new THREE.MeshStandardMaterial({ color: 0xF0F0F0, }), // back
    new THREE.MeshStandardMaterial({ color: 0xF0F0F0, }), // right
    new THREE.MeshStandardMaterial({ color: 0xF0F0F0, }), // left
    new THREE.MeshStandardMaterial({ map: texture, metalness: 0.5, roughness: 0.5, }), // top
    new THREE.MeshStandardMaterial({ map: texture, metalness: 0.5, roughness: 0.5, }), // bottom
  ]);
  ground.rotation.x = Math.PI / 2;
  ground.position.y = -0.1;
  ground.receiveShadow = true;
  scene.add(ground);

  const mirrorWidth = 5;
  const mirrorHeight = 5;
  const frameThickness = 0.2;
  const frameMaterial = new THREE.MeshStandardMaterial({ color: 0x222222, metalness: 0.7, roughness: 0.2 });

  {
    const frameGeo = new THREE.PlaneGeometry(mirrorWidth + frameThickness * 2, mirrorHeight + frameThickness * 2);
    const frame = new THREE.Mesh(frameGeo, frameMaterial);
    frame.position.set(0, 2, -5.01); // 稍微偏一点，避免 z-fighting
    scene.add(frame);

    const mirrorGeo = new THREE.PlaneGeometry(mirrorWidth, mirrorHeight);
    const mirror = new Reflector(mirrorGeo, {
      clipBias: 0.003,
      textureWidth: window.innerWidth * window.devicePixelRatio,
      textureHeight: window.innerHeight * window.devicePixelRatio,
      color: 0x889999,
    });
    mirror.position.set(0, 2, -5);
    mirror.rotation.y = 0; // 朝 +Z（默认）
    scene.add(mirror);
  }

  scene.background = new THREE.Color(0xA0A0A0);

  // const planeGeo = new THREE.PlaneGeometry(planeSize, planeSize);
  // const planeMat = new THREE.MeshPhongMaterial({
  //   map: texture,
  //   side: THREE.DoubleSide,
  // });
  // const mesh = new THREE.Mesh(planeGeo, planeMat);
  // mesh.rotation.x = Math.PI * -.5;
  // scene.add(mesh);

  const pointLight = new THREE.PointLight(0xFFFF00, 100, 1000);
  pointLight.position.set(-2, 2, 2); // 左上角
  pointLight.castShadow = true;
  scene.add(pointLight);
  const pointLightHelper = new THREE.PointLightHelper(pointLight);
  // pointLightHelper.matrixAutoUpdate = true;
  scene.add(pointLightHelper);

  const ambientLight = new THREE.AmbientLight(0xFFFFFF, 5); // 环境光
  scene.add(ambientLight);

  const gridHelper = new THREE.GridHelper( 10, 10, 0x0000ff, 0x808080 );
  scene.add( gridHelper );

  const axesHelper = new THREE.AxesHelper( 10 );
  axesHelper.matrixAutoUpdate = true;
  scene.add( axesHelper );

  const dir = new THREE.Vector3( 1, 1, 1 );
  //normalize the direction vector (convert to vector of length 1)
  dir.normalize();
  const origin = new THREE.Vector3( 0, 0, 0 );
  const length = 1;
  const hex = 0xffff00;
  const arrowHelper = new THREE.ArrowHelper( dir, origin, length, hex );
  arrowHelper.matrixAutoUpdate = true;
  scene.add( arrowHelper );

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize( window.innerWidth, window.innerHeight );

  // renderer.shadowMap.enabled = true;
  // renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  container && container.appendChild( renderer.domElement );

  const controls = new OrbitControls(camera, renderer.domElement);

  let angle = 0; // 用于控制相机的旋转角度

  function animate() {
    stats.begin();

    const offset = 0.02;
    cube.rotation.x += offset;
    cube.rotation.y += offset;
    // cube.rotation.z += offset;

    angle += offset
    const radius = 3; // 距离 cube 的半径
    // camera.position.x = radius * Math.cos(angle);
    // camera.position.z = radius * Math.sin(angle);
    // camera.lookAt(0, 0, 0); // 永远看着中心的 cube

    pointLight.position.x = radius * Math.cos(angle);
    pointLight.position.z = radius * Math.sin(angle);

    controls.update();

    renderer.render( scene, camera );

    stats.end();
  }
  animate();
  renderer.setAnimationLoop( animate );
}

/*function renderPCB() {
  // 场景
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0xf0f0f0);

  // 相机
  const camera = new THREE.PerspectiveCamera(45, window.innerWidth/window.innerHeight, 0.01, 10);
  camera.position.set(0.2, 0.2, 0.2);

  // 渲染器
  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  // 控制器
  // const controls = new THREE.OrbitControls(camera, container);
  // controls.enableDamping = true;

  // 光源
  const ambientLight = new THREE.AmbientLight(0xffffff, 2);
  scene.add(ambientLight);
  const directionalLight = new THREE.DirectionalLight(0xffffff, 2);
  directionalLight.position.set(1, 1, 1);
  scene.add(directionalLight);

  // PCB 尺寸（米）
  const pcbLength = 0.1;  // 100mm
  const pcbWidth  = 0.04; // 40mm
  const pcbThickness = 0.0016; // 1.6mm

  // PCB 材质（绿色阻焊层）
  const pcbMaterial = new THREE.MeshStandardMaterial({
    color: 0x006400, // 深绿色
    roughness: 0.4,
    metalness: 0.1
  });

  const pcbGeometry = new THREE.BoxGeometry(pcbLength, pcbThickness, pcbWidth);
  const pcbMesh = new THREE.Mesh(pcbGeometry, pcbMaterial);
  scene.add(pcbMesh);


  // window.addEventListener('resize', () => {
  //   camera.aspect = window.innerWidth / window.innerHeight;
  //   camera.updateProjectionMatrix();
  //   renderer.setSize(window.innerWidth, window.innerHeight);
  // });

  container && container.appendChild( renderer.domElement );
  renderer.render(scene, camera);
  camera.lookAt(0, 0, 0);

  // const controls = new OrbitControls(camera, renderer.domElement);
  // controls.target.set(0, 5, 0);
  // controls.update();

  // 动画循环
  // function animate() {
  //   requestAnimationFrame(animate);
  //   controls.update();
  //   renderer.render(scene, camera);
  // }
  //
  // animate();
}*/

renderCube();
