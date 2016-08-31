RxConnect
========

RxConnect is like [Redux](https://github.com/reactjs/redux)'s `@connect`, but with all the power of [RxJS](https://github.com/Reactive-Extensions/RxJS).

```
npm install --save rx-connect rx
```

## Motivation
Managing state in React applications is challenging, so people use predictable state containers like Redux. But sometimes storing tiny bits of your state (like input values, pressed checkboxes, etc) is overkill, so people use React's component state. Consider the example:

```javascript
class MyView extends React.Component {
    state = {
        name: ""
    }

    render() {
        const { name } = this.state;
        return (
            <div>
                <input type="text"
                       value={ name }
                       onChange={ e => this.setState({ name: e.target.value }) }
                       />

                <input type="button"
                       value="Say hello"
                       onClick={ () => console.log(`Hello, ${name}!`) }
                       />
            </div>
        );
    }
}
```

What's wrong with it? Nothing! But... This component is not [Pure](https://en.wikipedia.org/wiki/Purely_functional_data_structure). It's stateful.

What does it change? It makes the component unpredictable. "Unpre... WAT?" - you might ask. And the answer is simple: you can't control your component with the properties you pass to it.

**Unit testing becomes complicated as well!** Now you have to type to the text field ( *prepare the state* ) to verify button click.

One can say "Move `name` to the global Redux state and `@connect` it". Sure, you can do that. But you'll have to create a reducer, action, actionCreator, and perform the full Redux cycle just to update field's value in a pure way:

```javascript
// ducks/userName.js
const ON_USER_NAME = "onUserName";

export function onUserName(name) {
    return {
        type: ON_USER_NAME,
        name
    }
}

export default function (state = "", action) {
    switch (action.type) {
        case ON_USER_NAME:
            return action.name;
        default:
            return state;
    }
}
```

```javascript
// MyView.jsx
import { onUserName } from "./ducks/userName.js";

@connect(
    state => ({
        name: state.userName
    }),
    dispatch => bindActionCreators({ onUserName }, dispatch)
)
class MyView extends React.PureComponent {
    render() {
        const { name, onUserName } = this.props;

        return (
            <div>
                <input type="text"
                       value={ name }
                       onChange={ e => onUserName(e.target.value) }
                       />

                <input type="button"
                       value="Say hello"
                       onClick={ () => console.log(`Hello, ${name}!`) }
                       />
            </div>
        );
    }
}
```

Now our component is pure, but... Overkill, isn't it?

## RxConnect way
RxConnect allows you to keep your component pure without having to deal with global Redux's state:
```javascript
import { rxConnect, run } from "rx-connect";
import Rx from "rx";

@rxConnect(() => {
    const actions = {
        onUserName$: new Rx.Subject(),
    }

    const reactions$ = Rx.Observable.merge(
        actions.onUserName$.startWith("").map(name => ({ name }))
    )

    return run(reactions$, actions);
})
class MyView extends React.PureComponent {
    render() {
        const { name, onUserName } = this.props;

        return (
            <div>
                <input type="text"
                       value={ name }
                       onChange={ e => onUserName(e.target.value) }
                       />

                <input type="button"
                       value="Say hello"
                       onClick={ () => console.log(`Hello, ${name}!`) }
                       />
            </div>
        );
    }
}
```
[](codepen://bsideup/mAbaom?height=400&theme=0)

Now our component not only pure, but [reactive](https://en.wikipedia.org/wiki/Reactive_programming) as well!
