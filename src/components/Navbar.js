import React from "react";
import { AuthConsumer } from "./AuthContext";

export default function Navbar() {
	return (
		<div>
			<header className="nav-container">
				<AuthConsumer>
					{({ user, logOut }) => (
						<React.Fragment>
							<a href={user.id ? `/${user.id}/boards` : `/`}>
								<p>Prototype</p>
							</a>
							{user.id ? (
								<React.Fragment>
									<small>user: {user.email}</small>
									<button onClick={(e) => logOut(e)}>Log Out</button>
								</React.Fragment>
							) : (
								<small>Please sign in</small>
							)}
						</React.Fragment>
					)}
				</AuthConsumer>
			</header>
		</div>
	);
}
