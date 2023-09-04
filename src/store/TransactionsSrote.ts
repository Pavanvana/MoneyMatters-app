import { observable, action, makeObservable, computed } from 'mobx';

interface TransactionData{
  id: number;
  name: string;
  type: string;
  category: string;
  amount: number;
  date: Date|string;
  user_id: string|undefined;
}

class TransactionStore {
    transactionsList: Array<TransactionData>
    constructor(transactions: Array<TransactionData>) {
        makeObservable(this, {
          transactionsList: observable,
          addTransaction: action.bound,
          deleteTransaction: action.bound,
          creditSum: computed,
          debitSum: computed,
        });
        this.transactionsList = transactions
    }

    setTransactionList(transactionList: Array<TransactionData>){
      this.transactionsList = transactionList
    }

    addTransaction(obj: TransactionData){
       this.transactionsList = [obj,...this.transactionsList]
    }

    deleteTransaction(id: number){
      const filterTransactions = this.transactionsList.filter(each => each.id !== id)
      this.transactionsList = filterTransactions
    }

    editTransaction(obj: TransactionData){
      const findIndex = this.transactionsList.findIndex(each => each.id === obj.id)
      this.transactionsList[findIndex] = obj
    }

    get creditSum(){
      const creditList = this.transactionsList.filter(each => each.type === 'credit')
      return creditList.reduce((total, transaction) => total + transaction.amount, 0);
    }

    get debitSum(){
      const debitList = this.transactionsList.filter(each => each.type === 'debit')
      return debitList.reduce((total, transaction) => total + transaction.amount, 0);
    }
}

export default TransactionStore