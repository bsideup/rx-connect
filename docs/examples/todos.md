# TODOs

TODO example - because modern JavaScript can't be imagined without a TODO example! :D

## The component
We will start with a component:
```javascript
class TodoList extends React.PureComponent {
    render() {
        const { todos, onCompleted } = this.props;
        return (
            <div>
                <label>
                    <input type="checkbox" onChange={ e => onCompleted(e.target.checked) } />
                    completed only
                </label>
                { todos ? (
                    <ul>
                        { todos.map(todo => <li key={todo.id}>{todo.title}</li>) }
                    </ul>
                ) : (
                    <p>Loading...</p>
                ) }
            </div>
        )
    }
}
```

This is a pure component, it doesn't know anything about the storage and it accepts an array of todos as `todos` property and `onCompleted` callback to filter completed-only entries.

## Redux
There are many reasons why you should consider using some Flux framework and we will not focus on them here, so we will just assume that our application is based on Flux architecture. We will use Redux for this example, but you might choose any other, RxConnect works with any React-based framework.

Naive Redux implementation might look like this:
```javascript
class TodoContainer extends React.Component {

    constructor(props) {
        super(props);
        
        this.state = {
            completed: false
        }
    }

    fetchData(props, completed) {
        if (this.cancelFetch) {
            this.cancelFetch();
        }

        this.cancelFetch = props.fetchData(props.userId, completed);
    }

    componentWillMount() {
        this.fetchData(this.props, state.completed);
    }

    componentWillUnmount() {
        if (this.cancelFetch) {
            this.cancelFetch();
        }
    }

    componentWillUpdate(nextProps, nextState) {
        if (this.props.userId !== nextProps.userId ||
            this.state.completed !== nextState.completed
        ) {
            this.fetchData(nextProps, nextState.completed);
        }
    }

    onCompleted = completed => this.setState({ completed });

    render() {
        return <TodoList todos={ this.props.todos } onCompleted={this.onCompleted} />
    }
}

export default connect(
    ({ userId, todos }) => ({ userId, todos }),
    { fetchData }
)
```
Unfortunately, this is pretty common code with React/Redux. Lets go over the weak points:
* `componentWillMount/componentWillUnmount` - we have to deal with the lifecycle and control the cancelation, otherwise once our component is unmounted we will encounter an error if we will receive data after it.
* `cancelFetch` is necessary because we should execute only one request at a time.
* `componentWillUpdate` contains comparison of properties/state and re-triggering of data fetching. People tend to forget to do it or to make a mistake in comparison, especially when there are many of properties to compare
* What if there will be many fetches?

## RxConnect to the rescue!
The same can be implemented with RxConnect, solving the issues listen above:
```javascript
export default connect(
    ({ userId }) => ({ userId }),
    { fetchData }
)(rxConnect(props$ => {
    const actions = {
        onCompleted$: new Rx.Subject()
    }

    const userId$ = props$.pluck("userId").distinctUntilChanged();

    const completed$ = actions.onCompleted$.pluck(0).startWith(false);

    const todos$ = Rx.Observable
            .combineLatest(userId$, completed$)
            .withLatestFrom(props$)
            .flatMapLatest(([[ userId, completed ], { fetchData }]) =>
                fetchData(userId, completed)
                    .startWith(undefined)
            );

    return Rx.Observable.merge(
        mapActionCreators(actions),

        todos$.map(todos => ({ todos }))
    );
})(TodoList))
```

[](codepen://bsideup/EgxVKX?height=500)
