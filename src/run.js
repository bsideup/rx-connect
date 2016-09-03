import mapActionCreators from "./mapActionCreators";

export default function run(reactions$, actions) {
    return actions ? mapActionCreators(actions).merge(reactions$) : reactions$;
}
