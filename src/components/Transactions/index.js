import { useState, useEffect } from "react";
import SideBar from "../SideBar";
import AddTransaction from '../AddTransaction'
import EachType from "../EachType";
import './index.css'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import EachTransaction from "../EachTransaction";

const transactionsTypes = [
    {
        id: 1,
        type: "All Transactions",
    },
    {
        id: 2,
        type: "Credit"
    },
    {
        id: 3,
        type: "Debit"
    }
]

const apiStatusConstants = {
    initial: 'INITIAL',
    success: 'SUCCESS',
    failure: 'FAILURE',
    inProgress: 'IN_PROGRESS',
}


const Transactions = () => {
    const [activeTabId, changeActiveTabId] = useState(transactionsTypes[0].id)
    const [apiStatus, changeApiStatus] = useState(apiStatusConstants.initial)
    const [transactionsList, changeTransactionList] = useState([])

    useEffect(() => {
        getTransactionsData()
    },[])

    const getTransactionsData= async () => {
        changeApiStatus( apiStatusConstants.inProgress )
        const url = "https://bursting-gelding-24.hasura.app/api/rest/all-transactions/?limit=1000&offset=1"
        const accesToken = "g08A3qQy00y8yFDq3y6N1ZQnhOPOa4msdie5EtKS1hFStar01JzPKrtKEzYY2BtF"
        const userId = Cookies.get('user_id')
        const options = {
            method: 'GET',
            headers:{
              "x-hasura-admin-secret": accesToken,
              'Content-Type' : "application/json",
              'x-hasura-role': 'user',
              'x-hasura-user-id': userId
            }
          }
        const response = await fetch(url, options)
        const data = await response.json()
        if (response.ok){
            changeApiStatus( apiStatusConstants.success )
            changeTransactionList([...data.transactions])
        }else{
            changeApiStatus( apiStatusConstants.failure )
        }
    }

    const onClickReTry = () => {
        getTransactionsData()
    }
    
    const renderFailureView = () => (
        <div className="failure-container">
            <img
            src="https://res.cloudinary.com/daflxmokq/image/upload/v1677128965/alert-triangle_yavvbl.png"
            alt="failure view"
            className="failure view"
            />
            <p className="alert-msg">Something went wrong. Please try again</p>
            <button
            className="tryagain-btn"
            type="button"
            onClick={onClickReTry}
            >
            Try again
            </button>
        </div>
    )

    const renderLoadingView = () => (
        <div className="loader-container" testid="loader">
          <Loader type="TailSpin" color="#4094EF" height={50} width={50} />
        </div>
    )

    const deleteTransaction = async (id) => {
        const url = " https://bursting-gelding-24.hasura.app/api/rest/delete-transaction";
        const userId = Cookies.get('user_id')
        const deleteTransactionId = {
            id
        }
        const options={
            method: 'DELETE',
            headers: {
              'content-type': 'application/json',
              'x-hasura-admin-secret': 'g08A3qQy00y8yFDq3y6N1ZQnhOPOa4msdie5EtKS1hFStar01JzPKrtKEzYY2BtF',
              'x-hasura-role': 'user',
              'x-hasura-user-id': userId
            },
            body: JSON.stringify(deleteTransactionId)
        }
        await fetch(url, options)
        alert('Transaction Deleted')
        window.location.reload(false)
    }

    const renderSuccessView = () => {
        const filterTrList = transactionsList.filter(eachTr => {
            if (activeTabId === 1){
                return eachTr
            }else if (activeTabId === 2){
                return eachTr.type === 'credit'
            }else{
                return eachTr.type === 'debit'
            }
        })
        return(
            <>
            <div className="headings-container">
                <p className="headings h1">Transaction Name</p>
                <p className="headings h2">Category</p>
                <p className="headings h3">Date</p>
                <p className="headings h4">Amount</p>
            </div>
            <hr className="hr-line"/>
            <ul className="transactions-container">
                {filterTrList.map(eachTransaction => (
                    <EachTransaction key={eachTransaction.id} deleteTransaction={deleteTransaction} transactionDetails={eachTransaction} />
                ))}
            </ul>
            </>
        )
    }

    const onRenderTransactions = () => {

        switch (apiStatus) {
        case apiStatusConstants.success:
            return renderSuccessView()
        case apiStatusConstants.failure:
            return renderFailureView()
        case apiStatusConstants.inProgress:
            return renderLoadingView()
        default:
            return null
        }
    }

    const setActiveTabId = tabId => {
        changeActiveTabId(tabId)
    }

    return(
        <div className="main-container">
            <SideBar/>
            <div>
                <div className="heading-container">
                <h1 className="accounts-heading">Transactions</h1>
                <AddTransaction/>
                </div>
                <ul className="transactions-types">
                    {transactionsTypes.map(eachType => (
                        <EachType key={eachType.id} setActiveTabId={setActiveTabId} isActive={eachType.id === activeTabId}  transactionType={eachType}/>
                    ))}
                </ul>
                <div className="transactions-container">
                    {onRenderTransactions()}
                </div>
            </div>
        </div>
    )
}

export default Transactions