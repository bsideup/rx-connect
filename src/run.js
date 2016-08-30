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

    return Rx.Observable
        .merge(
            Rx.Observable.of(actionCreators),
            reactions$
        )
        .scan((state, mutation) => {
            let change;
            if (isPlainObject(mutation)) {
                change = mutation;
            } else if (typeof mutation === "function") {
                change = mutation(state);
            } else {
                // eslint-disable-next-line no-console
                console.error(`Mutation must be a plain object or function. Got: `, mutation);
                return state;
            }

            return Object.assign({}, state, change);
        }, {});
}
