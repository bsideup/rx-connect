import React from "react";
import Rx from "rxjs";
import { rxConnect, mapActionCreators } from "rx-connect";

function searchWikipedia(search) {
    return Rx.Observable
        .ajax({
            url: `https://en.wikipedia.org/w/api.php?action=opensearch&search=${search}&format=json&origin=*`,
            crossDomain: true,
            createXHR: () => new XMLHttpRequest()
        })
        .pluck("response")
        // Wikipedia has really weird response format o_O
        .map(([,titles,,urls]) => titles.map((title, i) => ({ title, url: urls[i] })))
}

@rxConnect(() => {
    const actions = {
        search$: new Rx.Subject()
    }

    const articles$ = actions.search$
        .debounceTime(500)
        .pluck(0) // select first passed argument
        .switchMap(search =>
            searchWikipedia(search)
                .startWith(undefined) // <-- clear articles before we receive the response
        )

    return Rx.Observable.merge(
        mapActionCreators(actions),

        articles$.map(articles => ({ articles }))
    )
})
export default class MyView extends React.PureComponent {
    render() {
        const { articles, search } = this.props;

        return (
            <div>
                <label>
                    Wiki search: <input type="text" onChange={ e => search(e.target.value) } />
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
