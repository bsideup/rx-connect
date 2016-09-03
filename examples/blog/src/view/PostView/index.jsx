import React from "react";
import Rx from "rx";
import { Link } from "react-router";
import { rxConnect } from "rx-connect";

import { hashCode, toHex, capitalize } from "../../utils";

import { fetchPost, fetchComments } from "../../actions/posts";
import { fetchUser } from "../../actions/users";

import Comments from "./Comments";

@rxConnect((props$, state$, dispatch) => {
    const postId$ = props$.pluck("params", "postId").distinctUntilChanged();

    return postId$.flatMapLatest(postId => {
        const post$ = dispatch(fetchPost(postId))
            .flatMapLatest(post =>
                dispatch(fetchUser(post.userId))
                    .map(user => ({ ...post, user }))
            )
            .catch(Rx.Observable.of(null));

        const comments$ = dispatch(fetchComments(postId))
            .catch(Rx.Observable.of(null));

        // Fetch comments together with post's data to avoid flickering
        return Rx.Observable
            .combineLatest(post$, comments$)
            .startWith([])
            .map(([ post, comments ]) => ({ post, comments }));
    });
})
export default class PostView extends React.PureComponent {

    render() {
        const {
            post,
            comments
        } = this.props;

        if (post === undefined) {
            return <div className="ui loading basic segment" />;
        }

        const { title, body, user: { id: userId, name } = {} } = post || {};

        return (
            <div className="main stackable container">
                { post ? (
                    <div className="ui grid">
                        <div className="row">
                            <h1>{title::capitalize()}</h1>
                        </div>
                        { userId % 2 == 1 && (
                            <div className="centered row">
                                <img src={`//placehold.it/400x240/${title::hashCode()::toHex()}`} />
                            </div>
                        ) }
                        <div className="ui row">
                            <p>{body}</p>
                        </div>

                        <div className="ui row">
                            <h5>Written by <Link to={`/users/${userId}`}>{name}</Link> a few days ago.</h5>
                        </div>

                        { comments && (
                            <div className="ui row">
                                <Comments comments={ comments } />
                            </div>
                        ) }
                    </div>
                ) : (
                    <h3>Post not found</h3>
                )}
            </div>
        )
    }
}
