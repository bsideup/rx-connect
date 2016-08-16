import "semantic-ui-css/semantic.css";

import React from "react";
import ReactDOM from "react-dom";
import { rxConnect, run } from "rx-connect";
import Rx from "rx";

const CHANNELS = [
    "en.wikipedia.org",
    "ru.wikipedia.org",
    "de.wikipedia.org",
    "commons.wikimedia.org",
];

@rxConnect(() => {
    const actions = {
        changeChannel$: new Rx.Subject(),
        pause$: new Rx.Subject(),
        resume$: new Rx.Subject(),
    };

    const channel$ = actions.changeChannel$
        .map(([ channel ]) => channel)
        .startWith(CHANNELS[0])
        .distinctUntilChanged();

    const active$ = Rx.Observable
        .merge(
            actions.pause$.map(() => false),
            actions.resume$.map(() => true),
        )
        .startWith(true)
        .shareReplay(1);

    const reactions$ = new Rx.Observable.merge(
        channel$.map(channel => ({ channel })),

        active$.map(active => ({ active })),

        channel$
            .flatMapLatest(channel =>
                Rx.Observable
                    .create(observer => {
                        const socket = io.connect("https://stream.wikimedia.org:443/rc", {"force new connection": true});

                        socket.on("connect", () => socket.emit("subscribe", channel));

                        socket.on("change", data => observer.onNext(data) );

                        return () => {
                            socket.removeAllListeners("connect");
                            socket.removeAllListeners("change");
                            socket.disconnect();
                            observer.onCompleted();
                        }
                    })
                    .pausable(active$)
                    .sample(200) // Use sampling, otherwise Wikipedia might provide a lot of data :)
                    .scan((acc, next) => [next, ...acc].slice(0, 20), []) // Last 20
                    .startWith(undefined)
            )
            .map(items => ({ items }))
    );

    return run(reactions$, actions);
})
class WikiStream extends React.PureComponent {

    render() {
        const { items, channel, active } = this.props;

        const { changeChannel, pause, resume } = this.props;

        return (
            <div className="ui main padded container">
                <div className="ui secondary menu">
                    <div className="ui item">
                        <select value={ channel } onChange={e => changeChannel(e.target.value)} className="ui dropdown">
                            { CHANNELS.map(channel => (
                                <option key={channel} value={channel}>{channel}</option>
                            )) }
                        </select>
                    </div>

                    <div className="ui item">
                        <button className="ui icon button" onClick={ active ? pause : resume }>
                            <i className={`${active ? "pause" : "play"} icon`}/>
                        </button>
                    </div>
                </div>

                { items ? (
                <table className="ui striped fixed compact single line table">
                    <thead>
                    <tr>
                        <th width="15%">User</th>
                        <th width="30%">Title</th>
                        <th width="45%">Comment</th>
                    </tr>
                    </thead>
                    <tbody>
                    {items.map(({ id, timestamp, user, title, comment }) => (
                        <tr key={id || timestamp}>
                            <td>{user}</td>
                            <td>{title}</td>
                            <td>{comment}</td>
                        </tr>
                    )) }
                    </tbody>
                </table>
                ) : (
                    <div className="ui loading basic segment" />
                ) }
            </div>
        )
    }
}

ReactDOM.render((
    <WikiStream />
), document.getElementById("root"));
