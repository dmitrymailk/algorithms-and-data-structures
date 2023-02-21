class Comparator {
  /**
   * Constructor.
   * @param {function(a: *, b: *)} [compareFunction] - It may be custom compare function that, let's
   * say may compare custom objects together.
   */
  constructor(compareFunction) {
    this.compare = compareFunction || Comparator.defaultCompareFunction;
  }

  /**
   * Default comparison function. It just assumes that "a" and "b" are strings or numbers.
   * @param {(string|number)} a
   * @param {(string|number)} b
   * @returns {number}
   */
  static defaultCompareFunction(a, b) {
    if (a === b) {
      return 0;
    }

    return a < b ? -1 : 1;
  }

  /**
   * Checks if two variables are equal.
   * @param {*} a
   * @param {*} b
   * @return {boolean}
   */
  equal(a, b) {
    return this.compare(a, b) === 0;
  }

  /**
   * Checks if variable "a" is less than "b".
   * @param {*} a
   * @param {*} b
   * @return {boolean}
   */
  lessThan(a, b) {
    return this.compare(a, b) < 0;
  }

  /**
   * Checks if variable "a" is greater than "b".
   * @param {*} a
   * @param {*} b
   * @return {boolean}
   */
  greaterThan(a, b) {
    return this.compare(a, b) > 0;
  }

  /**
   * Checks if variable "a" is less than or equal to "b".
   * @param {*} a
   * @param {*} b
   * @return {boolean}
   */
  lessThanOrEqual(a, b) {
    return this.lessThan(a, b) || this.equal(a, b);
  }

  /**
   * Checks if variable "a" is greater than or equal to "b".
   * @param {*} a
   * @param {*} b
   * @return {boolean}
   */
  greaterThanOrEqual(a, b) {
    return this.greaterThan(a, b) || this.equal(a, b);
  }

  /**
   * Reverses the comparison order.
   */
  reverse() {
    const compareOriginal = this.compare;
    this.compare = (a, b) => compareOriginal(b, a);
  }
}

class LinkedList {
  /**
   * @param {Function} [comparatorFunction]
   */
  constructor(comparatorFunction) {
    /** @var LinkedListNode */
    this.head = null;

    /** @var LinkedListNode */
    this.tail = null;

    this.compare = new Comparator(comparatorFunction);
  }

  /**
   * @param {*} value
   * @return {LinkedList}
   */
  prepend(value) {
    // Make new node to be a head.
    const newNode = new LinkedListNode(value, this.head);
    this.head = newNode;

    // If there is no tail yet let's make new node a tail.
    if (!this.tail) {
      this.tail = newNode;
    }

    return this;
  }

  /**
   * @param {*} value
   * @return {LinkedList}
   */
  append(value) {
    const newNode = new LinkedListNode(value);

    // If there is no head yet let's make new node a head.
    if (!this.head) {
      this.head = newNode;
      this.tail = newNode;

      return this;
    }

    // Attach new node to the end of linked list.
    this.tail.next = newNode;
    this.tail = newNode;

    return this;
  }

  /**
   * @param {*} value
   * @param {number} index
   * @return {LinkedList}
   */
  insert(value, rawIndex) {
    const index = rawIndex < 0 ? 0 : rawIndex;
    if (index === 0) {
      this.prepend(value);
    } else {
      let count = 1;
      let currentNode = this.head;
      const newNode = new LinkedListNode(value);
      while (currentNode) {
        if (count === index) break;
        currentNode = currentNode.next;
        count += 1;
      }
      if (currentNode) {
        newNode.next = currentNode.next;
        currentNode.next = newNode;
      } else {
        if (this.tail) {
          this.tail.next = newNode;
          this.tail = newNode;
        } else {
          this.head = newNode;
          this.tail = newNode;
        }
      }
    }
    return this;
  }

