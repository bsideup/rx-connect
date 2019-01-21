import { Observable, Subject, BehaviorSubject, ReplaySubject, isObservable, of, merge, interval } from "rxjs";
import { scan, map, debounce, pluck, take } from "rxjs/operators";

const handler = {
  get: function(obj, key) {
    return obj.hasOwnProperty(key) ? obj[key] : Observable;
  }
};

const ObservableProxy = new Proxy({
  merge,
  scan,
  interval,
  map,
  debounce,
  pluck,
  take,
  of
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
        return obj && isObservable(obj);
    },

     unsubscribe(subscription) {
        subscription.unsubscribe();
    }
}
