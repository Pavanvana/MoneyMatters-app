import { useState } from "react"
import apiStatusConstants from "../types/apiStatusTypes";

const useFetch =  (url: string, options: object) => {
    const [data, setData] = useState<object|undefined>()
    const [apiStatus, setApiStatus] = useState<apiStatusConstants>('INITIAL')
    const fetchData = async (onSuccess?:(data: any) => void, onError?:(error: Error) => void) => {
        setApiStatus('IN_PROGRESS')
        const response = await fetch(url,options)
        if (response.ok){
            setApiStatus('SUCCESS')
            const fetchedData = await response.json()
            setData(fetchedData)
            onSuccess?.(fetchedData)
            return fetchedData
        }else{
            setApiStatus('FAILURE')
            onError?.(new Error())
        }
    }
    return {data , apiStatus, fetchData}
}
export default useFetch