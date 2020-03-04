import React, { useState, useContext } from "react";
import { Button, Form } from "semantic-ui-react";
import { useMutation } from "@apollo/react-hooks";
import gql from "graphql-tag";
import { AuthContext } from "../context/auth";

import useForm from "../util/useForm";

const Register = props => {
	const context = useContext(AuthContext);

	const [errors, setErrors] = useState({});

	const initialState = {
		username: "",
		email: "",
		password: "",
		confirmPassword: ""
	};

	const { onChange, onSubmit, values } = useForm(registerUser, initialState);

	const [addUser, { loading }] = useMutation(REGISTER_USER, {
		update(_, { data: { register: userData } }) {
			context.login(userData);
			props.history.push("/");
		},
		onError(err) {
			setErrors(err.graphQLErrors[0].extensions.exception.errors);
		},
		variables: values
	});

	function registerUser() {
		addUser();
	}

	return (
		<div className="form-container">
			<Form onSubmit={onSubmit} noValidate className={loading ? "loading" : ""}>
				<h2 className="page-title">Register here!</h2>
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
					label="Email: "
					placeholder="Email..."
					name="email"
					value={values.email}
					error={errors.email ? true : false}
					onChange={onChange}
					type="email"
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
				<Form.Input
					label="Confirm Password: "
					placeholder="Confirm Password"
					name="confirmPassword"
					value={values.confirmPassword}
					error={errors.confirmPassword ? true : false}
					onChange={onChange}
					type="password"
				/>
				<Button type="submit" primary>
					Register
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

const REGISTER_USER = gql`
	mutation register(
		$username: String!
		$email: String!
		$password: String!
		$confirmPassword: String!
	) {
		register(
			registerInput: {
				username: $username
				email: $email
				password: $password
				confirmPassword: $confirmPassword
			}
		) {
			id
			email
			username
			createdAt
			token
		}
	}
`;

export default Register;
