import { useEffect, useState } from "react"

const apiStatusConstants = {
    initial: 'INITIAL',
    success: 'SUCCESS',
    failure: 'FAILURE',
    inProgress: 'IN_PROGRESS',
}

const useFetch =  (url, options) => {
    const [data, setData] = useState([])
    const [apiStatus, setApiStatus] = useState(apiStatusConstants.initial)
    const fetchData = async () => {
        setApiStatus(apiStatusConstants.inProgress)
        const response = await fetch(url,options)
        if (response.ok){
            setApiStatus(apiStatusConstants.success)
            const fetchedData = await response.json()
            setData(fetchedData)
        }else{
            setApiStatus(apiStatusConstants.failure)
        }
    }
    return {data, apiStatus, fetchData}
}
export default useFetch