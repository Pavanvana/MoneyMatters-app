import { observable, action, makeObservable, computed } from 'mobx';
import TransactionModel from './Models/TransactionModel';

class TransactionStore {
    transactionsList: Array<TransactionModel>
    constructor(transactions: Array<TransactionModel>) {
        makeObservable(this, {
          transactionsList: observable,
          addTransaction: action.bound,
          deleteTransaction: action.bound,
          creditSum: computed,
          debitSum: computed,
        });
        this.transactionsList = transactions
    }

    setTransactionList(transactionList: Array<TransactionModel>){
      this.transactionsList = transactionList
    }

    addTransaction(obj: TransactionModel){
       this.transactionsList = [obj,...this.transactionsList]
    }

    deleteTransaction(id: number){
      const filterTransactions = this.transactionsList.filter(each => each.id !== id)
      this.transactionsList = filterTransactions
    }

    updateTransaction(obj: TransactionModel){
      const findIndex = this.transactionsList.findIndex(each => each.id === obj.id)
      this.transactionsList[findIndex] = obj
    }

    get creditSum(){
      const creditList = this.transactionsList.filter(each => each.type === 'credit')
      return creditList.reduce((total, transaction) => total + (transaction.amount as number), 0);
    }

    get debitSum(){
      const debitList = this.transactionsList.filter(each => each.type === 'debit')
      return debitList.reduce((total, transaction) => total + (transaction.amount as number), 0);
    }
}

export default TransactionStore