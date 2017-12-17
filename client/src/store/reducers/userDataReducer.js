import {
    LOGIN_USER,
    LOGOUT_USER
} from '../actionTypeConstants';

const userData = (state = null, action) => {
    switch(action.type){
        case LOGIN_USER: {
            return Object.assign({}, state,
                {
                    vardas: action.Vardas,
                    pavarde: action.Pavarde,
                    rangas: {
                        rangas: action.rangas,
                        id: action.id
                    }
                }
            );
        }
        case LOGOUT_USER: {
            return null;
        }
        default:
            return state;
    }
}

export default userData;