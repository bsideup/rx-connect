import React from "react";
import Rx from "rx";
import { rxConnect, ofActions } from "rx-connect";
import { push } from "react-router-redux";

import { login } from "../actions/auth";

@rxConnect((props$, state$, dispatch) => {
    const actions = {
        login$: new Rx.Subject()
    };

    return Rx.Observable.merge(
        Rx.Observable::ofActions(actions),

        actions.login$
            .flatMapLatest(([ email, password ]) =>
                dispatch(login(email, password))
                    .map(undefined) // No error in case of success
                    .doOnNext(() => dispatch(push("/"))) // TODO use side-effect library
                    .catch(error => Rx.Observable.of(error))
                    .map(error => ({ loading: false, error }))
                    .startWith(({ loading: true, error: undefined })) // Show preloader and clean an error before login's response
            )
    );
})
export default class LoginView extends React.PureComponent {

    emailField = undefined;

    passwordField = undefined;

    render() {
        const { loading, error } = this.props;

        const { login } = this.props;

        return (
            <div className={`login ui middle aligned center aligned ${error ? "error" : ""} grid`}>
                <div className="column">
                    <h2 className="ui teal image header">
                        <img src="//placehold.it/60/00B5AD" className="image" />
                        <div className="content">
                            Log-in to your account
                        </div>
                    </h2>
                    <form className={`ui huge ${ error ? "error" : "" } ${ loading ? "loading" : "" } form`}
                          onSubmit={ e => {
                              e.preventDefault();

                              login(this.emailField.value, this.passwordField.value);
                          }}
                    >
                        <div className="ui stacked segment">
                            <div className="field">
                                <div className="ui left icon input">
                                    <i className="user icon" />
                                    <input ref={ it => this.emailField = it } type="text" name="email" placeholder="E-mail address" />
                                </div>
                            </div>
                            <div className="field">
                                <div className="ui left icon input">
                                    <i className="lock icon" />
                                    <input ref={ it => this.passwordField = it } type="password" name="password" placeholder="Password" />
                                </div>
                            </div>
                            <input type="submit" className="ui fluid large teal submit button" value="Login" />
                        </div>

                        { error && <div className="ui error message">{error}</div> }
                    </form>
                </div>
            </div>
        )
    }
}
