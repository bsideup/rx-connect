import Rx from "rx";

export function ofActions(actions) {
    return this.of(
        Object.keys(actions)
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
            )
    )
}

export default function mapActionCreators(actions) {
    return Rx.Observable::ofActions(actions);
}
