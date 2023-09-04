import './index.css'
import {BiPlus} from 'react-icons/bi'
import {GrFormClose} from 'react-icons/gr'
import { useState, useEffect } from 'react'
import useUserId from '../../hooks/getUserId'
import useFetch from '../../hooks/useFetch'
import { observer } from 'mobx-react'
import { useStore } from '../../context/storeContext'
import TransactionModel from '../../store/Models/TransactionModel'

interface TransactionData{
  id?: number|undefined;
  name: string|undefined;
  type: string|undefined;
  category: string|undefined;
  amount: number|undefined;
  date: Date|string|undefined;
  user_id?: string|undefined;
}

interface ResponseData{
  id: number;
  transaction_name: string;
  type: string;
  date: Date;
  category: string;
  amount: number;
}

interface Response{
  insert_transactions_one: ResponseData
}

const newObj = {
  name: '',
  type:'',
  category: '',
  amount: 0,
  date: '',
  id: 1111,
  user_id: "",
}

const AddTransaction = () => {
    const transactionStore = useStore()
    const [transactionObject] = useState(new TransactionModel(newObj))
    const userId = useUserId()
    const [errorMsg, setErrorMsg] = useState(false)
    const [error, setError] = useState('')
    const [showPopup, setShowPopup] = useState(false)

    const url = "https://bursting-gelding-24.hasura.app/api/rest/add-transaction"
    const transactionDetails: TransactionData = {
      "name": transactionObject.name,
      "type": transactionObject.type,
      "category": transactionObject.category,
      "amount": transactionObject.amount,
      "date": transactionObject.date,
      "user_id": userId
    }
    const options={
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-hasura-admin-secret': 'g08A3qQy00y8yFDq3y6N1ZQnhOPOa4msdie5EtKS1hFStar01JzPKrtKEzYY2BtF',
        'x-hasura-role': 'user',
        'x-hasura-user-id': userId
      },
      body: JSON.stringify(transactionDetails)
    }

    const {apiStatus, fetchData, data} = useFetch(url, options)
    useEffect(() => {
      const responseData = data as Response|undefined
      if (apiStatus === "SUCCESS" && responseData?.insert_transactions_one.id !== undefined){
        const transaction = responseData.insert_transactions_one
        const updateTransactionData = {
          id: transaction.id,
          name: transaction.transaction_name,
          type: transaction.type,
          category: transaction.category,
          date: transaction.date,
          amount: transaction.amount,
          user_id: userId
        }
        transactionStore.addTransaction(updateTransactionData as any)
      }
    }, [apiStatus, data, url, transactionStore, userId])
    
    const onSubmitForm = (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault()
      if ( transactionObject.name !== undefined && transactionObject.name !== '' && transactionObject.type !== '' && transactionObject.category !== '' && transactionObject.amount !== 0 && transactionObject.date !== ''){
        setErrorMsg(false)
        if (transactionObject.name.length < 30){
          setErrorMsg(false)
          setShowPopup(false)
          fetchData()

        }else{
          setErrorMsg(true)
          setError('*Transaction name should less Than 30 characters')
        }
      }
      else{
        setErrorMsg(true)
        setError('*Required')
      }
    }

    return(
        <>
          {userId !== '3' &&
          <>
              <button className="add-transaction-button" type="button" onClick={() => setShowPopup(true)}>
                  <BiPlus className="plus-icon"/>
                  <p className="add-transaction-name">Add Transaction</p>
              </button>
              {showPopup === true &&
              <form className="model" onSubmit={(e) => onSubmitForm(e)}>
              <div className="overlay">
                  <div className="modal-container">
                      <div className="close-button-heading-container">
                        <h2 className='popup-heading'>Add Transaction</h2>
                        <button
                          className="close-btn"
                          type="button"
                          onClick={() => setShowPopup(false)}
                        >
                          <GrFormClose size="20"/>
                        </button>
                      </div>
                      <p className='p1'>Lorem ipsum dolor sit amet, consectetur</p>
                      <div className='transaction-input-container'> 
                        <label htmlFor='transaction-name' className='transaction-lable'>Transaction Name</label>
                        <input id='transaction-name' className='transaction-input' type='text' placeholder='Enter Name' 
                        onChange={(e) => {
                        newObj.name = e.target.value 
                        transactionObject.name = e.target.value
                        }}/>
                      </div>
                      <div className='transaction-input-container'> 
                        <label htmlFor='transaction-type' className='transaction-lable'>Transaction Type</label>
                        <select id='transaction-type' className='transaction-input' 
                        onChange={(e) => {
                        newObj.type = e.target.value
                        transactionObject.type = (e.target.value)
                      }}>
                          <option disabled selected>Select Transaction Type</option>
                          <option value={"credit"}>Credit</option>
                          <option value={"debit"}>Debit</option>
                          </select>
                      </div>
                      <div className='transaction-input-container'> 
                        <label htmlFor='category' className='transaction-lable'>Category</label>
                        <select id='category' className='transaction-input' 
                        onChange={(e) =>{ 
                          newObj.category = e.target.value
                          transactionObject.category = (e.target.value) 
                        }}>
                          <option disabled selected>Select Category</option>
                          <option>Entertainment</option>
                          <option>Food</option>
                          <option>Shopping</option>
                        </select>
                      </div>
                      <div className='transaction-input-container'> 
                        <label htmlFor='amount' className='transaction-lable'>Amount</label>
                        <input id='amount' className='transaction-input' type='number' placeholder='Enter Name' 
                        onChange={(e) => {
                          newObj.amount = parseInt(e.target.value)
                          transactionObject.amount = (parseInt(e.target.value))
                        }}/>
                      </div>
                      <div className='transaction-input-container'> 
                        <label htmlFor='date' className='transaction-lable'>Date</label>
                        <input id='date' className='transaction-input' type='datetime-local' placeholder='Enter Name' 
                        onChange={(e) => {
                          newObj.date = e.target.value
                          transactionObject.date = (e.target.value)
                          }}/>
                      </div>
                      {errorMsg && <p className='error'>{error}</p>}
                      <button type='submit' className='Add-transaction-btn'>Add Transaction</button>
                  </div>
                </div>
              </form>}
          </>
          }
        </>
    )
}
export default observer(AddTransaction)