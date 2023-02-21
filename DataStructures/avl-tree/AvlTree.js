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
