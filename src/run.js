import Rx from "rx";
import isPlainObject from 'lodash/isPlainObject';

export default function run(reactions$, actions = {}) {

    const actionCreators = Object.keys(actions)
        .reduce(
            (result, key) => {
                const action = actions[key];

                if (key.endsWith("$")) {
                    result[key.slice(0, -1)] = (...args) => action.onNext(args);
                } else {
                    result[key] = action;
                }

                return result;
            },
            {}
        );

    return Rx.Observable.of(actionCreators)
        .concat(reactions$)
        .scan( (state, reducerOrStatePart) => ({
            ...state,
            ...(isPlainObject(reducerOrStatePart) ? reducerOrStatePart : reducerOrStatePart(state))
        }));
}
