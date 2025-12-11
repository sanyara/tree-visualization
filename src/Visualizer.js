import * as THREE from 'three';
import NodeView from './view/NodeView.js';
import Line from './view/Line.js';
import {gsap} from 'gsap';

export default class Visualizer {
  constructor(scene) {
    this.scene = scene;
    this.outlines = new Map();
  }

  renderTree(node, x, y, depth, spacingX = 2, spacingY = 6) {
    const color = this.getColorForDepth(depth);

    node.view = new NodeView(node, {x, y, z: depth * 0.2}, color);
    this.scene.add(node.view.mesh);

    if (!node.first) return;

    let child = node.first;
    let currentX = x - node.subtreeWidth / 2;

    do {
      const cx = currentX + child.subtreeWidth / 2;
      const cy = y - spacingY;

      this.renderTree(child, cx, cy, depth + 1, spacingX, spacingY);

      const line = new Line(node.view.mesh.position, child.view.mesh.position, new THREE.Color(0x000000));
      this.scene.add(line.mesh);

      currentX += child.subtreeWidth + spacingX;
      child = child.next;
    } while (child !== node.first);
  }

  computeSubtreeWidth(node, spacingX = 2) {
    if (!node.first) {
      node.subtreeWidth = spacingX;
      return node.subtreeWidth;
    }

    let child = node.first;
    let total = 0;

    do {
      total += this.computeSubtreeWidth(child, spacingX);
      child = child.next;
    } while (child !== node.first);

    total += spacingX * (node.count - 1);

    node.subtreeWidth = total;
    return total;
  }

  getColorForDepth(depth) {
    const baseHues = [0, 30, 60, 120, 180, 240, 300];
    const hue = baseHues[depth % baseHues.length];
    const saturation = 80;
    const lightness = 50;

    return new THREE.Color(`hsl(${hue}, ${saturation}%, ${lightness}%)`);
  }

  clearScene() {
    const toRemove = [];

    this.scene.scene.traverse((object) => {
      if (object.type === 'Mesh' || object.type === 'Line') {
        toRemove.push(object);
      }
    });

    toRemove.forEach((obj) => {
      this.scene.scene.remove(obj);

      if (obj.geometry) obj.geometry.dispose();
      if (obj.material) {
        if (Array.isArray(obj.material)) {
          obj.material.forEach((m) => m.dispose());
        } else {
          obj.material.dispose();
        }
      }
    });
  }

  animateCascade(nodes, baseColor) {
    nodes.forEach(({node, depth}) => {
      if (!node.view?.mesh) return;

      const mesh = node.view.mesh;
      const targetColor = baseColor.clone().offsetHSL(0, 0, -0.15 * depth);

      gsap.to(mesh.material.color, {
        r: targetColor.r,
        g: targetColor.g,
        b: targetColor.b,
        duration: 0.3,
        delay: depth * 0.2,
        ease: 'power1.out',
      });
    });
  }

  setNodeHighlight(node, highlight) {
    if (!node.view?.mesh) return;

    const mesh = node.view.mesh;

    if (highlight) {
      if (this.outlines.has(node)) return;

      const outlineMaterial = new THREE.MeshBasicMaterial({
        color: 0xffff00,
        side: THREE.BackSide,
      });

      const outlineMesh = new THREE.Mesh(mesh.geometry.clone(), outlineMaterial);
      outlineMesh.position.copy(mesh.position);
      outlineMesh.scale.setScalar(mesh.scale.x * 1.15);

      this.scene.scene.add(outlineMesh);
      this.outlines.set(node, outlineMesh);
    } else {
      const outlineMesh = this.outlines.get(node);
      if (!outlineMesh) return;

      this.scene.scene.remove(outlineMesh);
      outlineMesh.geometry.dispose();
      outlineMesh.material.dispose();
      this.outlines.delete(node);
    }
  }
}
