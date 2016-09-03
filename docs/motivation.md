# Motivation
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

What does it mean? The component is unpredictable. "Unpre... WAT?" - you might ask. And the answer is simple: you can't control your component with the properties you pass to it.

**Unit testing is complicated as well!** You have to type to the text field ( *prepare the state* ) to verify button click.

## RxConnect way
RxConnect allows you to keep your component pure without having to deal with Redux's global state:
```javascript
import { rxConnect, ofActions } from "rx-connect";
import Rx from "rx";

@rxConnect(() => {
    const actions = {
        onUserName$: new Rx.Subject(),
    }

    return Rx.Observable.merge(
        Rx.Observable::ofActions(actions),

        actions.onUserName$.startWith("").map(name => ({ name }))
    )
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

Now our component not only pure, but [reactive](https://en.wikipedia.org/wiki/Reactive_programming) as well!
