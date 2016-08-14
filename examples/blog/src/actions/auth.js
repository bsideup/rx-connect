import Rx from "rx";

export const USER_LOGGED_IN = `${__filename}/userLoggedIn`;
export const USER_LOGGED_OUT = `${__filename}/userLoggedOut`;

import { fetchUser } from "./users";

export function login(email, password) {
    return (dispatch) => {
        if (!email) {
            return Rx.Observable.throw("Email must not be empty");
        }

        if (!password) {
            return Rx.Observable.throw("Password must not be empty");
        }

        return dispatch(fetchUser(5)) // Simulate auth
            .delay(100)
            .doOnNext(user => dispatch({ type: USER_LOGGED_IN, user }))
    }
}

export function logout() {
    return {
        type: USER_LOGGED_OUT,
    }
}
