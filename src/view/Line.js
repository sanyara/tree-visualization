import * as THREE from 'three';

export default class Line {
  constructor(startPos, endPos, color = new THREE.Color(0x000000)) {
    this.color = color;
    this.geometry = new THREE.BufferGeometry();
    const vertices = new Float32Array([startPos.x, startPos.y, startPos.z, endPos.x, endPos.y, endPos.z]);
    this.geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));

    this.material = new THREE.LineBasicMaterial({color: this.color});
    this.line = new THREE.Line(this.geometry, this.material);
  }

  get mesh() {
    return this.line;
  }
}
