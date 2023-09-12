import { useState, useEffect } from "react";
import SideBar from "../SideBar";
import AddTransaction from '../AddTransaction'
import TabItem from "../TabItem";
import { TailSpin } from 'react-loader-spinner'
import EachTransaction from "../EachTransaction";
import useUserId from "../../hooks/getUserId";
import useFetch from "../../hooks/useFetch";
import { observer } from "mobx-react";
import { useStore } from "../../context/storeContext";
import TransactionModel from "../../store/Models/TransactionModel";
import { useMachine } from "@xstate/react";
import { apiMachine } from "../../machines/apiMachine";

import './index.css'

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
    date: Date|string;
    user_id: string|undefined;
}
  
interface Response {
    transactions: Array<ResponseData>
}

const Transactions = () => {
    const transactionStore = useStore()
    const userId = useUserId()
    const [activeTabId, setActiveTabId] = useState(transactionsTypes[0].id)
    const url = "https://bursting-gelding-24.hasura.app/api/rest/all-transactions/?limit=1000&offset=0"
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
    const {fetchData} = useFetch(url,options)
    
    const [state, send] = useMachine(apiMachine, {
        services: {
            FETCH_DATA : async (context, event) => {
                const data = await fetchData()
                return data
            },
        }
    })

    useEffect(() => {
        send({
            type: 'FETCH'
        })
    }, [])

    useEffect(() => {
        getTransactionsData()
    }, [state.value, state.context.data])

    const getTransactionsData = () => {
        const response = state.context.data as Response | null
        if (response !== null){
            const updateTransactionData = response.transactions.map((each: ResponseData) => {
                return {
                    amount: each.amount,
                    category: each.category,
                    date: each.date,
                    id: each.id,
                    name: each.transaction_name,
                    type: each.type,
                    user_id: each.user_id
                }
            })
            const sortedList = updateTransactionData.sort((a, b) => new Date(a.date) < new Date(b.date) ? 1 : -1)
            const listOfTrns = sortedList.map(each => {
                let obj = new TransactionModel(each)
                return obj
              })
            transactionStore.setTransactionList(listOfTrns as any)
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
        <div className="flex flex-row justify-center items-center h-100vh w-70vw">
          <TailSpin color="#4094EF" height={50} width={50} />
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
        const response = await fetch(url, options)
        if (response.ok){
            alert("Transaction deleted successfully")
            transactionStore.deleteTransaction(id)
        }
    }

    const renderSuccessView = () => {
        const transactionsList = transactionStore.transactionsList
        const filterTrList = transactionsList.filter((eachTr: any) => {
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
            <div className="flex justify-between items-center pl-50px pt-10px pr-30px mb-5px">
                <p className="text-#343C6A font-sans text-18px roman font-bold mr-32">Transaction Name</p>
                <p className="text-#343C6A font-sans text-18px roman font-bold ml-16">Category</p>
                <p className="text-#343C6A font-sans text-18px roman font-bold ml-16 mr-10">Date</p>
                <p className="text-#343C6A font-sans text-18px roman font-bold ml-10 mr-40">Amount</p>
            </div>
            <hr className="w-1100px  self-center"/>
            <ul className="flex flex-col mt-5 ml-5 border-#E2E2E2 bg-white pl-0 pb-2 br-5 rounded-5 overflow-auto h-80vh">
                {filterTrList.map((eachTransaction: any) => (
                    <EachTransaction key={eachTransaction.id} deleteTransaction={deleteTransaction} transactionDetails={eachTransaction} />
                ))}
            </ul>
            </>
        )
    }

    const renderOnApiStatus = () => {
        switch (true) {
        case state.matches('success'):
            return renderSuccessView()
        case state.matches('error'):
            return renderFailureView()
        case state.matches('loading'):
            return renderLoadingView()
        default:
            return null
        }
    }

    const changeActiveTabId = (tabId: number) => {
        setActiveTabId(tabId)
    }

    return(
        <div className="flex flex-row">
            <SideBar activeTab="transactions"/>
            <div>
                <div className="flex flex-row w-1100px pl-30px pt-24px justify-between items-center bg-white fixed">
                <h1 className="text-#343C6A text-24px roman font-bold leading-normal pl-6 font-sans">Transactions</h1>
                <AddTransaction/>
                </div>
                <ul className="flex flex-row list-reset ml-2">
                    {transactionsTypes.map(eachType => (
                        <TabItem key={eachType.id} setActiveTabId={changeActiveTabId} isActive={eachType.id === activeTabId}  transactionType={eachType}/>
                    ))}
                </ul>
                <div className="flex flex-col mt-5 ml-5 bg-white pl-0 pb-2 br-5 h-80vh">
                    {renderOnApiStatus()}
                </div>
            </div>
        </div>
    )
}

export default observer(Transactions)