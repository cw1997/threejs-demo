import './style.css'

import * as THREE from 'three';

const container = document.getElementById('app');

function renderCube() {
  const scene = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.set(0, 0, 5);
  camera.lookAt(0, 0, 0);

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
  scene.add( cube );

  const groundGeometry = new THREE.BoxGeometry(10, 10, 0.1); // 厚度更薄
  const groundMaterial = new THREE.MeshPhongMaterial({ color: 0x0F0F0F, side: THREE.DoubleSide });
  const ground = new THREE.Mesh(groundGeometry, groundMaterial);
  ground.rotation.x = -Math.PI / 2;
  ground.position.y = -1; // 向下移动 1 个单位
  ground.receiveShadow = true;
  scene.add(ground);

  const pointLight = new THREE.PointLight(0xffffff, 1000, 100);
  pointLight.position.set(-5, 5, 5); // 左上角
  pointLight.castShadow = true;
  scene.add(pointLight);
  const pointLightHelper = new THREE.PointLightHelper(pointLight);
  scene.add(pointLightHelper);

  const ambientLight = new THREE.AmbientLight(0xFFFFFF, 10); // 环境光
  scene.add(ambientLight);
  // const ambientLightHelper = new THREE.AmbientLightHelper(ambientLight);
  // scene.add(ambientLightHelper);

  const renderer = new THREE.WebGLRenderer();
  renderer.setSize( window.innerWidth, window.innerHeight );

  // renderer.shadowMap.enabled = true;
  // renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  container && container.appendChild( renderer.domElement );

  let angle = 0; // 用于控制相机的旋转角度

  function animate() {
    const offset = 0.01;
    cube.rotation.x += offset;
    cube.rotation.y += offset;

    angle += offset
    const radius = 5; // 距离 cube 的半径
    camera.position.x = radius * Math.cos(angle);
    camera.position.z = radius * Math.sin(angle);
    camera.lookAt(0, 0, 0); // 永远看着中心的 cube

    renderer.render( scene, camera );
  }
  renderer.setAnimationLoop( animate );
}

function renderPCB() {
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
}

renderCube();
