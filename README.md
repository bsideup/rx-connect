RxConnect v{{ book.version }}
========

RxConnect is like [Redux](https://github.com/reactjs/redux)'s `@connect`, but with all the power of [RxJS](https://github.com/Reactive-Extensions/RxJS).

```
npm install --save rx-connect rx
```

## Why?
Replace this:

```javascript
@connect(
    state => ({
        userId: state.userId,
        todos: state.todos
    }),
    dispatch => bindActionCreators({ fetchData }, dispatch)
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
        onCompleted$: new Rx.Subject()
    }

    const userId$ = state$.pluck("userId").distinctUntilChanged();

    const completed$ = actions.onCompleted$.pluck(0).startWith(false);

    const todos$ = Rx.Observable
            .combineLatest(userId$, completed$)
            .flatMapLatest(([ userId, completed ]) =>
                dispatch(fetchData(userId, completed))
                    .startWith(undefined)
            );

    return Rx.Observable.merge(
        Rx.Observable::ofActions(actions),

        todos$.map(todos => ({ todos }))
    );
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

> **NB:** We use decorators from ES7, but it's not required. These two code blocks are completely identical:
> ```javascript
@rxConnect(...)
export class MyView extends React.Component {
    // ...
}
```
> and
> ```javascript
class MyView extends React.Component {
    // ...
}
export rxConnect(...)(MyView)
```
