import { useState, useEffect } from "react"
import {Link,useHistory} from "react-router-dom"
import {AiFillHome} from 'react-icons/ai'
import {RiMoneyDollarBoxFill} from 'react-icons/ri'
import {CgProfile} from 'react-icons/cg'
import {LuLogOut} from 'react-icons/lu'
import {GrFormClose} from 'react-icons/gr'
import Popup from 'reactjs-popup'
import Cookies from 'js-cookie'
import useUserId from "../customHook/getUserId"

import './index.css'
import useFetch from "../customHook/useFetch"


const SideBar = (props) => {
    const userId = useUserId()
    const {activeTab} = props
    const history = useHistory()
    const [profileDetails, setProfileDetails] = useState('')

    const url = 'https://bursting-gelding-24.hasura.app/api/rest/profile'
    const options = {
        method: 'GET',
        headers: {
            'content-type': 'application/json',
            'x-hasura-admin-secret': 'g08A3qQy00y8yFDq3y6N1ZQnhOPOa4msdie5EtKS1hFStar01JzPKrtKEzYY2BtF',
            'x-hasura-role': 'user',
            'x-hasura-user-id': userId
        }
    }
    const {data, fetchData} = useFetch(url, options)

    useEffect(() => {
        fetchData()
    }, [])

    useEffect(() => {
        fetchProfileDetails()
    }, [userId, data])
    
    const fetchProfileDetails= async () => {
        if (data.users !== undefined){
            setProfileDetails(data.users[0])
        }
    }

    const onClickLogout = () => {
        Cookies.remove('user_id')
        history.replace('/login')
    }

    const transactionsName = userId === '3' ? "All Transactions" : "Transactions"
    return(
        <div className="side-bar">
        <div>
        <div className="logo-container">
            <img
                src="https://res.cloudinary.com/daflxmokq/image/upload/v1690619081/Group_hmc6ea.jpg"
                alt="website logo"
                className="website-logo"
            />
            <p className="app-name">Money <span className="matters">Matters</span></p>
        </div>
        <ul className="side-bar-components-container">
            <li key="dashboard" className="dashboard-container" >
            <Link to="/" className="link">
                <div className={activeTab === 'dashboard' ? "active-name-icon-container" : "name-icon-container"}>
                    {activeTab === 'dashboard' && <div className="active"></div>}
                    <AiFillHome className={activeTab === 'dashboard' ? "active-icon" : "icon"}/>
                    <p className={activeTab === 'dashboard' ? "active-dashboard-name" : "dashboard-name"}>Dashboard</p>
                </div>
            </Link>
            </li>
            <li key="transactions" className="dashboard-container" >
            <Link to="/transactions" className="link">
                <div className={activeTab === 'transactions' ? "active-name-icon-container" : "name-icon-container"}>
                    {activeTab === 'transactions' && <div className="active"></div>}
                    <RiMoneyDollarBoxFill className={activeTab === 'transactions' ? "active-icon" : "icon"}/>
                    <p className={activeTab === 'transactions' ? "active-dashboard-name" : "dashboard-name"}>{transactionsName}</p>
                </div>
            </Link>
            </li>
            <li key="profile" className="dashboard-container" >
            <Link to="/profile" className="link">
                <div className={activeTab === 'profile' ? "active-name-icon-container" : "name-icon-container"}>
                    {activeTab === 'profile' && <div className="active"></div>}
                    <CgProfile className={activeTab === 'profile' ? "active-icon" : "icon"}/>
                    <p className={activeTab === 'profile' ? "active-dashboard-name" : "dashboard-name"}>Profile</p>
                </div>
            </Link>
            </li>
        </ul>  
        </div>
        <div className="logout-container">
            <Link to="/profile" className="link">
            <div className="profile">
                <img className="sidebar-profile" src="https://images.unsplash.com/photo-1575936123452-b67c3203c357?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8aW1hZ2V8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60" alt="profile-icon"/>
                <div>
                    <p className="user-name">{profileDetails.name}</p>
                    <p className="user-email">{profileDetails.email}</p>
                </div>
            </div>
            </Link>
            <Popup
                modal
                trigger={
                    <button className="logout-buttton" type="button">
                    <LuLogOut className="logout-icon"/>
                    </button>
                }
                className="popup-content"
                position="right center"
                >
                {close => (
                    <div className="model">
                    <div className="overlay">
                        <div className="modal-container">
                            <div className="close-button-container">
                            <button
                                className="close-btn"
                                type="button"
                                onClick={() => close()}
                            >
                                <GrFormClose size="20" />
                            </button>
                            </div>
                            <div className="logout-description-icon-con">
                                <div className="logout-icon-container-1">
                                    <div className="logout-icon-container-2">
                                        <LuLogOut className="logout-icon"/>
                                    </div>
                                </div>
                                <div>
                                    <h3 className="logout-pop-heading">Are you sure you want to Logout?</h3>
                                    <p className="logout-pop-description">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed </p>
                                    <div className="logout-btns-con">
                                        <button type="button" className="yes-logout-btn" onClick={onClickLogout}>Yes, Logout</button>
                                        <button type="button" className="cancel-logout-btn" onClick={() => close()}>Cancel</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    </div>
                )}
            </Popup>
        </div>               
    </div>
    )

}

export default SideBar