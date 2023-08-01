import { Component } from "react";
import SideBar from "../SideBar";
import AddTransaction from '../AddTransaction'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import './index.css'

const apiStatusConstants = {
    initial: 'INITIAL',
    success: 'SUCCESS',
    failure: 'FAILURE',
    inProgress: 'IN_PROGRESS',
}
class Profile extends Component{
    state = {
        profileDetails: '',
        apiStatus: apiStatusConstants.initial
    }

    componentDidMount = () => {
        this.fetchProfileData()
    }

    fetchProfileData= async () => {
        this.setState({apiStatus: apiStatusConstants.inProgress})
        const url = 'https://bursting-gelding-24.hasura.app/api/rest/profile'
        const userId = Cookies.get('user_id')
        const options = {
            method: 'GET',
            headers: {
                'content-type': 'application/json',
                'x-hasura-admin-secret': 'g08A3qQy00y8yFDq3y6N1ZQnhOPOa4msdie5EtKS1hFStar01JzPKrtKEzYY2BtF',
                'x-hasura-role': 'user',
                'x-hasura-user-id': userId
            }
        }
        const response = await fetch(url, options)
        const data = await response.json()
        if (response.ok) {
            this.setState({profileDetails: data.users[0], apiStatus: apiStatusConstants.success})
        }else{
            this.setState({apiStatus: apiStatusConstants.failure})
        }
    }

    onClickReTry = () => {
        this.fetchProfileData()
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

    renderSuccessView = () => {
        const {profileDetails} = this.state
        return(
            <div className="profile-details-container">
                <img className="profile-icon" src="https://images.unsplash.com/photo-1575936123452-b67c3203c357?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8aW1hZ2V8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60" alt="profile-icon"/>
                <div>
                    <div className="c2">
                        <div className="c1">
                            <label className="profile-label">Your Name</label>
                            <div className="profile-input">
                                <p>{profileDetails.name}</p>
                            </div>
                        </div>
                        <div className="c1">
                            <label className="profile-label">User Name</label>
                            <div className="profile-input">
                                <p>{profileDetails.name + "@123"}</p>
                            </div>
                        </div>
                    </div>
                    <div className="c2">
                        <div className="c1">
                            <label className="profile-label">Email</label>
                            <div className="profile-input">
                                <p>{profileDetails.email}</p>
                            </div>
                        </div>
                        <div className="c1">
                            <label className="profile-label">Date of Birth</label>
                            <div className="profile-input">
                                <p>{profileDetails.date_of_birth}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    onRenderProfile = () => {
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
    render(){
        return(
            <div className="main-container">
                <SideBar/>
                <div>
                    <div className="heading-container">
                        <h1 className="accounts-heading">Profile</h1>
                        <AddTransaction/>
                    </div>
                    <div className="profile-container">
                        {this.onRenderProfile()}
                    </div>
                </div>
            </div>
        )
    }
}

export default Profile