RxConnect
========
[![Gitter](https://badges.gitter.im/bsideup/rx-connect.svg)](https://gitter.im/bsideup/rx-connect)
[![NPM version](https://img.shields.io/npm/v/rx-connect.svg)](https://npmjs.com/package/rx-connect)
[![Build Status](https://travis-ci.org/bsideup/rx-connect.svg?branch=master)](https://travis-ci.org/bsideup/rx-connect)
[![license](https://img.shields.io/github/license/bsideup/rx-connect.svg?maxAge=2592000)]()

RxConnect is like [Redux](https://github.com/reactjs/redux)'s `@connect`, but with all the power of [RxJS](https://github.com/Reactive-Extensions/RxJS).

```
npm install --save rx-connect	
```

<!--remove-->
## Documentation
You can find the latest documentation here: http://bsideup.gitbooks.io/rxconnect/content/
<!--endremove-->

## Why?
Replace this:

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

with this:

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

> **NB:** We use decorators, but it's not required. These two code blocks are completely identical:
>
> ```javascript
> @rxConnect(...)
> export class MyView extends React.Component {
>     // ...
> }
> ```
>
> and
>
>  ```javascript
> class MyView extends React.Component {
>     // ...
> }
> export rxConnect(...)(MyView)
> ```

## Using RxJS 4?

This library supports RxJS 5 by default, but provides an adapter for RxJS 4:

```js
import { rx4Connect } from "rx-connect";
import rx4Adapter from "rx-connect/lib/rx4Adapter";
rx4Connect.adapter = rx4Adapter;
```
