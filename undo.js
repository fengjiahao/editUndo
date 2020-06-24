function truncate(stack, limit) {
    while (stack.length > limit) {
        stack.shift();
    }
}
/**
 * ''                 null
 * [1]                null, 1
 * [1, 2]             null, 1, 2
 * [1, 2, 3]          null, 1, 2, 3
 * 1, [2, 3, 4]       null, 2, 3, 4
 * 1, 2, [3, 4, 5]    null, 3, 4, 5
 * 1, 2, 3, [4, 5, 6] null, 4, 5, 6
 * maxLength = 3
 * position 0,1,2,3
 *
 * @param maxLength    最大保存值
 * @param initialItem  stack初始元素
 * @param stack        数组, 初始化后[null]
 * @param position     stack中的`指针`,实现redo,undo
 * @param changed     外部方法
 */
export default class editUndo {
    /* @param  {[Object]} options 传入参数 */
    initialize(options) {
        let settings = options ? options : {}
        let defaultOptions = {
            maxLength: 10,
        }
        this.maxLength = (typeof settings.maxLength != 'undefined') ? settings.maxLength : defaultOptions.maxLength;

        this.initialItem = null;
        this.clear();
    }
    changed() {
        // toDo
    }
    /* @param  {[Object]} current 当前保存的对象 */
    save(current) {
        console.log('current-obj', current)
        if (this.position >= this.maxLength) truncate(this.stack, this.maxLength);
        this.position = Math.min(this.position, this.stack.length - 1);
        this.stack = this.stack.slice(0, this.position + 1);
        this.stack.push(current);
        this.position++;
        this.changed();
    }
    clear() {
        return new Promise(resolve => {
            this.stack = [this.initialItem];
            this.position = 0; // `指针`初始化
            this.changed();
            resolve(this.stack)
        })
    }
    undo() {
        return new Promise((resolve, reject) => {
            if (this.isUndo()) {
                let item = this.stack[--this.position];
                this.changed();
                resolve(item)
            } else {
                reject(new Error(`can't execute this.isUndo()`))
            }
        })
    }
    redo() {
        return new Promise((resolve, reject) => {
            if (this.isRedo()) {
                let item = this.stack[++this.position];
                this.changed();
                resolve(item)
            } else {
                reject(new Error(`can't execute this.isRedo()`))
            }
        })
    }
    count() {
        return this.stack.length - 1;
    }
    isUndo() {
        return this.position > 0;
    }
    isRedo() {
        return this.position < this.count();
    }
}
