import React, { useState, useContext } from "react";
import { Button, Form } from "semantic-ui-react";
import { useMutation } from "@apollo/react-hooks";
import gql from "graphql-tag";

import { AuthContext } from "../context/auth";

import useForm from "../util/hooks/useForm";

const Login = props => {
	const context = useContext(AuthContext);

	const [errors, setErrors] = useState({});

	const initialState = {
		username: "",
		password: ""
	};

	const { onChange, onSubmit, values } = useForm(
		userLoginCallback,
		initialState
	);

	const [loginUser, { loading }] = useMutation(LOGIN_USER, {
		update(_, { data: { login: userData } }) {
			console.log(userData);

			context.login(userData);
			props.history.push("/");
		},
		onError(err) {
			setErrors(err.graphQLErrors[0].extensions.exception.errors);
		},
		variables: values
	});

	function userLoginCallback() {
		loginUser();
	}

	return (
		<div className="form-container">
			<Form onSubmit={onSubmit} noValidate className={loading ? "loading" : ""}>
				<h2 className="page-title">Login</h2>
				<Form.Input
					label="Username: "
					placeholder="Username..."
					name="username"
					value={values.username}
					error={errors.username ? true : false}
					onChange={onChange}
					type="text"
				/>
				<Form.Input
					label="Password: "
					placeholder="Password..."
					name="password"
					value={values.password}
					error={errors.password ? true : false}
					onChange={onChange}
					type="password"
				/>

				<Button type="submit" primary>
					Login
				</Button>
			</Form>
			{Object.keys(errors).length > 0 && (
				<div className="ui error message">
					<ul className="list">
						{Object.values(errors).map(value => (
							<li key={value}> {value}</li>
						))}
					</ul>
				</div>
			)}
		</div>
	);
};

const LOGIN_USER = gql`
	mutation login($username: String!, $password: String!) {
		login(username: $username, password: $password) {
			id
			email
			username
			createdAt
			token
			refreshToken
		}
	}
`;

export default Login;