  /**
   * @param {*} value
   * @return {LinkedListNode}
   */
  delete(value) {
    if (!this.head) {
      return null;
    }

    let deletedNode = null;

    // If the head must be deleted then make next node that is different
    // from the head to be a new head.
    while (this.head && this.compare.equal(this.head.value, value)) {
      deletedNode = this.head;
      this.head = this.head.next;
    }

    let currentNode = this.head;

    if (currentNode !== null) {
      // If next node must be deleted then make next node to be a next next one.
      while (currentNode.next) {
        if (this.compare.equal(currentNode.next.value, value)) {
          deletedNode = currentNode.next;
          currentNode.next = currentNode.next.next;
        } else {
          currentNode = currentNode.next;
        }
      }
    }

    // Check if tail must be deleted.
    if (this.compare.equal(this.tail.value, value)) {
      this.tail = currentNode;
    }

    return deletedNode;
  }

  /**
   * @param {Object} findParams
   * @param {*} findParams.value
   * @param {function} [findParams.callback]
   * @return {LinkedListNode}
   */
  find({ value = undefined, callback = undefined }) {
    if (!this.head) {
      return null;
    }

    let currentNode = this.head;

    while (currentNode) {
      // If callback is specified then try to find node by callback.
      if (callback && callback(currentNode.value)) {
        return currentNode;
      }

      // If value is specified then try to compare by value..
      if (value !== undefined && this.compare.equal(currentNode.value, value)) {
        return currentNode;
      }

      currentNode = currentNode.next;
    }

    return null;
  }

  /**
   * @return {LinkedListNode}
   */
  deleteTail() {
    const deletedTail = this.tail;

    if (this.head === this.tail) {
      // There is only one node in linked list.
      this.head = null;
      this.tail = null;

      return deletedTail;
    }

    // If there are many nodes in linked list...

    // Rewind to the last node and delete "next" link for the node before the last one.
    let currentNode = this.head;
    while (currentNode.next) {
      if (!currentNode.next.next) {
        currentNode.next = null;
      } else {
        currentNode = currentNode.next;
      }
    }

    this.tail = currentNode;

    return deletedTail;
  }

  /**
   * @return {LinkedListNode}
   */
  deleteHead() {
    if (!this.head) {
      return null;
    }

    const deletedHead = this.head;

    if (this.head.next) {
      this.head = this.head.next;
    } else {
      this.head = null;
      this.tail = null;
    }

    return deletedHead;
  }

  /**
   * @param {*[]} values - Array of values that need to be converted to linked list.
   * @return {LinkedList}
   */
  fromArray(values) {
    values.forEach((value) => this.append(value));

    return this;
  }

  /**
   * @return {LinkedListNode[]}
   */
  toArray() {
    const nodes = [];

    let currentNode = this.head;
    while (currentNode) {
      nodes.push(currentNode);
      currentNode = currentNode.next;
    }

    return nodes;
  }

  /**
   * @param {function} [callback]
   * @return {string}
   */
  toString(callback) {
    return this.toArray()
      .map((node) => node.toString(callback))
      .toString();
  }

  /**
   * Reverse a linked list.
   * @returns {LinkedList}
   */
  reverse() {
    let currNode = this.head;
    let prevNode = null;
    let nextNode = null;

    while (currNode) {
      // Store next node.
      nextNode = currNode.next;

      // Change next node of the current node so it would link to previous node.
      currNode.next = prevNode;

      // Move prevNode and currNode nodes one step forward.
      prevNode = currNode;
      currNode = nextNode;
    }

    // Reset head and tail.
    this.tail = this.head;
    this.head = prevNode;

    return this;
  }
}

const defaultHashTableSize = 32;
class HashTable {
  /**
   * @param {number} hashTableSize
   */
  constructor(hashTableSize = defaultHashTableSize) {
    // Create hash table of certain size and fill each bucket with empty linked list.
    this.buckets = Array(hashTableSize)
      .fill(null)
      .map(() => new LinkedList());

    // Just to keep track of all actual keys in a fast way.
    this.keys = {};
  }

  /**
   * Converts key string to hash number.
   *
   * @param {string} key
   * @return {number}
   */
  hash(key) {
    // For simplicity reasons we will just use character codes sum of all characters of the key
    // to calculate the hash.
    //
    // But you may also use more sophisticated approaches like polynomial string hash to reduce the
    // number of collisions:
    //
    // hash = charCodeAt(0) * PRIME^(n-1) + charCodeAt(1) * PRIME^(n-2) + ... + charCodeAt(n-1)
    //
    // where charCodeAt(i) is the i-th character code of the key, n is the length of the key and
    // PRIME is just any prime number like 31.
    const hash = Array.from(key).reduce(
      (hashAccumulator, keySymbol) => hashAccumulator + keySymbol.charCodeAt(0),
      0
    );

    // Reduce hash number so it would fit hash table size.
    return hash % this.buckets.length;
  }

