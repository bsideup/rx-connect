import React from "react";
import Rx from "rx";
import { rxConnect } from "rx-connect";

@rxConnect(
    Rx.Observable.timer(0, 1000).timestamp()
)
export default class Timer extends React.PureComponent {
    render() {
        return <div>{ this.props.value }</div>
    }
}