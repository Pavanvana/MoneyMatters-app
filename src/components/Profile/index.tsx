import { useState, useEffect } from "react";
import SideBar from "../SideBar";
import AddTransaction from '../AddTransaction'
import Loader from 'react-loader-spinner'
import useUserId from "../customHook/getUserId";
import './index.css'
import useFetch from "../customHook/useFetch";

const apiStatusConstants = {
    initial: 'INITIAL',
    success: 'SUCCESS',
    failure: 'FAILURE',
    inProgress: 'IN_PROGRESS',
}

interface User  {
    name: string,
    email: string,
    date_of_birth: string,
}

interface Users{
    users: User[]

}

type T = /*unresolved*/ any

const Profile = () => {
    const userId = useUserId()
    const [profileDetails, setProfileDetails] = useState<User>()

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
    const {data, apiStatus, fetchData} = useFetch(url, options)

    useEffect(() => {
        fetchData()
    }, [])

    useEffect(() => {
        fetchProfileData()
    }, [data, apiStatus, url, userId])

    const fetchProfileData= () => {
        const profile = data as Users|undefined
        if (profile !== undefined){
            setProfileDetails(profile.users[0])
        } 
    }

    const onClickRetry = () => {
        fetchProfileData()
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
          <Loader type="TailSpin" color="#4094EF" height={50} width={50} />
        </div>
    )

    const renderSuccessView = () => {
        return(
            <div className="profile-details-container">
                <img className="profile-icon" src="https://images.unsplash.com/photo-1575936123452-b67c3203c357?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8aW1hZ2V8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60" alt="profile-icon"/>
                <div>
                    <div className="c2">
                        <div className="c1">
                            <label className="profile-label">Your Name</label>
                            <div className="profile-input">
                                <p>{profileDetails?.name}</p>
                            </div>
                        </div>
                        <div className="c1">
                            <label className="profile-label">User Name</label>
                            <div className="profile-input">
                                <p>{profileDetails?.name + "@123"}</p>
                            </div>
                        </div>
                    </div>
                    <div className="c2">
                        <div className="c1">
                            <label className="profile-label">Email</label>
                            <div className="profile-input">
                                <p>{profileDetails?.email}</p>
                            </div>
                        </div>
                        <div className="c1">
                            <label className="profile-label">Date of Birth</label>
                            <div className="profile-input">
                                <p>{profileDetails?.date_of_birth}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    const renderOnApiStatus = () => {
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
            <SideBar activeTab="profile"/>
            <div>
                <div className="heading-container">
                    <h1 className="accounts-heading">Profile</h1>
                    <AddTransaction/>
                </div>
                <div className="profile-container">
                    {renderOnApiStatus()}
                </div>
            </div>
        </div>
    )
    
}

export default Profile