import React from "react";
import { connect } from "react-redux";
import wrapActionCreators from "react-redux/lib/utils/wrapActionCreators";
import { Link } from "react-router";

import Time from "./Time";

import { logout } from "../actions/auth";

@connect(
    ({ user }) => ({ user }),
    wrapActionCreators({ logout })
)
export default class MainView extends React.PureComponent {

    render() {
        const { user, children } = this.props;

        const { logout } = this.props;

        return (
            <div>
                <div className="ui stackable menu">
                    <div className="ui container">
                        <div className="header item">
                            <img className="logo" src="//placehold.it/60/00B5AD" />&nbsp; RxConnect blog example
                        </div>
                        <Link to="/" className="item" activeClassName="active" onlyActiveOnIndex={ true }>Home</Link>

                        <div className="right menu">
                            <div className="ui simple borderless item">
                                <Time />
                            </div>
                            { user ? (
                                <div className="ui simple dropdown item">
                                    <img className="ui avatar image" src="//placehold.it/60/A78CD2" />
                                    { user.name }
                                    <i className="dropdown icon" />
                                    <div className="menu">
                                        <Link to={`/users/${user.id}`} className="item" activeClassName="active">Profile</Link>
                                        <a className="item" onClick={ logout }>Logout</a>
                                    </div>
                                </div>
                            ) : (
                                <Link to="/login" className="item">Login</Link>
                            ) }
                        </div>
                    </div>
                </div>

                <div className="ui main text container">
                    { children }
                </div>

                <div className="ui inverted vertical footer segment">
                    <div className="ui center aligned container">
                        <div className="item">© MySuperCorp</div>
                    </div>
                </div>
            </div>
        )
    }
}
