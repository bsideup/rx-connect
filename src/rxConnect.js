import React from "react";
import isPlainObject from "lodash.isplainobject";
import isObject from "lodash.isobject";
import isArray from "lodash.isarray";

const DEFAULT_OPTIONS = {
    noDebounce: false
};

function getDisplayName(WrappedComponent) {
    return WrappedComponent.displayName || WrappedComponent.name || "Component";
}
function isObservable(obj) {
    if (!obj) {
        return false;
    }

    return getAdapter().isObservable(obj);
}

export function getAdapter() {
    const adapter = rxConnect.adapter || require("./rx6adapter");
    return adapter.__esModule ? adapter.default : adapter;
}

export default function rxConnect(selector, options = DEFAULT_OPTIONS) {
    return WrappedComponent => class RxConnector extends React.PureComponent {

        static displayName = "RxConnector";

        stateSubscription = undefined;

        shouldDebounce = false;

        subProps = {};

        constructor(props) {
            super(props);
            const { Rx } = getAdapter();

            this.props$ = new (Rx.BehaviorSubject)(props);
        }

        componentWillMount() {
            const { Rx: { Observable } } = getAdapter();

            this.shouldDebounce = false;

            let mutations$ = selector;
            if(!isObservable(mutations$)) {
                if (typeof selector === 'function') {
                    mutations$ = selector(this.props$);
                } else {
                    // eslint-disable-next-line no-console
                    console.error(`Selector must be a function or an Observable. Check rxConnect of ${getDisplayName(WrappedComponent)}. Got: `, selector);
                    return;
                }
            }

            if(!isObservable(mutations$)) {
                    // eslint-disable-next-line no-undef
                if (mutations$ && typeof mutations$[Symbol.iterator] === 'function') {
                    mutations$ = Observable.merge(...mutations$);
                } else {
                    // eslint-disable-next-line no-console
                    console.error(`Selector must return an Observable or an iterator of observables. Check rxConnect of ${getDisplayName(WrappedComponent)}. Got: `, mutations$);
                    return;
                }
            }
            
            this.stateSubscription = mutations$.pipe(
                Observable.scan((state, mutation) => {
                    if (typeof mutation === "function") {
                        return mutation(state);
                    }

                    if (isPlainObject(mutation)) {
                        return Object.assign({}, state, mutation);
                    }

                    if (isObject(mutation) && !isArray(mutation)) {
                        return Object.assign({}, state, {...mutation});
                    }

                    // eslint-disable-next-line no-console
                    console.error(`Mutation must be a plain object or function. Check rxConnect of ${getDisplayName(WrappedComponent)}. Got: `, mutation);
                    return state;
                }, {}),
                Observable.debounce(() => (!options.noDebounce && this.shouldDebounce) ? Observable.interval(0) : Observable.of()),
                ).subscribe(state => {
                  this.subProps = state;
                  this.forceUpdate();
                });
        }

        componentDidMount() {
            this.shouldDebounce = true;
        }

        componentWillUnmount() {
            getAdapter().unsubscribe(this.stateSubscription);
        }

        componentWillReceiveProps(nextProps) {
            getAdapter().next(this.props$, nextProps);
        }

        render() {
            return React.createElement(WrappedComponent, this.subProps, this.props.children);
        }
    };
}
