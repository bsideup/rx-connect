# Usage with React

Handling user input efficiently can be challenging. We don't want to query our server while user is still typing, right? And, of course, we want to show only the latest searched result.

## The component

Imagine we have a component:
```javascript
class MyView extends React.PureComponent {
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
```

[](codepen://bsideup/PGoGmG?height=100)

As you can see, it expects two properties:
- **articles** - array of articles
- **search** - callback function, triggered by user input

This component is pure - it doesn't hold the state or perform any requests, but delegates it to the [Higher Order Component](https://medium.com/@franleplant/react-higher-order-components-in-depth-cf9032ee6c3e#.20pvr6tjf).

Remember this component - we will not change it anymore during this example :)

**Lesson learned: RxConnect works with your existing React components without any modifications.**

## Reactive component
Now is the time to connect our component with outer world:

```javascript
import { rxConnect, run } from "rx-connect";

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
class MyView extends React.PureComponent {
    // ...
}
```
[](codepen://bsideup/VKwKGv?height=150)

Here we mocked `articles` property with some static data, and we see it rendered! Yay!

**Lesson learned: function passed to `rxConnect` must return an Observable of component's properties.**

## Reactive interactive component
Cool, but... search? User still can not interact with the component we created. The requirements were:
* It should search on Wikipedia when user inputs a query
* It should discard the result of all previous queries if user types a new one

Thanks to RxJS we can do it easily:

```javascript
import { rxConnect, mapActionCreators } from "rx-connect";

function searchWikipedia(search) {
    return Rx.DOM
        .jsonpRequest(`https://en.wikipedia.org/w/api.php?action=opensearch&search=${search}&format=json&callback=JSONPCallback`)
        .pluck("response")
        // Wikipedia has really weird response format o_O
        .map(([,titles,,urls]) => titles.map((title, i) => ({ title, url: urls[i] })))
}

@rxConnect(() => {
    const actions = {
        search$: new Rx.Subject()
    }

    const articles$ = actions.search$
        .pluck(0) // select first passed argument
        .flatMapLatest(searchWikipedia)

    return Rx.Observable.merge(
        mapActionCreators(actions),

        articles$.map(articles => ({ articles }))
    )
})
class MyView extends React.PureComponent {
    // ...
}
```
> **Warning! Do not type too fast, or you'll hit Wikipedia's API requests limit**

[](codepen://bsideup/rrNrEo?height=500)

Nice! It works! We type and we see the results.

Lets review the code step-by-step:
```javascript
const actions = {
    search$: new Rx.Subject()
}
```
Here we create an object of actions (like user input). They are [Subjects](https://github.com/Reactive-Extensions/RxJS/blob/master/doc/gettingstarted/subjects.md). You can define as many actions as you want.

Did you spot that action's name ends with `$`? This is special notation in RxJS to mark the stream. RxConnect will trim it, and the component will receive it as `search`.

But actions themselves does nothing - we should react on them with reactions:
```javascript
const articles$ = actions.search$
    .pluck(0) // select first passed argument
    .flatMapLatest(searchWikipedia)
```

Right now we have only one reaction - on search, but there might be many of them, this is why we merge all of them in a single stream together with actions:
```javascript
return Rx.Observable.merge(
    mapActionCreators(actions),

    articles$.map(articles => ({ articles }))
)
```

> **NB:**
> ```javascript
.map(articles => ({ articles }))
```
> is the same as
> ```javascript
.map(articles => {
    return {
        articles: articles
    }
})
```

Our search reaction returns an array of articles as `articles` property for each new search.

## Reactive interactive component with API limitations in mind
Currently we query API each time user enters something to the field. It means that if user will type very fast he will send too many requests to the server.

User types "re" - request is sent. He types "rea" - request is sent. He types "react"... Request is sent! But what user really wants is to get the result for "react" search only. In fact, we should send a request only when user finishes typing. And this situation is exactly why we choose RxJS to connect our components - because it's designed to handle such cases.

Slightly modify your reaction with one more operator:
```javascript
actions.search$
    .debounceTime(500) // <-- RxJS FTW!
    .pluck(0)
    .switchMap(searchWikipedia)
```
[](codepen://bsideup/gwOLdK?height=500)

Now user can type as fast as he wants - RxJS will call API only after user finishes typing.

**Lesson learned: Learn RxJS - it's awesome:)**

## Reactive interactive component with API limitations in mind and attention to detail
Type something to the search field. Now, once you see the results, type something else. Old results are present until new results received. This is bad user experience, but we can fix it!

Remember I said that we combine streams of data, so your component is reactive? Thanks to it, cleaning of previous results is as simple as pushing undefined object once we send a search request:

```javascript
actions.search$
    .debounceTime(500)
    .pluck(0)
    .switchMap(search =>
        searchWikipedia(search)
            .startWith(undefined) // <-- clear articles before we receive the response
    )
```
[](codepen://bsideup/mAbaom?height=500)
