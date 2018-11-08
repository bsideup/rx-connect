import { Observable, Subject, BehaviorSubject, ReplaySubject } from "rxjs-v5";
import "rxjs-v5/add/observable/of";
import "rxjs-v5/add/observable/interval";
import "rxjs-v5/add/observable/merge";
import { scan, debounce, map, pluck, take } from "rxjs-v5/operators";
import ObservableSymbol from "symbol-observable";

const handler = {
  get: function(obj, key) {
    return obj.hasOwnProperty(key) ? obj[key] : Observable;
  }
};

const ObservableProxy = new Proxy({
  scan,
  debounce,
  map,
  pluck,
  take,
  interval: Observable.interval,
  merge: Observable.merge,
  of: Observable.of
}, handler);

export default {

    Rx: {
      Observable: ObservableProxy,
      Subject,
      ReplaySubject,
      BehaviorSubject,
    },

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
