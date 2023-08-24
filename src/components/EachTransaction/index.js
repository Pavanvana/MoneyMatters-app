import './index.css'
import {Popup} from 'reactjs-popup'
import {GrFormClose} from 'react-icons/gr'
import Cookies from 'js-cookie'
import { useState } from 'react'

const EachTransaction = (props) => {
    const userId = Cookies.get('user_id')
    const {transactionDetails, deleteTransaction} = props 
    const {id,transaction_name, type, category, amount, date} = transactionDetails
    const amountType = type === 'credit' ? '+$' : '-$' 
    const transactionAmountColor = type === 'credit' ? "creditAmount" : "debitAmount"
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const newDate = new Date(date)
    var hours = newDate.getHours();
    var minutes = newDate.getMinutes();
    var ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    hours = hours ? hours : 12; 
    minutes = minutes < 10 ? '0'+minutes : minutes;
    const dateTime = `${newDate.getDate()} ${monthNames[newDate.getMonth()]}, ${hours}.${minutes} ${ampm}`

    let month = newDate.getMonth()
    let resMonth = month > 9 ? month : `0${month}`
    let day = newDate.getDay()
    let resDay = day > 9 ? day : `0${day}`
    let dateFormate = `${newDate.getFullYear()}-${resMonth}-${resDay}`

    const [transactionName, editTransactionName] = useState(transaction_name);
    const [transactionType, editTransactionType] = useState(type);
    const [transactionCategory, editCategory] = useState(category);
    const [transactionAmount, editAmount] = useState(amount);
    const [transactiobDate, editDate] = useState(dateFormate);
    const [errorMsg, editErrorMsg] = useState(false)
    const [error, editError] = useState('')

    const onChangeTrName = (event) => {
      editTransactionName(event.target.value)
    }
    const onChangeTrType = (event) => {
      editTransactionType(event.target.value)
    }
    const onChangeCategory = (event) => {
      editCategory(event.target.value)
    }
    const onChangeAmount = (event) => {
      editAmount(event.target.value)
    }
    const onChangeDate = (event) => {
      editDate(event.target.value)
    }

    const onClickUpdateForm = async (event) => {
      event.preventDefault()
      if (transactionName !== '' && transactionType !== '' && transactionCategory !== '' && transactionAmount !== '' && transactiobDate !== ''){
        editErrorMsg(false)
        if (transactionName.length < 30){
          editErrorMsg(false)
          const parseAmount = parseInt(transactionAmount)
          const url = "https://bursting-gelding-24.hasura.app/api/rest/update-transaction"
          const transactionDetails = {
            "id": id,
            "name": transactionName,
            "type": transactionType,
            "category": transactionCategory,
            "amount": parseAmount,
            "date": new Date(transactiobDate),
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
          await fetch(url, options)
          alert('Transaction Updated')
          window.location.reload(false)
        }else{
          editErrorMsg(true)
          editError('*Transaction name should less Than 30 characters')
        }
      }
      else{
        editErrorMsg(true)
        editError('*Required')
      }
    }

    const onClickDelete = () => {
        deleteTransaction(id)
    } 

    return (
        <li className="transaction-item">
            <div className="transaction-name-container">
                {type === 'debit' &&<img className="transaction-type-icon" src="https://res.cloudinary.com/daflxmokq/image/upload/v1690633973/Group_328_ynsuwu.jpg" alt="transaction-icon"/>}
                {type === 'credit' &&<img className="transaction-type-icon" src="https://res.cloudinary.com/daflxmokq/image/upload/v1690633979/Group_326_iqpqiz.jpg" alt="transaction-icon"/>}
                {userId === '3' && 
                    <div>
                        <img className="users-profile-admin" src="https://images.unsplash.com/photo-1575936123452-b67c3203c357?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8aW1hZ2V8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60" alt="profile-icon"/>
                    </div>
                }
                <p className="transaction-name">{transaction_name}</p>
            </div>
            <div className="transaction-name-container">
                <p className="transaction-type">{category}</p>
                <p className="transaction-date">{dateTime}</p>
                <p className={`transaction-amount ${transactionAmountColor}`}>{amountType}{amount}</p>
                {userId === '3' ? 
                    <button type="button" className="edit-delete-button">
                        <img className="edit-delete-img" src="https://res.cloudinary.com/daflxmokq/image/upload/v1690633995/pencil-02_qeul6u.jpg" alt="edit"/>
                    </button>
                    :
                    <Popup
                        modal
                        trigger={
                            <button type="button" className="edit-delete-button">
                                <img className="edit-delete-img" src="https://res.cloudinary.com/daflxmokq/image/upload/v1690633995/pencil-02_qeul6u.jpg" alt="edit"/>
                            </button>
                        }
                        className="popup-content"
                        position="right center"
                    >
                        {close => (
                        <form  className="model" onSubmit={onClickUpdateForm}>
                        <div className="overlay">
                            <div className="modal-container">
                                <div className="close-button-heading-container">
                                    <h2 className='popup-heading'>Update Transaction</h2>
                                    <button
                                    className="close-btn"
                                    type="button"
                                    onClick={() => close()}
                                    >
                                    <GrFormClose size="20"/>
                                    </button>
                                </div>
                                <p className='p1'>You can update your transaction here</p>
                                <div className='transaction-input-container'> 
                                    <label htmlFor='transaction-name' className='transaction-lable'>Transaction Name</label>
                                    <input id='transaction-name' className='transaction-input' type='text' placeholder='Enter Name' onChange={onChangeTrName} value={transactionName}/>
                                </div>
                                <div className='transaction-input-container'> 
                                    <label htmlFor='transaction-type' className='transaction-lable'>Transaction Type</label>
                                    <select id='transaction-type' className='transaction-input' onChange={onChangeTrType} value={transactionType}>
                                    <option disabled selected>Select Transaction Type</option>
                                    <option value={'credit'}>Credit</option>
                                    <option value={'debit'}>Debit</option>
                                    </select>
                                </div>
                                <div className='transaction-input-container'> 
                                    <label htmlFor='category' className='transaction-lable'>Category</label>
                                    <select id='category' className='transaction-input' value={transactionCategory} onChange={onChangeCategory}>
                                    <option disabled selected>Select Category</option>
                                    <option value={'Entertainment'}>Entertainment</option>
                                    <option value={'Food'}>Food</option>
                                    <option value={'Shopping'}>Shopping</option>
                                    </select>
                                </div>
                                <div className='transaction-input-container'> 
                                    <label htmlFor='amount' className='transaction-lable'>Amount</label>
                                    <input id='amount' className='transaction-input' type='number' placeholder='Enter Name' value={transactionAmount} onChange={onChangeAmount}/>
                                </div>
                                <div className='transaction-input-container'> 
                                    <label htmlFor='date' className='transaction-lable'>Date</label>
                                    <input id='date' className='transaction-input' type='date' placeholder='Enter Name' value={transactiobDate} onChange={onChangeDate}/>
                                </div>
                                {errorMsg && <p className='error'>{error}</p>}
                                <button type='submit' className='Add-transaction-btn'>Update Transaction</button>
                            </div>
                            </div>
                        </form>
                        )}
                    </Popup>
                }
                {userId === '3' ? 
                    <button type="button" className="edit-delete-button">
                        <img className="edit-delete-img" src="https://res.cloudinary.com/daflxmokq/image/upload/v1690634016/trash-01_vy7dte.jpg" alt="delete"/>
                    </button>
                    :
                    <Popup
                    modal
                    trigger={
                        <button type="button" className="edit-delete-button">
                            <img className="edit-delete-img" src="https://res.cloudinary.com/daflxmokq/image/upload/v1690634016/trash-01_vy7dte.jpg" alt="delete"/>
                        </button>
                    }
                    className="popup-content"
                    position="right center"
                        >
                        {close => (
                            <div className="model">
                            <div className="overlay">
                                <div className="modal-container">
                                    <div className="close-button-container">
                                    <button
                                        className="close-btn"
                                        type="button"
                                        onClick={() => close()}
                                    >
                                        <GrFormClose size="20" />
                                    </button>
                                    </div>
                                    <div className="logout-description-icon-con">
                                        <div className="logout-icon-container-1">
                                            <div className="logout-icon-container-2">
                                                <img src='https://res.cloudinary.com/daflxmokq/image/upload/v1690784971/danger_koytbm.png' alt='delete-icon' className="logout-icon"/>
                                            </div>
                                        </div>
                                        <div>
                                            <h3 className="logout-pop-heading">Are you sure you want to Delete?</h3>
                                            <p className="logout-pop-description">This transaction will be deleted immediately. You can’t undo this action.</p>
                                            <div className="logout-btns-con">
                                                <button type="button" className="yes-logout-btn" onClick={onClickDelete}>Yes, Delete</button>
                                                <button type="button" className="cancel-logout-btn" onClick={() => close()}>No, Leave it</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            </div>
                        )}
                    </Popup>
                }
            </div>
        </li>
    )
}
export default EachTransaction