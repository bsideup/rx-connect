import React from "react";
import Rx from "rxjs";
import { rxConnect } from "../../../../src";

@rxConnect(
    Rx.Observable.timer(0, 1000).map(() => ({ timestamp: Date.now() }))
)
export default class Time extends React.PureComponent {
    render() {
        return <div>{this.props.value} {new Date(this.props.timestamp).toLocaleTimeString()}</div>
    }
}