  /**
   * @param {string} key
   * @param {*} value
   */
  set(key, value) {
    const keyHash = this.hash(key);
    this.keys[key] = keyHash;
    const bucketLinkedList = this.buckets[keyHash];
    const node = bucketLinkedList.find({
      callback: (nodeValue) => nodeValue.key === key,
    });

    if (!node) {
      // Insert new node.
      bucketLinkedList.append({ key, value });
    } else {
      // Update value of existing node.
      node.value.value = value;
    }
  }

  /**
   * @param {string} key
   * @return {*}
   */
  delete(key) {
    const keyHash = this.hash(key);
    delete this.keys[key];
    const bucketLinkedList = this.buckets[keyHash];
    const node = bucketLinkedList.find({
      callback: (nodeValue) => nodeValue.key === key,
    });

    if (node) {
      return bucketLinkedList.delete(node.value);
    }

    return null;
  }

  /**
   * @param {string} key
   * @return {*}
   */
  get(key) {
    const bucketLinkedList = this.buckets[this.hash(key)];
    const node = bucketLinkedList.find({
      callback: (nodeValue) => nodeValue.key === key,
    });

    return node ? node.value.value : undefined;
  }

  /**
   * @param {string} key
   * @return {boolean}
   */
  has(key) {
    return Object.hasOwnProperty.call(this.keys, key);
  }

  /**
   * @return {string[]}
   */
  getKeys() {
    return Object.keys(this.keys);
  }

  /**
   * Gets the list of all the stored values in the hash table.
   *
   * @return {*[]}
   */
  getValues() {
    return this.buckets.reduce((values, bucket) => {
      const bucketValues = bucket
        .toArray()
        .map((linkedListNode) => linkedListNode.value.value);
      return values.concat(bucketValues);
    }, []);
  }
}

class BinaryTreeNode {
  /**
   * @param {*} [value] - node value.
   */
  constructor(value = null) {
    this.left = null;
    this.right = null;
    this.parent = null;
    this.value = value;

    // Any node related meta information may be stored here.
    this.meta = new HashTable();

    // This comparator is used to compare binary tree nodes with each other.
    this.nodeComparator = new Comparator();
  }

  /**
   * @return {number}
   */
  get leftHeight() {
    if (!this.left) {
      return 0;
    }

    return this.left.height + 1;
  }

  /**
   * @return {number}
   */
  get rightHeight() {
    if (!this.right) {
      return 0;
    }

    return this.right.height + 1;
  }

  /**
   * @return {number}
   */
  get height() {
    return Math.max(this.leftHeight, this.rightHeight);
  }

  /**
   * @return {number}
   */
  get balanceFactor() {
    return this.leftHeight - this.rightHeight;
  }

  /**
   * Get parent's sibling if it exists.
   * @return {BinaryTreeNode}
   */
  get uncle() {
    // Check if current node has parent.
    if (!this.parent) {
      return undefined;
    }

    // Check if current node has grand-parent.
    if (!this.parent.parent) {
      return undefined;
    }

    // Check if grand-parent has two children.
    if (!this.parent.parent.left || !this.parent.parent.right) {
      return undefined;
    }

    // So for now we know that current node has grand-parent and this
    // grand-parent has two children. Let's find out who is the uncle.
    if (this.nodeComparator.equal(this.parent, this.parent.parent.left)) {
      // Right one is an uncle.
      return this.parent.parent.right;
    }

    // Left one is an uncle.
    return this.parent.parent.left;
  }

  /**
   * @param {*} value
   * @return {BinaryTreeNode}
   */
  setValue(value) {
    this.value = value;

    return this;
  }

