import { useState, useEffect } from "react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Legend,
} from "recharts"
import Loader from "react-loader-spinner"
import Cookies from "js-cookie"

import './index.css'
const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}
const BarCharts = () => {
  const [apiStatus, changeApiStatus] = useState(apiStatusConstants.initial)
  const [last7DaysCreditsAndDebitsDate, changeLast7DaysCreditsAndDebitsDate] = useState([])
  
  useEffect(() => {
    getLast7daysCreditsAndDebits()
  }, [])
  
  const getLast7daysCreditsAndDebits = async () => {
    changeApiStatus(apiStatusConstants.inProgress)
    const userId = Cookies.get('user_id')
    const url = userId === '3' ? 'https://bursting-gelding-24.hasura.app/api/rest/daywise-totals-last-7-days-admin' : 'https://bursting-gelding-24.hasura.app/api/rest/daywise-totals-7-days' 
    const accesToken = "g08A3qQy00y8yFDq3y6N1ZQnhOPOa4msdie5EtKS1hFStar01JzPKrtKEzYY2BtF"
    const userOrAdmin = userId === '3' ? 'admin' : 'user'
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
      if (userId === '3'){
        changeApiStatus(apiStatusConstants.success)
        changeLast7DaysCreditsAndDebitsDate(data.last_7_days_transactions_totals_admin)
      }else{
        changeApiStatus(apiStatusConstants.success)
        changeLast7DaysCreditsAndDebitsDate(data.last_7_days_transactions_credit_debit_totals)
      }
    }else{
      changeApiStatus(apiStatusConstants.failure)
    }
  }
  const onClickReTry = () => {
    getLast7daysCreditsAndDebits()
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
  const renderBarchart = () => {
      const DataFormatter = (number) => {
        if (number > 1000) {
          return `${(number / 1000).toString()}k`
        }
        return number.toString()
      }
      let days = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat']
      let list_7_days = []
      let totalCreditSum = 0
      let totalDebitSum = 0
      for (let i = 0; i < 7; i++){
        const findDat = last7DaysCreditsAndDebitsDate.filter(each =>new Date(each.date).getDay() === i)
        const credit = findDat.find(each => each.type === 'credit')
        const debit = findDat.find(each => each.type === 'debit')
        const creditSum = credit === undefined ? 0 : credit.sum
        const debitSum = debit === undefined ? 0 : debit.sum
        totalCreditSum += creditSum
        totalDebitSum += debitSum
        const obj = {
          'day': days[i],
          'credit': creditSum,
          'debit': debitSum
        }
        list_7_days.push(obj)
      }
    return(
      <>
      <div className="top-align">
                <p className="credit-debit-in-this-week">${totalDebitSum} <span className="debitted">Debited &</span> ${totalCreditSum} <span className="debitted">Credited in this Week</span></p>
                <div className="credit-debit-checkbox">
                    <div className="checkbox-container">
                        <div className="debit-checkbox"></div>
                        <p className="type">Credit</p>
                    </div>
                    <div className="checkbox-container">
                        <div className="credit-checkbox"></div>
                        <p className="type">Debit</p>
                    </div>
                </div>
            </div>
      <BarChart
              width={1000}
              height={400}
              data={list_7_days}
              margin={{
                top: 5,
              }}
            >
              <XAxis
                dataKey="day"
                tick={{
                  stroke: '#718EBF',
                  strokeWidth:1,
                  fontFamily: 'sans-serif',
                }}
              />
              <YAxis
                tickFormatter={DataFormatter}
                tick={{
                  stroke: '#718EBF',
                  strokeWidth: 1,
                  fontFamily: 'sans-serif',
                }}
              />
              <Legend
                wrapperStyle={{
                  paddingTop: 20,
                  textAlign: 'center',
                  fontSize: 12,
                  fontFamily: 'Roboto',
                }}
              />
              <Bar dataKey="credit" name="Credit" fill="#4C78FF" barSize="20%" radius={[10, 10, 10, 10]}/>
              <Bar dataKey="debit" name="Debit" fill="#FCAA0B" barSize="20%" radius={[10, 10, 10, 10]}/>
      </BarChart>
      </>
    )
  }
  const onRenderBarChart = () => {
    switch (apiStatus) {
      case apiStatusConstants.success:
          return renderBarchart()
      case apiStatusConstants.failure:
          return renderFailureView()
      case apiStatusConstants.inProgress:
          return renderLoadingView()
      default:
          return null
      }
  }

    
  return(
      <div className="debit-credit-overview-container">
        {onRenderBarChart()}
      </div>
  )
    
}
export default BarCharts