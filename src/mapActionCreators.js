import { getAdapter } from "./rxConnect";

export function ofActions(actions) {
    return this.of(
        Object.keys(actions)
            .reduce(
                (result, key) => {
                    const action = actions[key];

                    if (key.endsWith("$")) {
                        result[key.slice(0, -1)] = (...args) => {
                            getAdapter().next(action, args);
                        }
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
    return getAdapter().Rx.Observable::ofActions(actions);
}
