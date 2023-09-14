import { useState, useEffect } from "react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Legend,
} from "recharts"
import { TailSpin } from "react-loader-spinner"
import useUserId from "../../hooks/useUserId"
import useFetch from "../../hooks/useFetch"
import { useMachine } from "@xstate/react";
import { apiMachine } from "../../machines/apiMachine"; 

import './index.css'

interface ResponseData{
  date: string;
  sum: number;
  type: string;
}

interface Response {
  last_7_days_transactions_credit_debit_totals: Array<ResponseData>
  last_7_days_transactions_totals_admin: Array<ResponseData>
}

const BarCharts = () => {
  const userId = useUserId()
  const [last7DaysCreditsAndDebitsDate, setLast7DaysCreditsAndDebitsDate] = useState<Array<ResponseData>>([])
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
  const {fetchData} = useFetch(url, options)

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
    getLast7daysCreditsAndDebits()
  }, [userId, state.value, state.context.data])
  
  const getLast7daysCreditsAndDebits = async () => {
    const dataOf7Days = state.context.data as Response|null
    if (dataOf7Days !== null){
      if (userId === '3'){
        setLast7DaysCreditsAndDebitsDate(dataOf7Days.last_7_days_transactions_totals_admin)
      }else{
        setLast7DaysCreditsAndDebitsDate(dataOf7Days.last_7_days_transactions_credit_debit_totals)
      }
    }
  }
  const onClickRetry = () => {
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
  const renderBarchart = () => {
      const dataFormatter = (number: number) => {
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
        const findData = last7DaysCreditsAndDebitsDate !== undefined && last7DaysCreditsAndDebitsDate.filter(each =>new Date(each.date).getDay() === i)
        let creditSum;
        let debitSum;
        if (findData !== false){
          const credit = findData.find((each:ResponseData) => each.type === 'credit') 
          const debit = findData.find((each:ResponseData)=> each.type === 'debit')
          creditSum = credit === undefined ? 0 : credit.sum
          debitSum = debit === undefined ? 0 : debit.sum
          totalCreditSum += creditSum
          totalDebitSum += debitSum
        }
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
                tickFormatter={dataFormatter}
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
              <Bar dataKey="credit" name="Credit" fill="#4C78FF"  radius={[10, 10, 10, 10]}/>
              <Bar dataKey="debit" name="Debit" fill="#FCAA0B"  radius={[10, 10, 10, 10]}/>
      </BarChart>
      </>
    )
  }
  const renderOnApiStatus = () => {
    switch (true) {
      case state.matches('success'):
          return renderBarchart()
      case state.matches('error'):
          return renderFailureView()
      case state.matches('loading'):
          return renderLoadingView()
      default:
          return null
      }
  }

    
  return(
      <div className="debit-credit-overview-container">
        {renderOnApiStatus()}
      </div>
  )
    
}
export default BarCharts