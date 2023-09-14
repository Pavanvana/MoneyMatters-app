import './index.css'
import {Popup} from 'reactjs-popup'
import {GrFormClose} from 'react-icons/gr'
import useUserId from '../../hooks/useUserId'
import { useState, useEffect } from 'react'
import { format } from 'date-fns'
import useFetch from '../../hooks/useFetch'
import { observer } from 'mobx-react-lite'
import { useStore } from '../../context/storeContext'
import TransactionModel from '../../store/Models/TransactionModel'

interface Props{
    transactionDetails: {
        id: number|undefined;
        name: string|undefined;
        type: string|undefined;
        category: string|undefined;
        amount:number|undefined;
        date: Date|string|undefined;
    }
    deleteTransaction: Function
}

interface Response{
    update_transactions_by_pk: {
        amount:number|undefined;
        category: string|undefined;
        date: Date|string|undefined;
        id: number|undefined;
        transaction_name: string|undefined;
        type: string|undefined;
    }
}

const EachTransaction = observer((props: Props) => {
    const transactionStore = useStore()
    const userId = useUserId()
    const {transactionDetails, deleteTransaction} = props 
    const {id,name, type, category, amount, date} = transactionDetails

    const amountType = type === 'credit' ? '+$' : '-$' 
    const transactionAmountColor = type === 'credit' ? "credit-amount-color" : "debit-amount-color"
    const newDate= new Date(date as Date)  
    const dateTime = format(newDate, 'dd MMM, HH.mm aaa')
    const formateDate = format(newDate, 'yyyy-MM-dd')

    const [tempObj] = useState(new TransactionModel({...transactionDetails, user_id: userId}))

    const [errorMsg, setErrorMsg] = useState(false)
    const [error, setError] = useState('')
    const [showPopup, setShowPopup] = useState(false)

    const url = "https://bursting-gelding-24.hasura.app/api/rest/update-transaction"
    const transaction = {
        id: tempObj.id,
        name: tempObj.name,
        type: tempObj.type,
        amount: tempObj.amount,
        category: tempObj.category,
        date: tempObj.date
    }
    const options={
    method: 'POST',
    headers: {
        'content-type': 'application/json',
        'x-hasura-admin-secret': 'g08A3qQy00y8yFDq3y6N1ZQnhOPOa4msdie5EtKS1hFStar01JzPKrtKEzYY2BtF',
        'x-hasura-role': 'user',
        'x-hasura-user-id': userId
    },
    body: JSON.stringify(transaction)
    }

    const {apiStatus, data, fetchData} = useFetch(url, options)
    useEffect(() => {
        const response = data as Response | undefined
        if(apiStatus === "SUCCESS" && response !== undefined){
            const obj = response.update_transactions_by_pk
            const updateTransactionData = {
                amount: obj.amount,
                category: obj.category,
                date: obj.date,
                id: obj.id,
                name: obj.transaction_name,
                type: obj.type,
            }
            transactionStore.updateTransaction({...updateTransactionData as any, user_id: userId})
        }
    }, [apiStatus, data, transactionStore, userId])

    const onClickUpdateForm = (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault()
      if (tempObj.name !== undefined && tempObj.name !== '' && tempObj.type !== '' && tempObj.category !== '' && tempObj.amount !== 0 && tempObj.date !== ''){
        setErrorMsg(false)
        if (tempObj.name.length < 30){
          setErrorMsg(false)
          setShowPopup(false)
          transactionDetails.name = tempObj.name as string
          transactionDetails.type = tempObj.type as string
          transactionDetails.amount = tempObj.amount as number
          transactionDetails.category = tempObj.category as string
          transactionDetails.date = tempObj.date as Date 
          transactionDetails.id = tempObj.id as number
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
                <p className="transaction-name">{name}</p>
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
                    <>
                    <button type="button" className="edit-delete-button" onClick={(e) => setShowPopup(true)}>
                        <img className="edit-delete-img" src="https://res.cloudinary.com/daflxmokq/image/upload/v1690633995/pencil-02_qeul6u.jpg" alt="edit"/>
                    </button>
                    
                    {showPopup && 
                    <form  className="model" onSubmit={(e) => onClickUpdateForm(e)}>
                    <div className="overlay">
                        <div className="modal-container">
                            <div className="close-button-heading-container">
                                <h2 className='popup-heading'>Update Transaction</h2>
                                <button
                                className="close-btn"
                                type="button"
                                onClick={(e) => setShowPopup(false)}
                                >
                                <GrFormClose size="20"/>
                                </button>
                            </div>
                            <p className='p1'>You can update your transaction here</p>
                            <div className='transaction-input-container'> 
                                <label htmlFor='transaction-name' className='transaction-lable'>Transaction Name</label>
                                <input id='transaction-name' className='transaction-input' type='text' placeholder='Enter Name' onChange={(e) => tempObj.setName(e.target.value)} value={tempObj.name}/>
                            </div>
                            <div className='transaction-input-container'> 
                                <label htmlFor='transaction-type' className='transaction-lable'>Transaction Type</label>
                                <select id='transaction-type' className='transaction-input' onChange={(e) => tempObj.setType(e.target.value)} value={tempObj.type}>
                                <option disabled selected>Select Transaction Type</option>
                                <option value={'credit'}>Credit</option>
                                <option value={'debit'}>Debit</option>
                                </select>
                            </div>
                            <div className='transaction-input-container'> 
                                <label htmlFor='category' className='transaction-lable'>Category</label>
                                <select id='category' className='transaction-input' value={tempObj.category} onChange={(e) => tempObj.setCategory(e.target.value)}>
                                <option disabled selected>Select Category</option>
                                <option value={'Entertainment'}>Entertainment</option>
                                <option value={'Food'}>Food</option>
                                <option value={'Shopping'}>Shopping</option>
                                </select>
                            </div>
                            <div className='transaction-input-container'> 
                                <label htmlFor='amount' className='transaction-lable'>Amount</label>
                                <input id='amount' className='transaction-input' type='number' placeholder='Enter Name' value={tempObj.amount} onChange={(e) => tempObj.setAmount(parseInt(e.target.value))}/>
                            </div>
                            <div className='transaction-input-container'> 
                                <label htmlFor='date' className='transaction-lable'>Date</label>
                                <input id='date' className='transaction-input' type='date' placeholder='Enter Name' value={formateDate} onChange={(e) => tempObj.setDate(e.target.value)}/>
                            </div>
                            {errorMsg && <p className='error'>{error}</p>}
                            <button type='submit' className='Add-transaction-btn'>Update Transaction</button>
                        </div>
                        </div>
                    </form>}
                    </>
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
                        closeOnEscape
                        >
                        <div className="model">
                        <div className="overlay">
                            <div className="modal-container">
                                <div className="close-button-container">
                                <button
                                    className="close-btn"
                                    type="button"
                                    
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
                                            <button type="button" className="cancel-logout-btn" >No, Leave it</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        </div>
                    </Popup>
                }
            </div>
        </li>
    )
})
export default EachTransaction