import { useEffect} from "react";

import AddTransaction from '../AddTransaction'
import SideBar from "../SideBar"
import BarCharts from '../BarCharts'
import { TailSpin } from 'react-loader-spinner'
import EachTransaction from "../EachTransaction";
import useUserId from '../../hooks/getUserId'
import useFetch from "../../hooks/useFetch";
import { useStore } from "../../context/storeContext";

import './index.css'
import { observer } from "mobx-react";

interface ResponseData{
  id: number;
  transaction_name: string;
  type: string;
  category: string;
  amount: number;
  date: Date;
  user_id: string|undefined;
}

interface Response {
  transactions: Array<ResponseData>
}

const Home = () => {
    const {transactionStore} = useStore()
    const userId = useUserId()

    const urlOfRecentThreeTr = "https://bursting-gelding-24.hasura.app/api/rest/all-transactions/?limit=100&offset=0"
    const accesToken = "g08A3qQy00y8yFDq3y6N1ZQnhOPOa4msdie5EtKS1hFStar01JzPKrtKEzYY2BtF"
    const userOrAdmin = userId === '3' ? "admin" : "user"
    const options = {
      method: 'GET',
      headers:{
        "x-hasura-admin-secret": accesToken,
        'Content-Type' : "application/json",
        'x-hasura-role': userOrAdmin,
        'x-hasura-user-id': userId
      }
    }
    const {data, apiStatus, fetchData} = useFetch(urlOfRecentThreeTr, options)
    
    useEffect(() => {
      fetchData()
    }, [])

    useEffect(() => {
      if (apiStatus === "SUCCESS"){
        getRecentThreeTransactions()
      }
    }, [userId, apiStatus, data])

    const getRecentThreeTransactions = () => {
      const response = data as Response|undefined
      if (response !== undefined){
        const recentThreeTransactions = response.transactions.sort((a, b) => new Date(a.date) < new Date(b.date) ? 1 : -1)
        const updateTransactionData = recentThreeTransactions.map(each => {
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
        transactionStore.setTransactionList(updateTransactionData)
      }
    } 

    const deleteTransaction = async (id: number) => {
      const url = " https://bursting-gelding-24.hasura.app/api/rest/delete-transaction";
      const deleteTransactionId = {
          id
      }
      const options: object ={
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
          transactionStore.deleteTransaction(id)
      }
    }

    const renderSuccessView = () => {
      const threeTransactions = transactionStore.transactionsList.slice(0,3)
      return(
        <ul className="last-transactions-container">
          {threeTransactions.map((eachTransaction) => (
            <EachTransaction key={eachTransaction.id} deleteTransaction={deleteTransaction} transactionDetails={eachTransaction}/>
          ))}
        </ul>
      )
    }

    const onClickRetry = () => {
      getRecentThreeTransactions()
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
          <TailSpin color="#4094EF" height={50} width={50} />
        </div>
    )

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

    return(
        <div className="main-container">
            <SideBar activeTab="dashboard"/>
            <div className="home-container">
                <div className="heading-container">
                    <h1 className="accounts-heading">Accounts</h1>
                    <AddTransaction/>
                </div>
                <div className="accounts-container">
                    <div className="credit-debit-container">
                        <div className="credit-container">
                            <div className="amount-credit-container">
                                <h1 className="credit-amount">${transactionStore.creditSum}</h1>
                                <p className="credit-name">Credit</p>
                            </div>
                            <img className="credit-img" src="https://res.cloudinary.com/daflxmokq/image/upload/v1690631804/Group_1_dcvrzx.jpg" alt="credit"/>
                        </div>
                        <div className="credit-container">
                            <div className="amount-credit-container">
                                <h1 className="debit-amount">${transactionStore.debitSum}</h1>
                                <p className="credit-name">Debit</p>
                            </div>
                            <img src="https://res.cloudinary.com/daflxmokq/image/upload/v1690631794/Group_2_klo0rc.jpg" alt="debit"/>
                        </div>
                    </div>
                      <h2 className="last-transaction-heading">Last Transaction</h2>
                        {renderOnApiStatus()}
                      <h2 className="debit-credit-overview-name">Debit & Credit Overview</h2>
                      <BarCharts/>
                </div>
            </div>
        </div>
    )
}
export default observer(Home)