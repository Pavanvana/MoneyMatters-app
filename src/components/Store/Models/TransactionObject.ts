import { observable, action, makeObservable } from 'mobx';

interface Object{
    id: number;
    name: string;
    type: string;
    category: string;
    amount: number;
    date: Date|string;
    user_id: string|undefined
}

class TransactionObject {

    id: number|undefined;
    name: string|undefined;
    type: string|undefined;
    category: string|undefined;
    amount: number|undefined;
    date: Date|string|undefined;
    user_id: string|undefined

    constructor (obj: Object|null) {
        makeObservable(this,{
            id: observable,name: observable,type : observable,category : observable,amount : observable,date : observable,user_id : observable,
        })
        if (obj !== null){
            this.id = obj.id
            this.name = obj.name 
            this.type = obj.type 
            this.category = obj.category
            this.amount = obj.amount
            this.date = obj.date
            this.user_id = obj.user_id
        }
    }
}

export default TransactionObject