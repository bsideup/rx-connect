import React from "react";
import Rx from "rx";
import { rxConnect } from "rx-connect";
import { Link } from "react-router";

import { keyBy } from "../utils";

import { fetchPosts } from "../actions/posts";
import { fetchUsers } from "../actions/users";

import Post from "./Post";

@rxConnect((props$, state$, dispatch) => {
    const page$ = props$.pluck("location", "query", "page").map(page => page ? Number(page) : 1).distinctUntilChanged().shareReplay(1);

    const posts$ = page$.flatMapLatest(page =>
        dispatch(fetchPosts({ page: page - 1 }))
            .startWith(undefined)
    );

    const users$ = dispatch(fetchUsers())
        .map(users => users::keyBy("id"));

    return Rx.Observable.merge(
        page$.map(page => ({ page })),

        posts$.withLatestFrom(users$, (posts, users) => ({
            totalPages: posts && posts.total,
            posts: posts && posts.data.map(post => ({ ...post, user: users[post.userId] }))
        }))
    );
})
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
