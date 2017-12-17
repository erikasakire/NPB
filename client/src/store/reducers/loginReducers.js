import {
    LOGIN_USER,
    LOGOUT_USER
} from '../actionTypeConstants';

const accessControl = (state = [], action) => {
    switch (action.type){
        case LOGIN_USER:
            return [
                ...state,
                {
                    accessKey: action.key
                }   
            ];
        case LOGOUT_USER:
            return undefined;
        default: 
            return state;
    }
}

export default accessControl;