import { useState, useEffect } from "react";
import SideBar from "../SideBar";
import AddTransaction from '../AddTransaction'
import TabItem from "../TabItem";
import './index.css'
import Loader from 'react-loader-spinner'
import EachTransaction from "../EachTransaction";
import useUserId from "../CustomHook/getUserId";
import useFetch from "../CustomHook/useFetch";

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

interface ResponseData{
    id: number;
    transaction_name: string;
    type: string;
    category: string;
    amount: number;
    date: Date;
    user_id: number;
}
  
interface Response {
    transactions: Array<ResponseData>
}

const Transactions = () => {
    const userId = useUserId()
    const [activeTabId, setActiveTabId] = useState(transactionsTypes[0].id)
    const [transactionsList, setTransactionList] = useState<Array<ResponseData>>([])

    const url = "https://bursting-gelding-24.hasura.app/api/rest/all-transactions/?limit=1000&offset=1"
    const accesToken = "g08A3qQy00y8yFDq3y6N1ZQnhOPOa4msdie5EtKS1hFStar01JzPKrtKEzYY2BtF"
    const options = {
        method: 'GET',
        headers:{
            "x-hasura-admin-secret": accesToken,
            'Content-Type' : "application/json",
            'x-hasura-role': 'user',
            'x-hasura-user-id': userId
        }
    }
    const {data, apiStatus, fetchData} = useFetch(url,options)

    useEffect(() => {
        fetchData()
    }, [])

    useEffect(() => {
        getTransactionsData()
    }, [apiStatus, data])

    const getTransactionsData = () => {
        const response = data as Response|undefined
        if (response !== undefined){
            const transactionsList = response.transactions.sort((a, b) => new Date(a.date) < new Date(b.date) ? 1 : -1)
            setTransactionList([...transactionsList])
        }
    }
    
    const onClickRetry = () => {
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
            onClick={onClickRetry}
            >
            Try again
            </button>
        </div>
    )

    const renderLoadingView = () => (
        <div className="loader-container">
          <Loader type="TailSpin" color="#4094EF" height={50} width={50} />
        </div>
    )

    const deleteTransaction = async (id: number) => {
        const url = " https://bursting-gelding-24.hasura.app/api/rest/delete-transaction";
        const deleteTransactionId = {
            id
        }
        const options: object={
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
        window.location.reload()
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

    const renderOnApiStatus = () => {
        switch (apiStatus) {
        case 'SUCCESS':
            return renderSuccessView()
        case 'FAILURE':
            return renderFailureView()
        case 'IN_PROGRESS':
            return renderLoadingView()
        default:
            return null
        }
    }

    const changeActiveTabId = (tabId: number) => {
        setActiveTabId(tabId)
    }

    return(
        <div className="main-container">
            <SideBar activeTab="transactions"/>
            <div>
                <div className="heading-container">
                <h1 className="accounts-heading">Transactions</h1>
                <AddTransaction/>
                </div>
                <ul className="transactions-types">
                    {transactionsTypes.map(eachType => (
                        <TabItem key={eachType.id} setActiveTabId={changeActiveTabId} isActive={eachType.id === activeTabId}  transactionType={eachType}/>
                    ))}
                </ul>
                <div className="transactions-container">
                    {renderOnApiStatus()}
                </div>
            </div>
        </div>
    )
}

export default Transactions