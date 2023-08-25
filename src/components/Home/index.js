import { useState , useEffect} from "react";

import AddTransaction from '../AddTransaction'
import SideBar from "../SideBar"
import BarCharts from '../BarCharts'
import Loader from 'react-loader-spinner'
import EachTransaction from "../EachTransaction";

import useCookieId from '../customHook/getUserId'
import useFetch from "../customHook/useFetch";


import './index.css'

const apiStatusConstants = {
    initial: 'INITIAL',
    success: 'SUCCESS',
    failure: 'FAILURE',
    inProgress: 'IN_PROGRESS',
}

const Home = () => {
    const userId = useCookieId()
    const [creditSum, setCreditSum] = useState('')
    const [debitSum, setDebitSum] = useState('')
    const [recentThreeTrensactionList, setRecentThreeTrensactionList] = useState([])

    const urlOfRecentThreeTr = " https://bursting-gelding-24.hasura.app/api/rest/all-transactions/?limit=3&offset=0"
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
    const urlOfCreditsAndDebits = userId === '3' ? "https://bursting-gelding-24.hasura.app/api/rest/transaction-totals-admin" : "https://bursting-gelding-24.hasura.app/api/rest/credit-debit-totals"
    const {data: creditsAndDebitsData, fetchData: fetchDataCreditsAndDebits} = useFetch(urlOfCreditsAndDebits, options)

    useEffect(() => {
      fetchData()
      fetchDataCreditsAndDebits()
    }, [])

    useEffect(() => {
        getCreditAndDebitSum()
        getRecentThreeTransactions()
    }, [userId, apiStatus, data, creditsAndDebitsData])

    const getRecentThreeTransactions = () => {
      if (data.length === undefined){
        setRecentThreeTrensactionList([...data.transactions])
      }
    }

    const getCreditAndDebitSum = async () => {
      let creditSumData;
      let debitSumData;
      if (creditsAndDebitsData.length === undefined){
        if (userId === '3'){
          creditSumData = creditsAndDebitsData.transaction_totals_admin.find(each => each.type === 'credit')
          debitSumData = creditsAndDebitsData.transaction_totals_admin.find(each => each.type === 'debit')
        }else{
            creditSumData = creditsAndDebitsData.totals_credit_debit_transactions.find(each => each.type === 'credit')
            debitSumData = creditsAndDebitsData.totals_credit_debit_transactions.find(each => each.type === 'debit')
        }
        let creditData = creditSumData === undefined ? 0 : creditSumData.sum 
        let debitData = debitSumData === undefined ? 0 : debitSumData.sum
        setCreditSum(creditData)
        setDebitSum(debitData)
        }
    }

    const deleteTransaction = async (id) => {
      const url = " https://bursting-gelding-24.hasura.app/api/rest/delete-transaction";
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
      return(
        <ul className="last-transactions-container">
          {recentThreeTrensactionList.map(eachTransaction => (
            <EachTransaction key={eachTransaction.id} deleteTransaction={deleteTransaction} transactionDetails={eachTransaction}/>
          ))}
        </ul>
      )
    }

    const onClickReTry = () => {
      this.getRecentThreeTransactions()
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

    const onRenderLastThreeTrs = () => {
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
                                <h1 className="credit-amount">${creditSum}</h1>
                                <p className="credit-name">Credit</p>
                            </div>
                            <img className="credit-img" src="https://res.cloudinary.com/daflxmokq/image/upload/v1690631804/Group_1_dcvrzx.jpg" alt="credit"/>
                        </div>
                        <div className="credit-container">
                            <div className="amount-credit-container">
                                <h1 className="debit-amount">${debitSum}</h1>
                                <p className="credit-name">Debit</p>
                            </div>
                            <img src="https://res.cloudinary.com/daflxmokq/image/upload/v1690631794/Group_2_klo0rc.jpg" alt="debit"/>
                        </div>
                    </div>
                      <h2 className="last-transaction-heading">Last Transaction</h2>
                        {onRenderLastThreeTrs()}
                      <h2 className="debit-credit-overview-name">Debit & Credit Overview</h2>
                      <BarCharts/>
                </div>
            </div>
        </div>
    )
}
export default Home