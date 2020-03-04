import React, { useState } from "react";
import { Button, Form } from "semantic-ui-react";
import { useMutation } from "@apollo/react-hooks";
import gql from "graphql-tag";

const Register = () => {
	const [values, setValues] = useState({
		username: "",
		email: "",
		password: "",
		confirmPassword: ""
	});

	const onChange = e => {
		setValues({
			...values,
			[e.target.name]: e.target.value
		});
	};

	const [addUser, { loading }] = useMutation(REGISTER_USER, {
		update(proxy, result) {
			console.log(result);
		},
		variables: values
	});

	const onFormSubmit = event => {
		event.preventDefault();
		addUser();
	};

	return (
		<div className="form-container">
			<Form onSubmit={onFormSubmit} noValidate>
				<h2 className="page-title">Register here!</h2>
				<Form.Input
					label="Username: "
					placeholder="Username..."
					name="username"
					value={values.username}
					onChange={onChange}
					type="text"
				/>
				<Form.Input
					label="Email: "
					placeholder="Email..."
					name="email"
					value={values.email}
					onChange={onChange}
					type="email"
				/>
				<Form.Input
					label="Password: "
					placeholder="Password..."
					name="password"
					value={values.password}
					onChange={onChange}
					type="password"
				/>
				<Form.Input
					label="Confirm Password: "
					placeholder="Confirm Password"
					name="confirmPassword"
					value={values.confirmPassword}
					onChange={onChange}
					type="password"
				/>
			</Form>
			<Button type="submit" primary>
				Register
			</Button>
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
