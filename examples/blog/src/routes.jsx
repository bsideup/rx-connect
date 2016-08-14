import React from "react";
import { Route, IndexRoute, IndexRedirect } from 'react-router'

import LoginView from "./view/LoginView";
import MainView from "./view/MainView";
import PostsView from "./view/PostsView";
import PostView from "./view/PostView";
import UserView from "./view/UserView";

export default (
    <Route path="/">
        <Route path="login" component={ LoginView } />

        <Route component={ MainView }>
            <IndexRedirect to="posts" />

            <Route path="posts">
                <IndexRoute component={ PostsView } />
                <Route path=":postId" component={ PostView } />
            </Route>

            <Route path="users/:userId" component={ UserView } />

            <Route path="**" component={() => <h3>404 page not found</h3> } />
        </Route>
    </Route>
)
