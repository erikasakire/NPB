import {
    LOGIN_USER,
    LOGOUT_USER
} from '../actionTypeConstants';

const userData = (state = [], action) => {
    switch(action.type){
        case LOGIN_USER: {
            return [
                ...state,
                {  
                    vardas: action.Vardas,
                    pavarde: action.Pavarde,
                    rangas: {
                        rangas: action.rangas,
                        id: action.id
                    }
                }
            ]
        }
        case LOGOUT_USER: {
            return undefined;
        }
        default:
            return state;
    }
}

export default userData;