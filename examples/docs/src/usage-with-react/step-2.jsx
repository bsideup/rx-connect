import React from "react";
import Rx from "rx";
import { rxConnect } from "rx-connect";

@rxConnect(Rx.Observable.of({
    articles: [
        {
            title: "Pure (programming Language)",
            url: "https://en.wikipedia.org/wiki/Pure_(programming_language)"
        },
        {
            title: "Reactive programming",
            url: "https://en.wikipedia.org/wiki/Reactive_programming"
        },
    ]
}))
export default class MyView extends React.PureComponent {
    render() {
        const { articles, search } = this.props;

        return (
            <div>
                <label>
                    Wiki search: <input type="text" onChange={ e => search && search(e.target.value) } />
                </label>

                { articles && (
                    <ul>
                        { articles.map(({ title, url }) => (
                            <li><a href={url}>{title}</a></li>
                        ) ) }
                    </ul>
                )  }
            </div>
        );
    }
}