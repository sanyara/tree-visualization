import '../style.css';
import AppController from './AppController';
import treeConfig from './treeConfig.json';

document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('app');

  const app = new AppController(container);
  app.draw(treeConfig);
});
