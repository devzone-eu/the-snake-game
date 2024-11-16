import { assert } from "../helper/assert.js"

class NodeItem {

    /**
     * @param {any} value
     */
    constructor(value) {
        this.value = value;
        this.next = null;
        this.previous = null;
    }

}

export class DoubleCircularLinkedList {

    constructor() {
        this.head = null;
        this.current = null;
    }

    /**
     * @param {any} value
     */
    add(value) {
        const node = new NodeItem(value);

        if (!this.head) {
            node.next = node;
            node.previous = node;

            this.head = node;
        } else {
            const tail = this.head.previous;

            tail.next = node;

            node.next = this.head;
            node.previous = tail;

            this.head.previous = node;
        }
    }

    start() {
        this.current = this.head;
    }

    next() {
        assert(this.current !== null, "The current list is still empty. Call `start()` after specifying the list items.");

        this.current = this.current.next;

        return this.current.value;
    }

    previous() {
        assert(this.current !== null, "The current list is still empty. Call `start()` after specifying the list items.");

        this.current = this.current.previous;

        return this.current.value;
    }

}
