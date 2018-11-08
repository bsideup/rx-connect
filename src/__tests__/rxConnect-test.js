import React from "react";
import renderer from "react-test-renderer";

import { rxConnect } from "../";
// import rx4Adapter from "../rx4Adapter";
import { getAdapter } from "../rxConnect";

const suites = {
    "RxJS 6": () => {},
  // "RxJS 4": () => rxConnect.adapter = rx4Adapter,
}

Object.entries(suites).forEach(([ name, initializer ]) => describe(name, () => {
    let Rx;
    beforeEach(() => {
        initializer();
        const adapter = getAdapter();
        Rx = adapter.Rx;
    });

    it("works with Observable", () => {
        const props$ = Rx.Observable.of({ a: 123 });

        const Component = rxConnect(props$)(({ a }) => <div>{a}</div>);

        const tree = renderer.create(<Component />).toJSON();

        expect(tree).toMatchSnapshot();
    });

    it("works with Array", () => {
        const props$ = () => [
            Rx.Observable.of({ a: 123 }),
            Rx.Observable.of({ foo: "bar" }),
        ];

        const Component = rxConnect(props$)(({ a, foo }) => <div>{a}{foo}</div>);

        const tree = renderer.create(<Component />).toJSON();

        expect(tree).toMatchSnapshot();
    });

    it("works with Generator", () => {
        const props$ = function* () {
            yield Rx.Observable.of({ a: 123 });
            yield Rx.Observable.of({ foo: "bar" });
        };

        const Component = rxConnect(props$)(({ a, foo }) => <div>{a}{foo}</div>);

        const tree = renderer.create(<Component />).toJSON();

        expect(tree).toMatchSnapshot();
    });

    it("passes properties as Observable", () => {
        const connector = props$ => props$.pipe(
          Rx.Observable.pluck("someProp"), 
          Rx.Observable.map(a => ({ a }))
        );

        const Component = rxConnect(connector)(({ a }) => <div>{a}</div>);

        const tree = renderer.create(<Component someProp={123} />).toJSON();

        expect(tree).toMatchSnapshot();
    });

    it("passes children automatically", () => {
        const Component = rxConnect(Rx.Observable.of({}))(({ children }) => <div>{children}</div>);

        const tree = renderer.create(<Component>Hello, RxConnect!</Component>).toJSON();

        expect(tree).toMatchSnapshot();
    });

    it("ignores not connect properties", () => {
        const Component = rxConnect(Rx.Observable.of({ }))(({ a }) => <div>{a}</div>);

        const tree = renderer.create(<Component a={123} />).toJSON();

        expect(tree).toMatchSnapshot();
    });

    it("accepts function-based mutations", () => {
        const Component = rxConnect(Rx.Observable.of(() => ({ a: 123 })))(({ a }) => <div>{a}</div>);

        const tree = renderer.create(<Component />).toJSON();

        expect(tree).toMatchSnapshot();
    });

    it("throws an error if mutation is neither an object or function", () => {
        // eslint-disable-next-line no-console
        console.error = jest.genMockFn();

        const Component = rxConnect(Rx.Observable.of([ 123 ]))(({ a }) => <div>{a}</div>);
        renderer.create(<Component />).toJSON();

        // eslint-disable-next-line no-console
        expect(console.error.mock.calls[0]).toMatchSnapshot();
    });

    it("throws an error if selector is neither an Observable or function", () => {
        // eslint-disable-next-line no-console
        console.error = jest.genMockFn();

        const Component = rxConnect(undefined)(({ a }) => <div>{a}</div>);
        renderer.create(<Component />).toJSON();

        // eslint-disable-next-line no-console
        expect(console.error.mock.calls[0]).toMatchSnapshot();
    });

    it("throws an error if selector returns non-Observable", () => {
        // eslint-disable-next-line no-console
        console.error = jest.genMockFn();

        const Component = rxConnect(() => undefined)(({ a }) => <div>{a}</div>);
        renderer.create(<Component />).toJSON();

        // eslint-disable-next-line no-console
        expect(console.error.mock.calls[0]).toMatchSnapshot();
    });

    it("receives new props", async () => {
        const connector = props$ => props$.pipe(
          Rx.Observable.map(({ a, b }) => ({ a: a + b }))
        );

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
        await Rx.Observable.interval(0).pipe(
          Rx.Observable.take(1)
        ).toPromise();

        expect(parent.toJSON()).toMatchSnapshot();
    });

    it("noDebounce", () => {
        const Component = rxConnect(props$ => props$, { noDebounce: true })(({ i }) => <div>{i}</div>);

        class Parent extends React.Component {
            state = {
                i: 0
            };

            render() {
                return <Component {...this.state} />
            }
        }

        const parent = renderer.create(<Parent />);

        expect(parent.toJSON()).toMatchSnapshot();

        parent.getInstance().setState({ i: 1 });

        expect(parent.toJSON()).toMatchSnapshot();
    })

    it("handles unmount", () => {
        const props$ = new Rx.ReplaySubject();

        expect(props$.observers).toHaveLength(0);

        const Component = rxConnect(props$)(({ a }) => <div>{a}</div>);

        const node = renderer.create(<Component />);

        expect(props$.observers).toHaveLength(1);

        node.unmount();

        expect(props$.observers).toHaveLength(0);
    });
}));
