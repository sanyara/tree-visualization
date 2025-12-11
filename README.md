# Tree Visualization Demo

This project provides a 3D interactive tree visualization using Three.js.  
The demo is built and placed in the `dist` folder.

---

## Demo

Open the demo by opening `dist/index.html` in a modern browser.

---

## Controls

- **Click** on nodes to select them (highlighted with a yellow outline).  
- **Keyboard shortcuts** when a node is selected:
  - **A** — Add a new child node to the selected node.
  - **D** — Delete the selected node (except the root).
  - **E** — Animate color cascade effect on the subtree of the selected node.

---

## Project Structure

- `src/` — Source code, including:
  - `AppController.js` — main controller managing the tree logic.
  - `Interactor.js` — handles mouse and keyboard interaction.
  - `Visualizer.js` — responsible for rendering and animating the tree.
  - `tree/Node.js` — tree data structure.
  - `view/` — visual representations of nodes and edges.

- `dist/` — Built demo files ready for deployment.

---

## Requirements

- Modern browser with WebGL support.

---

## How to Build

npm i
npm run start
npm run build
