import './index.css'

interface Props{
    transactionType: {
        id: number;
        type: string;
    }
    setActiveTabId: Function 
    isActive: boolean
}

const EachType = (props:Props) => {
    const {transactionType, setActiveTabId, isActive} = props 
    const {id, type} = transactionType
    const onClickType = () => {
        setActiveTabId(id)
    }
    const activeTabClassName = isActive && "active-class"
    return(
        <li>
            <button type='button' className={`transactions-type ${activeTabClassName}`} onClick={onClickType}>{type}</button>
        </li>
    )
}
export default EachType