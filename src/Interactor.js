import * as THREE from 'three';

export default class Interactor {
  constructor({scene, camera, domElement, onSelect, onAdd, onDelete, onEach}) {
    this.scene = scene;
    this.camera = camera;
    this.domElement = domElement;

    this.onSelect = onSelect;
    this.onAdd = onAdd;
    this.onDelete = onDelete;
    this.onEach = onEach;

    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();

    this._onClick = this._onClick.bind(this);
    this._onKeyDown = this._onKeyDown.bind(this);

    domElement.addEventListener('click', this._onClick);
    window.addEventListener('keydown', this._onKeyDown);
  }

  setRoot(root) {
    this.rootNode = root;
  }

  dispose() {
    this.domElement.removeEventListener('click', this._onClick);
    window.removeEventListener('keydown', this._onKeyDown);
  }

  _onClick(event) {
    if (!this.rootNode) return;

    const rect = this.domElement.getBoundingClientRect();
    this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    this.raycaster.setFromCamera(this.mouse, this.camera);

    const meshes = [];
    if (this.rootNode.view?.mesh) meshes.push(this.rootNode.view.mesh);
    this.rootNode.each((n) => n.view?.mesh && meshes.push(n.view.mesh));

    const hit = this.raycaster.intersectObjects(meshes)[0];
    if (!hit) return;

    let selected = null;

    if (this.rootNode.view?.mesh === hit.object) {
      selected = this.rootNode;
    } else {
      this.rootNode.each((node) => {
        if (node.view?.mesh === hit.object) selected = node;
      });
    }

    if (selected) {
      this.onSelect?.(selected);
    }
  }

  _onKeyDown(event) {
    if (!this.current) return;

    switch (event.key.toLowerCase()) {
      case 'a':
        this.onAdd?.(this.current);
        break;
      case 'd':
        this.onDelete?.(this.current);
        break;
      case 'e':
        this.onEach?.(this.current);
        break;
    }
  }

  setCurrent(node) {
    this.current = node;
  }
}
