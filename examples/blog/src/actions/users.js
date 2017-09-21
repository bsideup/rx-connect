import Rx from "rxjs";

export function fetchUsers() {
    return () => {
        return Rx.Observable.ajax(`//jsonplaceholder.typicode.com/users`)
            .pluck("response");
    }
}

export function fetchUser(userId) {
    return () => {
        return Rx.Observable.ajax(`//jsonplaceholder.typicode.com/users/${userId}`)
            .pluck("response");
    }
}
