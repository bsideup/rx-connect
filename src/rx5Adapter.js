import Rx from "rxjs";
import ObservableSymbol from "symbol-observable";

export default {

    description: "RX5",

    Rx,

    next(o, value) {
        o.next(value);
    },

    isObservable(obj) {
        return obj && typeof obj[ObservableSymbol] === 'function';
    },

    unsubscribe(subscription) {
        subscription.unsubscribe();
    }
}
