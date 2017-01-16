import "semantic-ui-css/semantic.css";
import "babel-polyfill";

import React from "react";
import ReactDOM from "react-dom";
import { rxConnect, ofActions } from "rx-connect";
import Rx from "rxjs";

import { ofWikiChanges } from "./wikiChangesObservable";

const CHANNELS = [
    "en.wikipedia.org",
    "ru.wikipedia.org",
    "de.wikipedia.org",
    "commons.wikimedia.org",
];

@rxConnect(function* () {
    const actions = {
        changeChannel$: new Rx.Subject(),
        pause$: new Rx.Subject(),
        resume$: new Rx.Subject(),
    };

    yield Rx.Observable::ofActions(actions);

    const channel$ = actions.changeChannel$
        .pluck(0)
        .startWith(CHANNELS[0])
        .distinctUntilChanged()
        .publishReplay(1)
        .refCount();

    yield channel$.map(channel => ({ channel }));

    const active$ = Rx.Observable
        .merge(
            actions.pause$.mapTo(false),
            actions.resume$.mapTo(true),
        )
        .startWith(true)
        .publishReplay(1)
        .refCount();

    yield active$.map(active => ({ active }));

    yield channel$
        .switchMap(channel =>
            Rx.Observable::ofWikiChanges(channel)
                .let(o => active$.switchMap(active => active ? o : Rx.Observable.never()))
                .sample(Rx.Observable.interval(200)) // Use sampling, otherwise Wikipedia might provide a lot of data :)
                .scan((acc, next) => [next, ...acc].slice(0, 20), []) // Last 20
                .startWith(undefined)
        )
        .map(items => ({ items }));
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
                    {items.map(({ id, timestamp, user, title, comment, server_url }) => (
                        <tr key={id || timestamp}>
                            <td>{user}</td>
                            <td><a href={`${server_url}/wiki/${title}`} target="_blank">{title}</a></td>
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
