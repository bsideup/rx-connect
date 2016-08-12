import React  from "react";
import Rx from "rx";

export default function rxConnect(selectState) {
    return WrappedComponent => class RxConnector extends React.PureComponent {

        static displayName = 'RxConnector';

        static contextTypes = {
            store: React.PropTypes.object.isRequired
        };

        stateSubscription = undefined;

        store = undefined;

        state$ = undefined;

        state = {
            props: {}
        };

        constructor(props, context) {
            super(props, context);

            this.props$ = new Rx.BehaviorSubject(props);

            this.store = props.store || context.store;

            this.state$ = Rx.Observable
                .create(observer => this.store.subscribe(() => observer.onNext(this.store.getState())))
                .startWith(this.store.getState())
                .distinctUntilChanged();
        }

        componentWillMount() {
            this.stateSubscription = selectState(this.props$, this.state$, this.store.dispatch).subscribe(props => this.setState({ props }));
        }

        componentWillUnmount() {
            this.stateSubscription.dispose();
        }

        componentWillReceiveProps(nextProps) {
            this.props$.onNext(nextProps);
        }

        render() {
            return React.createElement(WrappedComponent, {
                ...this.props,
                ...this.state.props
            });
        }
    };
}
