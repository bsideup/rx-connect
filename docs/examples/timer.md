# Timer

Implementing timer component in React - how hard can it be?

Lets implement it with React only:

```javascript
class Timer extends React.Component {

    constructor(props) {
        super(props);
        
        this.state = {
            counter: 0
        }
    }

    componentWillMount() {
        setInterval(
            () => this.setState(state => ({ counter: state.counter + 1 })),
            1000
        )
    }

    render() {
        return <div>{ this.state.counter }</div>
    }
}
```

Simple, right? But what will happen when we unmount the component? It will continue to execute `setState()` and will throw an exception!

So, we have to make sure that we clear the interval to avoid it:

```javascript
class Timer extends React.Component {

    constructor(props) {
        super(props);
        
        this.state = {
            counter: 0
        }
    }

    componentWillMount() {
        this.intervalRef = setInterval(
            () => this.setState(state => ({ counter: state.counter + 1 })),
            1000
        )
    }

    componentWillUnmount() {
        clearInterval(this.intervalRef)
    }

    render() {
        return <div>{ this.state.counter }</div>
    }
}
```

The problem is so popular, there is even a special library for that: https://github.com/reactjs/react-timer-mixin

### RxConnect way

The same can be implemented with one-liner in RxConnect:
```javascript
import { rxConnect } from "rx-connect";

@rxConnect(
    Rx.Observable.timer(0, 1000).timestamp()
)
class Timer extends React.PureComponent {
    render() {
        return <div>{ this.props.value }</div>
    }
}
```

or even:
```javascript
import { rxConnect } from "rx-connect";

const Timer = rxConnect(
    Rx.Observable.timer(0, 1000).timestamp()
)(({ value }) => <div>{ value }</div>)
```
<iframe src="https://codesandbox.io/embed/github/bsideup/rx-connect/tree/master/examples/docs?autoresize=1&hidenavigation=1&initialpath=timer%2Fstep-1&view=preview" style="width:100%; height:300px; border:0; overflow:hidden;" sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"></iframe>

#### Benefits:
* No need to handle subscription manually (error-prone!)
* Component is pure
* Code is simple and does one thing


#### Future reading:
* [Rx.Observable.timer](https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/operators/timer.md)
* [react-timer-mixin](https://github.com/reactjs/react-timer-mixin)
