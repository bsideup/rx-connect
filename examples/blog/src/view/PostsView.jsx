import React from "react";
import { rxConnect } from "rx-connect";
import { Link } from "react-router";

import { keyBy } from "../utils";

import { fetchPosts } from "../actions/posts";
import { fetchUsers } from "../actions/users";

import Post from "./Post";

@rxConnect((props$, state$, dispatch) => props$.map(({ location: { query: { page } } }) => page ? Number(page) : 1).distinctUntilChanged().flatMapLatest(page => {
    return Rx.Observable
        .combineLatest(
            dispatch(fetchPosts({ page: page - 1 })),
            dispatch(fetchUsers()).map(users => users::keyBy("id"))
        )
        .map(([ posts, users ]) => ({
            totalPages: posts.total,
            posts: posts.data
                .map(post => ({
                    ...post,
                    user: users[post.userId]
                }))
        }))
        .startWith({})
        .map(props => ({ ...props, page }));
}))
export default class PostsView extends React.PureComponent {

    render() {
        const { posts, totalPages, page } = this.props;

        if (!posts) {
            return <div className="ui loading basic segment" />;
        }

        return (
            <div className="ui grid">
                <div className="row">
                    <h1>Latest posts</h1>
                </div>

                { posts.map((post) => <Post key={ post.id } post={ post } />) }

                <div className="centered row">
                    <div className="ui pagination menu">
                        { [...Array(totalPages)].map((value, i) => i + 1).map(i => (
                            <Link key={i} to={`/posts?page=${i}`} className={ `${ i === page ? "active" : "" } item`}>{i}</Link>
                        ))}
                    </div>
                </div>
            </div>
        )
    }
}
