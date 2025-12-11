export default class Node {
  constructor(name = '') {
    this.name = name;
    this.root = this;
    this.parent = null;
    this.prev = null;
    this.next = null;
    this.first = null;
    this.last = null;
    this.count = 0;
    this.view = null;
  }

  add(node) {
    if (node === this || this._isInParentChain(node)) return;

    if (node.parent) {
      node.parent.remove(node);
    }

    if (!this.first) {
      this.first = this.last = node;
      node.prev = node.next = node;
    } else {
      node.prev = this.last;
      node.next = this.first;
      this.last.next = node;
      this.first.prev = node;
      this.last = node;
    }

    node.parent = this;
    this.count++;

    const newRoot = this.root || this;
    this._setRootForSubtree(node, newRoot);
  }

  remove(node) {
    if (node.parent !== this) return;

    if (this.count === 1) {
      this.first = this.last = null;
    } else {
      node.prev.next = node.next;
      node.next.prev = node.prev;

      if (this.first === node) this.first = node.next;
      if (this.last === node) this.last = node.prev;
    }

    this.count--;

    this._clearSubtree(node);
  }

  _clearSubtree(node) {
    const stack = [node];
    while (stack.length) {
      const cur = stack.pop();

      if (cur.first) {
        let child = cur.first;
        do {
          stack.push(child);
          child = child.next;
        } while (child !== cur.first);
      }

      cur.parent = null;
      cur.prev = null;
      cur.next = null;
      cur.first = null;
      cur.last = null;
      cur.count = 0;
      cur.root = null;
    }
  }

  each(callback) {
    if (typeof callback !== 'function' || !this.first) return;

    const stack = [];

    let child = this.first;
    do {
      stack.push(child);
      child = child.next;
    } while (child !== this.first);

    while (stack.length) {
      const node = stack.pop();
      callback(node);

      if (node.first) {
        let currentChild = node.last;
        do {
          stack.push(currentChild);
          currentChild = currentChild.prev;
        } while (currentChild !== node.last);
      }
    }
  }

  _setRootForSubtree(node, root) {
    const stack = [node];
    while (stack.length) {
      const cur = stack.pop();
      cur.root = root;
      if (cur.first) {
        let child = cur.first;
        do {
          stack.push(child);
          child = child.next;
        } while (child !== cur.first);
      }
    }
  }

  _isInParentChain(node) {
    let p = node;
    while (p) {
      if (p === this) return true;
      p = p.parent;
    }
    return false;
  }
}
