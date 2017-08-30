import Rx from "rxjs";

export function fetchUsers() {
    return () => {
        return Rx.Observable.ajax(`//jsonplaceholder.typicode.com/users`).map(e => e.response);
    }
}

export function fetchUser(userId) {
    return () => {
        return Rx.Observable.ajax(`//jsonplaceholder.typicode.com/users/${userId}`).map(e => e.response);
    }
}
