import React from "react";

import hashCode from "../../utils/hashCode";
import toHex from "../../utils/toHex";

export default class Comments extends React.PureComponent {

    render() {
        const { comments } = this.props;

        return (
            <div className="ui comments">
                <h3 className="ui dividing header">Comments</h3>

                { comments.map(({ id, email, body }) => (
                    <div key={ id } className="comment">
                        <a className="avatar">
                            <img src={`//placehold.it/100x100/${ email::hashCode()::toHex() }`} />
                        </a>
                        <div className="content">
                            <a className="author">{ email }</a>
                            <div className="metadata">
                                <div className="date">2 days ago</div>
                            </div>
                            <div className="text">{ body }</div>
                        </div>
                    </div>
                )) }
            </div>
        )
    }
}
