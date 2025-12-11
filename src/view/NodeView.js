import * as THREE from 'three';

export default class NodeView {
  constructor(node, position = {x: 0, y: 0, z: 0}, color = new THREE.Color(0x55aaff)) {
    this.node = node;

    this.color = color;
    this.mesh = this.createCube();
    this.mesh.position.set(position.x, position.y, position.z);
  }

  createCube() {
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshStandardMaterial({
      color: this.color,
    });
    return new THREE.Mesh(geometry, material);
  }

  setPosition(x, y, z) {
    this.mesh.position.set(x, y, z);
  }
}
