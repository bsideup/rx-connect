RxConnect v{{ book.version }}
========

RxConnect is like [Redux](https://github.com/reactjs/redux)'s `@connect`, but with all the power of [RxJS](https://github.com/Reactive-Extensions/RxJS).

```
npm install --save rx-connect rx
```

## Motivation
Replace this:

```javascript
@connect(
    state => ({
        userId: state.userId,
        todos: state.todos
    }),
    dispatch = bindActionCreators({ fetchData }, dispatch)
)
class TodoContainer extends React.Component {

    state = {
        completed: false
    };

    cancelFetch = undefined;

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

    onCompleted(completed) {
        this.setState({ completed });
    }

    render() {
        return <TodoList todos={ this.props.todos } onCompleted={::this.onCompleted} />
    }
}

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

with this:

```javascript
@rxConnect((props$, state$, dispatch) => {
    const actions = {
        onCompleted$: new Rx.Subject(),
    }

    const reactions$ = Rx.Observable
        .combineLatest(
            state$.pluck("userId").distinctUntilChanged(),
            actions.onCompleted$
                .map(([ completed ]) => completed)
                .startWith(false)
        )
        .flatMapLatest(([ userId, completed ]) =>
            dispatch(fetchData(userId, completed)).startWith(undefined)
        )
        .map(todos => ({ todos }))

    return run(reactions$, actions);
})
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
[](codepen://bsideup/EgxVKX?height=500)