  /**
   * @param {BinaryTreeNode} node
   * @return {BinaryTreeNode}
   */
  setLeft(node) {
    // Reset parent for left node since it is going to be detached.
    if (this.left) {
      this.left.parent = null;
    }

    // Attach new node to the left.
    this.left = node;

    // Make current node to be a parent for new left one.
    if (this.left) {
      this.left.parent = this;
    }

    return this;
  }

  /**
   * @param {BinaryTreeNode} node
   * @return {BinaryTreeNode}
   */
  setRight(node) {
    // Reset parent for right node since it is going to be detached.
    if (this.right) {
      this.right.parent = null;
    }

    // Attach new node to the right.
    this.right = node;

    // Make current node to be a parent for new right one.
    if (node) {
      this.right.parent = this;
    }

    return this;
  }

  /**
   * @param {BinaryTreeNode} nodeToRemove
   * @return {boolean}
   */
  removeChild(nodeToRemove) {
    if (this.left && this.nodeComparator.equal(this.left, nodeToRemove)) {
      this.left = null;
      return true;
    }

    if (this.right && this.nodeComparator.equal(this.right, nodeToRemove)) {
      this.right = null;
      return true;
    }

    return false;
  }

  /**
   * @param {BinaryTreeNode} nodeToReplace
   * @param {BinaryTreeNode} replacementNode
   * @return {boolean}
   */
  replaceChild(nodeToReplace, replacementNode) {
    if (!nodeToReplace || !replacementNode) {
      return false;
    }

    if (this.left && this.nodeComparator.equal(this.left, nodeToReplace)) {
      this.left = replacementNode;
      return true;
    }

    if (this.right && this.nodeComparator.equal(this.right, nodeToReplace)) {
      this.right = replacementNode;
      return true;
    }

    return false;
  }

  /**
   * @param {BinaryTreeNode} sourceNode
   * @param {BinaryTreeNode} targetNode
   */
  static copyNode(sourceNode, targetNode) {
    targetNode.setValue(sourceNode.value);
    targetNode.setLeft(sourceNode.left);
    targetNode.setRight(sourceNode.right);
  }

  /**
   * @return {*[]}
   */
  traverseInOrder() {
    let traverse = [];

    // Add left node.
    if (this.left) {
      traverse = traverse.concat(this.left.traverseInOrder());
    }

    // Add root.
    traverse.push(this.value);

    // Add right node.
    if (this.right) {
      traverse = traverse.concat(this.right.traverseInOrder());
    }

    return traverse;
  }

  /**
   * @return {string}
   */
  toString() {
    return this.traverseInOrder().toString();
  }
}

class BinarySearchTreeNode extends BinaryTreeNode {
  /**
   * @param {*} [value] - node value.
   * @param {function} [compareFunction] - comparator function for node values.
   */
  constructor(value = null, compareFunction = undefined) {
    super(value);

    // This comparator is used to compare node values with each other.
    this.compareFunction = compareFunction;
    this.nodeValueComparator = new Comparator(compareFunction);
  }

  /**
   * @param {*} value
   * @return {BinarySearchTreeNode}
   */
  insert(value) {
    if (this.nodeValueComparator.equal(this.value, null)) {
      this.value = value;

      return this;
    }

    if (this.nodeValueComparator.lessThan(value, this.value)) {
      // Insert to the left.
      if (this.left) {
        return this.left.insert(value);
      }

      const newNode = new BinarySearchTreeNode(value, this.compareFunction);
      this.setLeft(newNode);

      return newNode;
    }

    if (this.nodeValueComparator.greaterThan(value, this.value)) {
      // Insert to the right.
      if (this.right) {
        return this.right.insert(value);
      }

      const newNode = new BinarySearchTreeNode(value, this.compareFunction);
      this.setRight(newNode);

      return newNode;
    }

    return this;
  }

  /**
   * @param {*} value
   * @return {BinarySearchTreeNode}
   */
  find(value) {
    // Check the root.
    if (this.nodeValueComparator.equal(this.value, value)) {
      return this;
    }

    if (this.nodeValueComparator.lessThan(value, this.value) && this.left) {
      // Check left nodes.
      return this.left.find(value);
    }

    if (this.nodeValueComparator.greaterThan(value, this.value) && this.right) {
      // Check right nodes.
      return this.right.find(value);
    }

    return null;
  }

