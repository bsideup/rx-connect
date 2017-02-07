import Rx from "rx";

export default {

    Rx,

    next(o, value) {
        o.onNext(value);
    },

    isObservable(obj) {
        return obj && Rx.Observable.isObservable(obj);
    },

    unsubscribe(subscription) {
        subscription.dispose();
    }
}
