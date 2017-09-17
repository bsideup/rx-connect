import React from "react";

export default class MyView extends React.PureComponent {
    render() {
        const { articles, search } = this.props;

        return (
            <div>
                <label>
                    Wiki search: <input type="text" onChange={ e => search && search(e.target.value) } />
                </label>

                { articles && (
                    <ul>
                        { articles.map(({ title, url }) => (
                            <li><a href={url}>{title}</a></li>
                        ) ) }
                    </ul>
                )  }
            </div>
        );
    }
}