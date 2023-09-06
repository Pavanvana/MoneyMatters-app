import { useQuery, gql } from "@apollo/client";
import { TailSpin } from 'react-loader-spinner'
import { Link } from "react-router-dom";
import './index.css'

const launche_query = gql`
   query GetAllLaunchesDetails($offset: Int!, $limit: Int!) {
    launches(offset: $offset, limit: $limit) {
      mission_name
      launch_date_utc
      rocket {
        rocket_name
      }
      links {
        article_link
        video_link
      }
    }
  }
 `;

const Launches = () => {
    const {data, loading, fetchMore} = useQuery(launche_query, {
        variables: { offset: 0, limit: 10},
      })
      
    const renderLoadingView = () => (
        <div className="loader">
          <TailSpin color="#4094EF" height={50} width={50} />
        </div>
    )

    const handleScroll = (e: any) => {
      const scroll = e.target.offsetHeight + e.target.scrollTop
      const height = e.target.scrollHeight - 1

      if (scroll >= height){
          fetchMore({
            variables: {limit: data.launches.length + 10, offset: data.launches.length}
          })
      }
    };

    return(
        <div className="app-container">
            <div className="container" onScroll={handleScroll}>
                {loading && renderLoadingView()}
                <ul>
                    {data && data.launches.map((each: any) => (
                        <li key={each.id}>
                            <h1>Mission Name: {each.mission_name}</h1>
                            <p>Mission Type: {each.__typename}</p>
                            <p>Rocket Name: {each.rocket.rocket_name}</p>
                            <p>Rocket Launch Date: {each.launch_date_utc}</p>
                            <p>Article Link: {each.links.article_link}</p>
                            <Link to={each.links.video_link}>
                              <button type="button" className="video-button">Watch video</button>
                            </Link>
                            <p>Type Link: {each.links.__typename}</p>
                        </li>
                    ))}
                </ul>

            </div>
        </div>
    )
}
export default Launches