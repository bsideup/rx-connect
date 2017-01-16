import React from "react";
import isPlainObject from "lodash.isplainobject";
import Rx from "./observable";
import ObservableSymbol from "symbol-observable";

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

    if (Rx.Observable.isObservable) {
        return Rx.Observable.isObservable(obj);
    }

    return typeof obj[ObservableSymbol] === 'function';
}

export default function rxConnect(selector, options = DEFAULT_OPTIONS) {
    return WrappedComponent => class RxConnector extends React.PureComponent {

        static displayName = "RxConnector";

        stateSubscription = undefined;

        shouldDebounce = false;

        subProps = {};

        constructor(props) {
            super(props);

            this.props$ = new Rx.BehaviorSubject(props);
        }

        componentWillMount() {
            this.shouldDebounce = false;

            let mutations$ = selector;
            if(!isObservable(mutations$)) {
                mutations$ = selector(this.props$);
            }

            if(!isObservable(mutations$)) {
                    // eslint-disable-next-line no-undef
                if (typeof mutations$[Symbol.iterator] === 'function') {
                    mutations$ = Rx.Observable.merge(...mutations$);
                } else {
                    // eslint-disable-next-line no-console
                    console.error(`Selector must return an Observable, an iterator of observables. Got: `, mutations$);
                    return;
                }
            }

            this.stateSubscription = mutations$
                .scan((state, mutation) => {
                    if (isPlainObject(mutation)) {
                        return Object.assign({}, state, mutation);
                    }

                    if (typeof mutation === "function") {
                        return mutation(state);
                    }

                    // eslint-disable-next-line no-console
                    console.error(`Mutation must be a plain object or function. Check rxConnect of ${getDisplayName(WrappedComponent)}. Got: `, mutation);
                    return state;
                }, {})
                .debounce(() => (!options.noDebounce && this.shouldDebounce) ? Rx.Observable.interval(0) : Rx.Observable.of())
                .subscribe(state => {
                    this.subProps = state;
                    this.forceUpdate();
                });
        }

        componentDidMount() {
            this.shouldDebounce = true;
        }

        componentWillUnmount() {
            this.stateSubscription.dispose();
        }

        componentWillReceiveProps(nextProps) {
            if (this.props$.onNext) {
                this.props$.onNext(nextProps);
            } else {
                this.props$.next(nextProps);
            }
        }

        render() {
            return React.createElement(WrappedComponent, this.subProps, this.props.children);
        }
    };
}
