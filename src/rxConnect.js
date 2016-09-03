import React from "react";
import Rx from "rx";
import isPlainObject from 'lodash.isplainobject';

function getDisplayName(WrappedComponent) {
    return WrappedComponent.displayName || WrappedComponent.name || 'Component';
}

export default function rxConnect(propsSelectorOrObservable) {
    return WrappedComponent => class RxConnector extends React.PureComponent {

        static displayName = 'RxConnector';

        static contextTypes = {
            store: React.PropTypes.object
        };

        stateSubscription = undefined;

        state = {};

        shouldDebounce = false;

        _streamMutations() {
            if (Rx.Observable.isObservable(propsSelectorOrObservable)) {
                return propsSelectorOrObservable;
            }

            this.props$ = new Rx.BehaviorSubject(this.props);

            const store = this.props.store || this.context.store;

            if (store) {
                const state$ = Rx.Observable
                    .create(observer => store.subscribe(() => observer.onNext(store.getState())))
                    .startWith(store.getState())
                    .distinctUntilChanged();

                return propsSelectorOrObservable(this.props$, state$, store.dispatch);
            } else {
                return propsSelectorOrObservable(this.props$);
            }
        }

        componentWillMount() {
            this.shouldDebounce = false;

            this.stateSubscription = this._streamMutations()
                .scan((state, mutation) => {
                    let change;
                    if (isPlainObject(mutation)) {
                        change = mutation;
                    } else if (typeof mutation === "function") {
                        change = mutation(state);
                    } else {
                        // eslint-disable-next-line no-console
                        console.error(`Mutation must be a plain object or function. Check rxConnect of ${getDisplayName(WrappedComponent)}. Got: `, mutation);
                        return state;
                    }

                    return Object.assign({}, state, change);
                }, {})
                .debounce(() => this.shouldDebounce ? Rx.Observable.interval(0) : Rx.Observable.of())
                .subscribe(::this.setState);
        }

        componentDidMount() {
            this.shouldDebounce = true;
        }

        componentWillUnmount() {
            this.stateSubscription.dispose();
        }

        componentWillReceiveProps(nextProps) {
            this.props$ && this.props$.onNext(nextProps);
        }

        render() {
            return React.createElement(WrappedComponent, {
                ...this.props,
                ...this.state
            });
        }
    };
}
