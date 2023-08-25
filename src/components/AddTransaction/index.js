import './index.css'
import {BiPlus} from 'react-icons/bi'
import {GrFormClose} from 'react-icons/gr'
import {Popup} from 'reactjs-popup'
import { useState } from 'react'
import useCookieId from '../customHook/getUserId'
import useFetch from '../customHook/useFetch'

const AddTransaction = () => {
  const userId = useCookieId()
    const [transactionName, setTransactionName] = useState('');
    const [transactionType, setTransactionType] = useState('');
    const [category, setCategory] = useState('');
    const [amount, setAmount] = useState('');
    const [date, setDate] = useState('');
    const [errorMsg, setErrorMsg] = useState(false)
    const [error, setError] = useState('')

    const parseAmount = parseInt(amount)
    const url = "https://bursting-gelding-24.hasura.app/api/rest/add-transaction"
    const transactionDetails = {
      "name": transactionName,
      "type": transactionType,
      "category": category,
      "amount": parseAmount,
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

    const {fetchData} = useFetch(url, options)

    const onChangeTrName = (event) => {
      setTransactionName(event.target.value)
    }
    const onChangeTrType = (event) => {
      setTransactionType(event.target.value)
    }
    const onChangeCategory = (event) => {
      setCategory(event.target.value)
    }
    const onChangeAmount = (event) => {
      setAmount(event.target.value)
    }
    const onChangeDate = (event) => {
      setDate(event.target.value)
    }

    const onSubmitForm = (event) => {
      event.preventDefault()
      if (transactionName !== '' && transactionType !== '' && category !== '' && amount !== '' && date !== ''){
        setErrorMsg(false)
        if (transactionName.length < 30){
          setErrorMsg(false)
          fetchData()
          alert('Transaction Added')
          window.location.reload(false)
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
          <Popup
              modal
              trigger={
                <button className="add-transaction-button" type="button">
                  <BiPlus className="plus-icon"/>
                  <p className="add-transaction-name">Add Transaction</p>
              </button>
              }
              className="popup-content"
              position="right center"
            >
              {close => (
                <form className="model" onSubmit={onSubmitForm}>
                <div className="overlay">
                    <div className="modal-container">
                        <div className="close-button-heading-container">
                          <h2 className='popup-heading'>Add Transaction</h2>
                          <button
                            className="close-btn"
                            type="button"
                            onClick={() => close()}
                          >
                            <GrFormClose size="20"/>
                          </button>
                        </div>
                        <p className='p1'>Lorem ipsum dolor sit amet, consectetur</p>
                        <div className='transaction-input-container'> 
                          <label htmlFor='transaction-name' className='transaction-lable'>Transaction Name</label>
                          <input id='transaction-name' className='transaction-input' type='text' placeholder='Enter Name' onChange={onChangeTrName}/>
                        </div>
                        <div className='transaction-input-container'> 
                          <label htmlFor='transaction-type' className='transaction-lable'>Transaction Type</label>
                          <select id='transaction-type' className='transaction-input' onChange={onChangeTrType}>
                            <option disabled selected>Select Transaction Type</option>
                            <option value={"credit"}>Credit</option>
                            <option value={"debit"}>Debit</option>
                            </select>
                        </div>
                        <div className='transaction-input-container'> 
                          <label htmlFor='category' className='transaction-lable'>Category</label>
                          <select id='category' className='transaction-input' onChange={onChangeCategory}>
                            <option disabled selected>Select Category</option>
                            <option>Entertainment</option>
                            <option>Food</option>
                            <option>Shopping</option>
                          </select>
                        </div>
                        <div className='transaction-input-container'> 
                          <label htmlFor='amount' className='transaction-lable'>Amount</label>
                          <input id='amount' className='transaction-input' type='number' placeholder='Enter Name' onChange={onChangeAmount}/>
                        </div>
                        <div className='transaction-input-container'> 
                          <label htmlFor='date' className='transaction-lable'>Date</label>
                          <input id='date' className='transaction-input' type='datetime-local' placeholder='Enter Name' onChange={onChangeDate}/>
                        </div>
                        {errorMsg && <p className='error'>{error}</p>}
                        <button type='submit' className='Add-transaction-btn'>Add Transaction</button>
                    </div>
                  </div>
                </form>
              )}
          </Popup>
          }
        </>
    )
}
export default AddTransaction