import {useEffect} from "react";
import { useNavigate } from 'react-router';
import { useCookies } from 'react-cookie';

const Logout = () => {
    const [cookies, setCookie, removeCookie] = useCookies();
    const history = useNavigate();
    const logout = async () => {
        try {
            removeCookie("jwt");
            removeCookie("usertype");
            removeCookie("username");
            history('/login');
        } catch (error) {
            console.log(error)
        }
    }
    useEffect(() => {
        logout();
    });
    return (
        <div></div>
    );
}

export default Logout;
