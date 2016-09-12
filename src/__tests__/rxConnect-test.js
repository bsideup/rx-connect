import React from "react";
import Rx from "rx";
import renderer from "react-test-renderer";

import { rxConnect } from "../";

test("works with Observable", () => {
    const props$ = Rx.Observable.of({ a: 123 });

    const Component = rxConnect(props$)(({ a }) => <div>{a}</div>);

    const tree = renderer.create(<Component />).toJSON();

    expect(tree).toMatchSnapshot();
});

test("passes properties as Observable", () => {
    const connector = props$ => props$.pluck("someProp").map(a => ({ a }));

    const Component = rxConnect(connector)(({ a }) => <div>{a}</div>);

    const tree = renderer.create(<Component someProp={123} />).toJSON();

    expect(tree).toMatchSnapshot();
});

test("passes children automatically", () => {
    const Component = rxConnect(Rx.Observable.of({}))(({ children }) => <div>{children}</div>);

    const tree = renderer.create(<Component>Hello, RxConnect!</Component>).toJSON();

    expect(tree).toMatchSnapshot();
});

test("ignores not connect properties", () => {
    const Component = rxConnect(Rx.Observable.of({ }))(({ a }) => <div>{a}</div>);

    const tree = renderer.create(<Component a={123} />).toJSON();

    expect(tree).toMatchSnapshot();
});

test("accepts function-based mutations", () => {
    const Component = rxConnect(Rx.Observable.of(() => ({ a: 123 })))(({ a }) => <div>{a}</div>);

    const tree = renderer.create(<Component />).toJSON();

    expect(tree).toMatchSnapshot();
});

test("throws an error if mutation is neither an object or function", () => {
    // eslint-disable-next-line no-console
    console.error = jest.genMockFn();

    const Component = rxConnect(Rx.Observable.of([ 123 ]))(({ a }) => <div>{a}</div>);
    renderer.create(<Component />).toJSON();

    // eslint-disable-next-line no-console
    expect(console.error.mock.calls[0]).toMatchSnapshot();
});

test("receives new props", async () => {
    const connector = props$ => props$.map(({ a, b }) => ({ a: a + b }));

    const Component = rxConnect(connector)(({ a }) => <div>{a}</div>);

    class Parent extends React.Component {
        state = {
            a: 10,
            b: 5
        };

        render() {
            return <Component {...this.state} />
        }
    }

    const parent = renderer.create(<Parent />);

    // 15
    expect(parent.toJSON()).toMatchSnapshot();

    parent.getInstance().setState({ a: -5 });

    // Still 15 because of debouncing
    expect(parent.toJSON()).toMatchSnapshot();

    parent.getInstance().setState({ b: -10 });

    // Skip 1 frame because of debounce
    await Rx.Observable.interval(0).take(1).toPromise();

    expect(parent.toJSON()).toMatchSnapshot();
});

test("handles unmount", () => {
    const props$ = new Rx.ReplaySubject();

    expect(props$.hasObservers()).toBeFalsy();

    const Component = rxConnect(props$)(({ a }) => <div>{a}</div>);

    const node = renderer.create(<Component />);

    expect(props$.hasObservers()).toBeTruthy();

    node.unmount();

    expect(props$.hasObservers()).toBeFalsy();
});
