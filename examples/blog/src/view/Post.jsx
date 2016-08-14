import React from "react";
import { Link } from "react-router";

import { hashCode, toHex, capitalize } from "../utils";

export default class Post extends React.PureComponent {
    render() {
        const {
            post: { id, title, description, user: { id: userId, name } }
        } = this.props;

        return (
            <article className="ui stackable grid">
                <div className="sixteen wide column">
                    <h3><Link to={`/posts/${id}`}>{title::capitalize()}</Link></h3>
                    <h6>Written by <Link to={`/users/${userId}`}>{name}</Link> a few days ago.</h6>
                </div>
                <div className="twelve wide column">
                    <p>{description}</p>
                </div>
                { userId % 2 == 1 && (
                    <div className="four wide column">
                        <img src={`//placehold.it/200x120/${title::hashCode()::toHex()}`} />
                    </div>
                ) }
                <div className="ui section sixteen wide column divider" />
            </article>
        )
    }
}
