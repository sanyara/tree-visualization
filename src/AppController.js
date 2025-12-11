import Scene from './view/Scene';
import Node from './tree/Node.js';
import Visualizer from './Visualizer.js';
import Interactor from './Interactor.js';
import * as THREE from 'three';

export default class AppController {
  constructor(container) {
    this.rootNode = null;
    this.currentNode = null;

    this.scene = new Scene(container);
    this.visualizer = new Visualizer(this.scene);

    this.interactor = new Interactor({
      scene: this.scene.scene,
      camera: this.scene.camera,
      domElement: this.scene.renderer.domElement,
      onSelect: this.handleSelect.bind(this),
      onAdd: this.handleAdd.bind(this),
      onDelete: this.handleDelete.bind(this),
      onEach: this.handleEach.bind(this),
    });
  }

  draw(treeConfig) {
    this.rootNode = this.buildTreeFromConfig(treeConfig);

    this.interactor.setRoot(this.rootNode);

    const spacingX = 2;
    const spacingY = 6;

    this.visualizer.clearScene();
    this.visualizer.computeSubtreeWidth(this.rootNode, spacingX);
    this.visualizer.renderTree(this.rootNode, 0, 0, 0, spacingX, spacingY);

    this.scene.frameAll();

    this.selectNode(this.rootNode);
  }

  buildTreeFromConfig(configNode) {
    const node = new Node(configNode.name);

    if (Array.isArray(configNode.children)) {
      for (const childConfig of configNode.children) {
        const childNode = this.buildTreeFromConfig(childConfig);
        node.add(childNode);
      }
    }
    return node;
  }

  selectNode(node) {
    if (this.currentNode === node) return;

    if (this.currentNode) {
      this.visualizer.setNodeHighlight(this.currentNode, false);
    }

    this.currentNode = node;

    this.interactor.setCurrent(node);

    if (node) {
      this.visualizer.setNodeHighlight(node, true);
    }
  }

  handleSelect(node) {
    this.selectNode(node);
  }

  handleAdd(parentNode) {
    if (!parentNode) return;

    const newNode = new Node('New Node');
    parentNode.add(newNode);

    this.refreshTree();
    this.selectNode(newNode);
  }

  handleDelete(node) {
    if (!node || !node.parent) return;

    node.parent.remove(node);

    this.refreshTree();
    this.selectNode(this.rootNode);
  }

  handleEach(rootNode) {
    if (!rootNode) return;

    const baseColor = new THREE.Color(0x55aaff);
    const nodes = [];

    const traverse = (node, depth = 0) => {
      nodes.push({node, depth});
      if (node.first) {
        let child = node.first;
        do {
          traverse(child, depth + 1);
          child = child.next;
        } while (child !== node.first);
      }
    };

    traverse(rootNode);

    this.visualizer.animateCascade(nodes, baseColor);
  }

  refreshTree() {
    this.visualizer.clearScene();
    this.visualizer.computeSubtreeWidth(this.rootNode, 2);
    this.visualizer.renderTree(this.rootNode, 0, 0, 0, 2, 6);
    this.scene.frameAll();
  }
}
