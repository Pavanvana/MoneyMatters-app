import Cookies from "js-cookie"

const useUserId = () => {
     return Cookies.get("user_id")
}
export default useUserId