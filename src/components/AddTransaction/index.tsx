import './index.css'
import {BiPlus} from 'react-icons/bi'
import {GrFormClose} from 'react-icons/gr'
import { useState, useEffect, useId } from 'react'
import useUserId from '../CustomHook/getUserId'
import useFetch from '../CustomHook/useFetch'
import { observer } from 'mobx-react-lite'
import { useStore } from '../Context/storeContext'

interface TransactionData{
  id?: number;
  name: string;
  type: string;
  category: string;
  amount: number;
  date: Date;
  user_id: string|undefined;
}

interface Response{
  insert_transactions_one: {
      id: number,
      transaction_name: string,
      type: string,
      date: string,
      category: string,
      amount: number
  }
}

const AddTransaction = observer(() => {
    const {transactionStore} = useStore()
    const userId = useUserId()
    const [transactionName, setTransactionName] = useState('');
    const [transactionType, setTransactionType] = useState('');
    const [category, setCategory] = useState('');
    const [amount, setAmount] = useState('');
    const [date, setDate] = useState('');
    const [errorMsg, setErrorMsg] = useState(false)
    const [error, setError] = useState('')
    const [showPopup, setShowPopup] = useState(false)

    const url = "https://bursting-gelding-24.hasura.app/api/rest/add-transaction"
    const transactionDetails: TransactionData = {
      "name": transactionName,
      "type": transactionType,
      "category": category,
      "amount": parseInt(amount),
      "date": new Date(date),
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
        transactionStore.addTransaction({...transactionDetails, 'id': responseData?.insert_transactions_one.id})
      }
    }, [apiStatus, data])
    
    const onSubmitForm = (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault()
      if (transactionName !== '' && transactionType !== '' && category !== '' && amount !== '' && date !== ''){
        setErrorMsg(false)
        if (transactionName.length < 30){
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
                        <input id='transaction-name' className='transaction-input' type='text' placeholder='Enter Name' onChange={(e) => setTransactionName(e.target.value)}/>
                      </div>
                      <div className='transaction-input-container'> 
                        <label htmlFor='transaction-type' className='transaction-lable'>Transaction Type</label>
                        <select id='transaction-type' className='transaction-input' onChange={(e) => setTransactionType(e.target.value)}>
                          <option disabled >Select Transaction Type</option>
                          <option value={"credit"}>Credit</option>
                          <option value={"debit"}>Debit</option>
                          </select>
                      </div>
                      <div className='transaction-input-container'> 
                        <label htmlFor='category' className='transaction-lable'>Category</label>
                        <select id='category' className='transaction-input' onChange={(e) => setCategory(e.target.value) }>
                          <option disabled >Select Category</option>
                          <option value={"Entertainment"}>Entertainment</option>
                          <option value={"Food"}>Food</option>
                          <option value={"Shopping"}>Shopping</option>
                        </select>
                      </div>
                      <div className='transaction-input-container'> 
                        <label htmlFor='amount' className='transaction-lable'>Amount</label>
                        <input id='amount' className='transaction-input' type='number' placeholder='Enter Name' onChange={(e) => setAmount(e.target.value)}/>
                      </div>
                      <div className='transaction-input-container'> 
                        <label htmlFor='date' className='transaction-lable'>Date</label>
                        <input id='date' className='transaction-input' type='datetime-local' placeholder='Enter Name' onChange={(e) => setDate(e.target.value)}/>
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
})
export default AddTransaction