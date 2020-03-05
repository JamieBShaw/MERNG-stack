import React from "react";

import { Form, Button } from "semantic-ui-react";
import { useMutation } from "@apollo/react-hooks";

import useForm from "../util/hooks/useForm";
import gql from "graphql-tag";
import { FETCH_POSTS_QUERY } from "../util/graphQL/getPosts";

const PostForm = () => {
	const { onSubmit, onChange, values } = useForm(postCallBack, { body: "" });

	const [createPost, { error }] = useMutation(CREATE_POST, {
		variables: values,
		update(proxy, result) {
			try {
				const data = proxy.readQuery({
					query: FETCH_POSTS_QUERY
				});

				// data object is immutable make a copy by using spread operator and adding new data to it that way

				const newData = [result.data.createPost, ...data.getPosts];

				proxy.writeQuery({
					query: FETCH_POSTS_QUERY,
					data: { getPosts: newData }
				});
				values.body = "";
			} catch (err) {
				console.log(err);
			}
		}
	});

	function postCallBack() {
		createPost();
	}

	return (
		<Form onSubmit={onSubmit}>
			<h2> Create a Post </h2>

			<Form.Field>
				<Form.Input
					placeholder="Write your post here..."
					onChange={onChange}
					name="body"
					type="text"
					values={values.body}
				/>
				<Button type="submit" color="teal">
					Post
				</Button>
			</Form.Field>
		</Form>
	);
};

const CREATE_POST = gql`
	mutation createPost($body: String!) {
		createPost(body: $body) {
			id
			body
			createdAt
			username
			likes {
				id
				username
				createdAt
			}
			likeCount
			comments {
				id
				body
				username
				createdAt
			}
			commentCount
		}
	}
`;

export default PostForm;
