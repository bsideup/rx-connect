import Rx from "rx/dist/rx.lite";

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
