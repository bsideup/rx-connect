import React from "react";
import Rx from "rx";
import isPlainObject from "lodash.isplainobject";

function getDisplayName(WrappedComponent) {
    return WrappedComponent.displayName || WrappedComponent.name || "Component";
}

export default function rxConnect(selectorOrObservable) {
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

            const mutations$ = Rx.Observable.isObservable(selectorOrObservable) ? selectorOrObservable : selectorOrObservable(this.props$);

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
                .debounce(() => this.shouldDebounce ? Rx.Observable.interval(0) : Rx.Observable.of())
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
            this.props$.onNext(nextProps);
        }

        render() {
            return React.createElement(WrappedComponent, this.subProps, this.props.children);
        }
    };
}