  /**
   * @param {*} value
   * @return {boolean}
   */
  contains(value) {
    return !!this.find(value);
  }

  /**
   * @param {*} value
   * @return {boolean}
   */
  remove(value) {
    const nodeToRemove = this.find(value);

    if (!nodeToRemove) {
      throw new Error("Item not found in the tree");
    }

    const { parent } = nodeToRemove;

    if (!nodeToRemove.left && !nodeToRemove.right) {
      // Node is a leaf and thus has no children.
      if (parent) {
        // Node has a parent. Just remove the pointer to this node from the parent.
        parent.removeChild(nodeToRemove);
      } else {
        // Node has no parent. Just erase current node value.
        nodeToRemove.setValue(undefined);
      }
    } else if (nodeToRemove.left && nodeToRemove.right) {
      // Node has two children.
      // Find the next biggest value (minimum value in the right branch)
      // and replace current value node with that next biggest value.
      const nextBiggerNode = nodeToRemove.right.findMin();
      if (!this.nodeComparator.equal(nextBiggerNode, nodeToRemove.right)) {
        this.remove(nextBiggerNode.value);
        nodeToRemove.setValue(nextBiggerNode.value);
      } else {
        // In case if next right value is the next bigger one and it doesn't have left child
        // then just replace node that is going to be deleted with the right node.
        nodeToRemove.setValue(nodeToRemove.right.value);
        nodeToRemove.setRight(nodeToRemove.right.right);
      }
    } else {
      // Node has only one child.
      // Make this child to be a direct child of current node's parent.
      /** @var BinarySearchTreeNode */
      const childNode = nodeToRemove.left || nodeToRemove.right;

      if (parent) {
        parent.replaceChild(nodeToRemove, childNode);
      } else {
        BinaryTreeNode.copyNode(childNode, nodeToRemove);
      }
    }

    // Clear the parent of removed node.
    nodeToRemove.parent = null;

    return true;
  }

  /**
   * @return {BinarySearchTreeNode}
   */
  findMin() {
    if (!this.left) {
      return this;
    }

    return this.left.findMin();
  }
}

class BinarySearchTree {
  /**
   * @param {function} [nodeValueCompareFunction]
   */
  constructor(nodeValueCompareFunction) {
    this.root = new BinarySearchTreeNode(null, nodeValueCompareFunction);

    // Steal node comparator from the root.
    this.nodeComparator = this.root.nodeComparator;
  }

  /**
   * @param {*} value
   * @return {BinarySearchTreeNode}
   */
  insert(value) {
    return this.root.insert(value);
  }

  /**
   * @param {*} value
   * @return {boolean}
   */
  contains(value) {
    return this.root.contains(value);
  }

  /**
   * @param {*} value
   * @return {boolean}
   */
  remove(value) {
    return this.root.remove(value);
  }

  /**
   * @return {string}
   */
  toString() {
    return this.root.toString();
  }
}

class AvlTree extends BinarySearchTree {
  /**
   * @param {*} value
   */
  insert(value) {
    // Do the normal BST insert.
    super.insert(value);

    // Let's move up to the root and check balance factors along the way.
    let currentNode = this.root.find(value);
    while (currentNode) {
      this.balance(currentNode);
      currentNode = currentNode.parent;
    }
  }

  /**
   * @param {*} value
   * @return {boolean}
   */
  remove(value) {
    // Do standard BST removal.
    super.remove(value);

    // Balance the tree starting from the root node.
    this.balance(this.root);
  }

  /**
   * @param {BinarySearchTreeNode} node
   */
  balance(node) {
    // If balance factor is not OK then try to balance the node.
    if (node.balanceFactor > 1) {
      // Left rotation.
      if (node.left.balanceFactor > 0) {
        // Left-Left rotation
        this.rotateLeftLeft(node);
      } else if (node.left.balanceFactor < 0) {
        // Left-Right rotation.
        this.rotateLeftRight(node);
      }
    } else if (node.balanceFactor < -1) {
      // Right rotation.
      if (node.right.balanceFactor < 0) {
        // Right-Right rotation
        this.rotateRightRight(node);
      } else if (node.right.balanceFactor > 0) {
        // Right-Left rotation.
        this.rotateRightLeft(node);
      }
    }
  }

