import { Component } from "react";
import AddTransaction from '../AddTransaction'
import './index.css'
import SideBar from "../SideBar"
import BarCharts from '../BarCharts'
import Loader from 'react-loader-spinner'
import Cookies from 'js-cookie'
import EachTransaction from "../EachTransaction";

const apiStatusConstants = {
    initial: 'INITIAL',
    success: 'SUCCESS',
    failure: 'FAILURE',
    inProgress: 'IN_PROGRESS',
}

class Home extends Component{
    state = {
        creditSum: "",
        debitSum: "",
        apiStatus: apiStatusConstants.initial,
        recentThreeTrensactionList: [],
    }
    componentDidMount = () => {
        this.getCreditAndDebitSum()
        this.getRecentThreeTransactions()
    }

    getRecentThreeTransactions = async () => {
      this.setState({apiStatus: apiStatusConstants.inProgress})
      const url = " https://bursting-gelding-24.hasura.app/api/rest/all-transactions/?limit=3&offset=0"
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
        this.setState({recentThreeTrensactionList: [...data.transactions], apiStatus: apiStatusConstants.success})
      }else{
        this.setState({apiStatus: apiStatusConstants.failure})
      }
    }

    renderSuccessView = () => {
      const {recentThreeTrensactionList} = this.state
      return(
        <ul className="last-transactions-container">
          {recentThreeTrensactionList.map(eachTransaction => (
            <EachTransaction key={eachTransaction.id} deleteTransaction={this.deleteTransaction} transactionDetails={eachTransaction}/>
          ))}
        </ul>
      )
    }

    onClickReTry = () => {
      this.getRecentThreeTransactions()
    }
    
    renderFailureView = () => (
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
            onClick={this.onClickReTry}
            >
            Try again
            </button>
        </div>
    )

    renderLoadingView = () => (
        <div className="loader-container" testid="loader">
          <Loader type="TailSpin" color="#4094EF" height={50} width={50} />
        </div>
    )

    onRenderLastThreeTrs = () => {
      const {apiStatus} = this.state
      switch (apiStatus) {
        case apiStatusConstants.success:
            return this.renderSuccessView()
        case apiStatusConstants.failure:
            return this.renderFailureView()
        case apiStatusConstants.inProgress:
            return this.renderLoadingView()
        default:
            return null
        }
    }

    getCreditAndDebitSum = async () => {
      const userId = Cookies.get('user_id')
      const url = userId === '3' ? "https://bursting-gelding-24.hasura.app/api/rest/transaction-totals-admin" : "https://bursting-gelding-24.hasura.app/api/rest/credit-debit-totals"
      const userOrAdmin = userId === '3' ? "admin" : "user"
      const accesToken = "g08A3qQy00y8yFDq3y6N1ZQnhOPOa4msdie5EtKS1hFStar01JzPKrtKEzYY2BtF"
      const options = {
        method: 'GET',
        headers:{
          "x-hasura-admin-secret": accesToken,
          'Content-Type' : "application/json",
          'x-hasura-role': userOrAdmin,
          'x-hasura-user-id': userId
        }
      }
      const response = await fetch(url, options)
      const data = await response.json()
      if (response.ok){
        let creditSumData;
        let debitSumData;
        if (userId === '3'){
           creditSumData = data.transaction_totals_admin.find(each => each.type === 'credit')
           debitSumData = data.transaction_totals_admin.find(each => each.type === 'debit')
        }else{
           creditSumData = data.totals_credit_debit_transactions.find(each => each.type === 'credit')
           debitSumData = data.totals_credit_debit_transactions.find(each => each.type === 'debit')
        }
        this.setState({creditSum:creditSumData.sum, debitSum: debitSumData.sum})
      }
    }

    deleteTransaction = async (id) => {
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

    render(){
        const { creditSum, debitSum} = this.state
        return(
            <div className="main-container">
                <SideBar/>
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
                            {this.onRenderLastThreeTrs()}
                          <h2 className="debit-credit-overview-name">Debit & Credit Overview</h2>
                          <BarCharts/>
                    </div>
                </div>
            </div>
        )
    }
}
export default Home