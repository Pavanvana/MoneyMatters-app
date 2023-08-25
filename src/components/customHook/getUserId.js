import Cookies from "js-cookie"

const useCookieId = () => {
    return Cookies.get("user_id")
}
export default useCookieId