  /**
   * @param {BinarySearchTreeNode} rootNode
   */
  rotateLeftLeft(rootNode) {
    // Detach left node from root node.
    const leftNode = rootNode.left;
    rootNode.setLeft(null);

    // Make left node to be a child of rootNode's parent.
    if (rootNode.parent) {
      rootNode.parent.setLeft(leftNode);
    } else if (rootNode === this.root) {
      // If root node is root then make left node to be a new root.
      this.root = leftNode;
    }

    // If left node has a right child then detach it and
    // attach it as a left child for rootNode.
    if (leftNode.right) {
      rootNode.setLeft(leftNode.right);
    }

    // Attach rootNode to the right of leftNode.
    leftNode.setRight(rootNode);
  }

  /**
   * @param {BinarySearchTreeNode} rootNode
   */
  rotateLeftRight(rootNode) {
    // Detach left node from rootNode since it is going to be replaced.
    const leftNode = rootNode.left;
    rootNode.setLeft(null);

    // Detach right node from leftNode.
    const leftRightNode = leftNode.right;
    leftNode.setRight(null);

    // Preserve leftRightNode's left subtree.
    if (leftRightNode.left) {
      leftNode.setRight(leftRightNode.left);
      leftRightNode.setLeft(null);
    }

    // Attach leftRightNode to the rootNode.
    rootNode.setLeft(leftRightNode);

    // Attach leftNode as left node for leftRight node.
    leftRightNode.setLeft(leftNode);

    // Do left-left rotation.
    this.rotateLeftLeft(rootNode);
  }

  /**
   * @param {BinarySearchTreeNode} rootNode
   */
  rotateRightLeft(rootNode) {
    // Detach right node from rootNode since it is going to be replaced.
    const rightNode = rootNode.right;
    rootNode.setRight(null);

    // Detach left node from rightNode.
    const rightLeftNode = rightNode.left;
    rightNode.setLeft(null);

    if (rightLeftNode.right) {
      rightNode.setLeft(rightLeftNode.right);
      rightLeftNode.setRight(null);
    }

    // Attach rightLeftNode to the rootNode.
    rootNode.setRight(rightLeftNode);

    // Attach rightNode as right node for rightLeft node.
    rightLeftNode.setRight(rightNode);

    // Do right-right rotation.
    this.rotateRightRight(rootNode);
  }

  /**
   * @param {BinarySearchTreeNode} rootNode
   */
  rotateRightRight(rootNode) {
    // Detach right node from root node.
    const rightNode = rootNode.right;
    rootNode.setRight(null);

    // Make right node to be a child of rootNode's parent.
    if (rootNode.parent) {
      rootNode.parent.setRight(rightNode);
    } else if (rootNode === this.root) {
      // If root node is root then make right node to be a new root.
      this.root = rightNode;
    }

    // If right node has a left child then detach it and
    // attach it as a right child for rootNode.
    if (rightNode.left) {
      rootNode.setRight(rightNode.left);
    }

    // Attach rootNode to the left of rightNode.
    rightNode.setLeft(rootNode);
  }
}

function main() {
  const tree = new AvlTree();

  tree.insert(4);
  tree.insert(3);
  tree.insert(2);

  //   expect(tree.toString()).toBe("2,3,4");
  console.log(`expect(tree.toString()).toBe("2,3,4")`, tree.toString());
  //   expect(tree.root.value).toBe(3);
  console.log(`expect(tree.root.value).toBe(3);`, tree.root.value);
  //   expect(tree.root.height).toBe(1);

  //   tree.insert(1);

  //   expect(tree.toString()).toBe("1,2,3,4");
  //   expect(tree.root.value).toBe(3);
  //   expect(tree.root.height).toBe(2);

  //   tree.insert(0);

  //   expect(tree.toString()).toBe("0,1,2,3,4");
  //   expect(tree.root.value).toBe(3);
  //   expect(tree.root.left.value).toBe(1);
  //   expect(tree.root.height).toBe(2);
}
main();
