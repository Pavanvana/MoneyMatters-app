import { observable, makeObservable, action } from 'mobx';

interface Object{
    id: number|undefined;
    name: string|undefined;
    type: string|undefined;
    category: string|undefined;
    amount: number|undefined;
    date: Date|string|undefined;
    user_id: string|undefined
}

class TransactionModel {

    id: number|undefined;
    name: string|undefined;
    type: string|undefined;
    category: string|undefined;
    amount: number|undefined;
    date: Date|string|undefined;
    user_id: string|undefined

    constructor (obj: Object) {
        makeObservable(this,{
            id: observable,
            name: observable,
            type : observable,
            category : observable,
            amount : observable,
            date : observable,
            user_id : observable,
            setAmount: action.bound,
            setCategory: action.bound,
            setDate: action.bound,
            setType: action.bound,
            setName: action.bound
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

    setType(type: string){
        this.type = type
    }

    setAmount(amount: number){
        this.amount = amount
    }

    setName(name: string){
        this.name = name
    }

    setCategory(category: string){
        this.category = category
    } 

    setDate(date: Date|string){
        this.date = date
    }
}

export default TransactionModel