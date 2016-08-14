import { USER_LOGGED_IN, USER_LOGGED_OUT } from "../actions/auth";

export default function (state = null, action) {
    switch (action.type) {
        case USER_LOGGED_IN:
            return action.user;
        case USER_LOGGED_OUT:
            return null;
        default:
            return state;
    }
}
