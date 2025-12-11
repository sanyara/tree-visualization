import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js';

export default class Scene {
  constructor(container) {
    this.container = container;

    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x87ceeb);

    this.frustumSize = 40;

    this.aspect = container.clientWidth / container.clientHeight;

    let cameraWidth, cameraHeight;

    if (this.aspect >= 1) {
      cameraWidth = this.frustumSize * this.aspect;
      cameraHeight = this.frustumSize;
    } else {
      cameraWidth = this.frustumSize;
      cameraHeight = this.frustumSize / this.aspect;
    }

    this.camera = new THREE.OrthographicCamera(
      -cameraWidth / 2,
      cameraWidth / 2,
      cameraHeight / 2,
      -cameraHeight / 2,
      0.1,
      1000
    );

    this.camera.position.set(-30, 30, 150);
    this.camera.lookAt(0, 0, 0);
    this.camera.updateProjectionMatrix();

    this.renderer = new THREE.WebGLRenderer({antialias: true});
    this.renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(this.renderer.domElement);

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.05;

    this.addLight();

    this.animate = this.animate.bind(this);
    this.onResize = this.onResize.bind(this);

    window.addEventListener('resize', this.onResize);

    this.animate();
  }

  onResize() {
    const containerWidth = this.container.clientWidth;
    const containerHeight = this.container.clientHeight;

    if (containerWidth === 0 || containerHeight === 0) return;

    this.aspect = containerWidth / containerHeight;

    let cameraWidth, cameraHeight;

    if (this.aspect >= 1) {
      cameraWidth = this.frustumSize * this.aspect;
      cameraHeight = this.frustumSize;
    } else {
      cameraWidth = this.frustumSize;
      cameraHeight = this.frustumSize / this.aspect;
    }

    this.camera.left = -cameraWidth / 2;
    this.camera.right = cameraWidth / 2;
    this.camera.top = cameraHeight / 2;
    this.camera.bottom = -cameraHeight / 2;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(containerWidth, containerHeight);
  }

  add(object) {
    this.scene.add(object);
  }

  addLight() {
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 10, 5);
    this.scene.add(directionalLight);

    const ambientLight = new THREE.AmbientLight(0x404040, 0.5);
    this.scene.add(ambientLight);
  }

  animate() {
    requestAnimationFrame(this.animate);
    this.controls.update();
    this.renderer.render(this.scene, this.camera);
  }

  frameAll() {
    const box = new THREE.Box3().setFromObject(this.scene);

    if (box.isEmpty()) return;

    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());

    this.controls.target.copy(center);
    this.controls.update();

    const maxDim = Math.max(size.x, size.y) + 1;

    this.frustumSize = maxDim;

    if (this.aspect >= 1) {
      this.camera.left = (-this.frustumSize * this.aspect) / 2;
      this.camera.right = (this.frustumSize * this.aspect) / 2;
      this.camera.top = this.frustumSize / 2;
      this.camera.bottom = -this.frustumSize / 2;
    } else {
      this.camera.left = -this.frustumSize / 2;
      this.camera.right = this.frustumSize / 2;
      this.camera.top = this.frustumSize / this.aspect / 2;
      this.camera.bottom = -(this.frustumSize / this.aspect) / 2;
    }

    this.camera.lookAt(center);
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
  }
}
