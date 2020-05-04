import React, { Component } from "react";
import { AuthConsumer } from "./AuthContext";

class UserForm extends Component {
	emailInput = React.createRef();
	passwordInput = React.createRef();

	redirect = (userId) => {
		this.props.history.push(`/${userId}/boards`);
	};

	render() {
		return (
			<AuthConsumer>
				{({ signUp, logIn, user, authMessage }) => (
					<React.Fragment>
						{!user.id ? (
							<div className="sign-up-wrapper">
								<h2>Sign in or create account</h2>
								{authMessage ? <span>{authMessage}</span> : ""}
								<form className="sign-up-form">
									<div>
										<input
											ref={this.emailInput}
											type="email"
											name="email"
											placeholder="Email"></input>
									</div>
									<div>
										<input
											ref={this.passwordInput}
											type="password"
											name="password"
											placeholder="Password"></input>
									</div>
									<div>
										<button
											onClick={(e) =>
												logIn(
													this.emailInput.current.value,
													this.passwordInput.current.value,
													e
												)
											}>
											Log in
										</button>
										<button
											onClick={(e) =>
												signUp(
													this.emailInput.current.value,
													this.passwordInput.current.value,
													e
												)
											}>
											Sign Up
										</button>
									</div>
								</form>
							</div>
						) : (
							<button onClick={() => this.redirect(user.id)}>
								Go to my boards
							</button>
						)}
					</React.Fragment>
				)}
			</AuthConsumer>
		);
	}
}

export default UserForm;
