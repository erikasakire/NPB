import {
    LOGIN_USER,
    LOGOUT_USER
} from '../actionTypeConstants';

const accessControl = (state = null, action) => {
    switch (action.type){
        case LOGIN_USER:
            return Object.assign({}, state,
                {
                    accessKey: action.key,
                    name: action.name
                }   
            );
        case LOGOUT_USER:
            return null;
        default: 
            return state;
    }
}

export default accessControl;