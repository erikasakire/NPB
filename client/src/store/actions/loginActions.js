import {
    LOGIN_USER,
    LOGOUT_USER
} from '../actionTypeConstants';

export function login_user(data){
    return {
        type: LOGIN_USER,
        key: data.key,
        name: data.name,
        Vardas: data.Vardas,
        Pavarde: data.Pavarde,
        rangas: data.Pareigos,
        id: data.PareiguKodas
    };
}

export function logout_user(){
    return {
        type: LOGOUT_USER
    };
}