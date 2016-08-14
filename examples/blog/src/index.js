import "./style.css";
import "rx-dom";

import React from "react";
import ReactDOM from "react-dom";
import { createStore, compose, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import { Router, useRouterHistory } from 'react-router';
import { routerMiddleware } from 'react-router-redux';
import createHashHistory from 'history/lib/createHashHistory';
import createLogger from 'redux-logger';
import thunk from "redux-thunk";

import routes from "./routes";
import reducers from "./reducers";

const services = {};

const history = useRouterHistory(createHashHistory)({ queryKey: false });

const middlewares = [
    applyMiddleware(
        thunk.withExtraArgument(services),
        routerMiddleware(history),
    ),
];

if (process.env.NODE_ENV !== "production") {
    middlewares.push(
        applyMiddleware(createLogger({
            duration: true,
            collapsed: true,
        })),
        window.devToolsExtension ? window.devToolsExtension() : f => f
    )
}

const store = createStore(
    reducers,
    compose(...middlewares)
);

ReactDOM.render((
    <Provider store={ store }>
        <Router history={ history }>
            { routes }
        </Router>
    </Provider>
), document.body); // Don't mount on body, m'kay?
