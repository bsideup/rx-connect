import Rx from "rx";
import { mapActionCreators } from "../";

test("passes non-observables as is", async () => {
    const props = await mapActionCreators({ a: 123, b: "hi!" }).toPromise();

    expect(props).toMatchSnapshot();
});

test("strips dollar sign from Observable property names", async () => {
    const actions = {
        a$: new Rx.Subject()
    };

    const props = await mapActionCreators(actions).toPromise();

    expect(props).toMatchSnapshot();
});

test("creates FuncSubject-like action", async () => {
    const actions = {
        a$: new Rx.BehaviorSubject()
    };

    const props = await mapActionCreators(actions).toPromise();

    props.a(1, 2, 3);

    expect(actions.a$.getValue()).toMatchSnapshot();
});
