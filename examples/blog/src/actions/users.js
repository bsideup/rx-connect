import Rx from "rx";

export function fetchUsers() {
    return () => {
        return Rx.DOM.getJSON(`//jsonplaceholder.typicode.com/users`);
    }
}

export function fetchUser(userId) {
    return () => {
        return Rx.DOM.getJSON(`//jsonplaceholder.typicode.com/users/${userId}`);
    }
}
