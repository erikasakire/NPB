import {
    LOGIN_USER,
    LOGOUT_USER
} from '../actionTypeConstants';

export function login_user(data){
    return {
        type: LOGIN_USER,
        key: data.key
    };
}

export function logout_user(){
    return {
        type: LOGOUT_USER
    };
}