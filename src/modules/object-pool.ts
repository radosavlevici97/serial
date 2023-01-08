import * as _ from 'lodash';
import {Symbol} from "./symbols";
export class ObjectPool<T> {
    public pool: Array<T>;
    private _definition: any;

    constructor(arrayLength: number, classDefinition: any) {
        this.pool = new Array<T>(arrayLength);
        this._definition = classDefinition;
        this.createItems(arrayLength);
        //TODO ar trebui sa schimb parametrii din object pool, sa nu mai fie doar un array ci sa fie niste proprietati individuale ;)
    }

    public get(random?:boolean): T {
        let result: T;
        if (this.pool.length > 5) {
            if(random) {
                result = this.pool[Math.floor(Math.random() * this.pool.length)];
                this.pool= _.pull(this.pool, result);
            }
            else {
                result = this.pool.pop();
            }
        } else if (this.pool.length > 0) {
            if(random) {
                result = this.pool[Math.floor(Math.random() * this.pool.length)];
                this.pool= _.pull(this.pool, result);
            }
            else {
                result = this.pool.pop();
            }
            console.warn('Pool getting low, restocking with 5 items');
            this.restockPool();
        } else {
            if(random) {
                result = this.pool[Math.floor(Math.random() * this.pool.length)];
                this.pool= _.pull(this.pool, result);
            }
            else {
                result = this.pool.pop();
            }
            console.warn('Pool depleted, restocking with 5 items');
            this.restockPool();
        }
        return result;
    }

    public recycle(item: T): void {
        if (_.has(item, 'reset') && _.isFunction(item['reset'])) {
            (item['reset'] as Function).call(null);
        }
        this.pool.unshift(item);
        this.pool= _.shuffle(this.pool);
    }

    private restockPool(): void {
        _.each(_.range(5), () => {
            const item: T = this.createItem();
            this.pool.push(item);
        });
    }

    /**
     * Method used to create items.
     *
     * @param arrayLength
     */
    private createItems(arrayLength: number): void {
        _.each(_.range(arrayLength), (index: number) => {
            const item: T = this.createItem();
            this.pool[index] = item;
        });
    }

    /**
     * Method used to create item.
     */
    private createItem(): T {
        let item: T;
            item = new this._definition();
        return item;
    }

}
