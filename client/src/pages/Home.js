import React, { useContext } from "react";
import { useQuery } from "@apollo/react-hooks";
import { Grid } from "semantic-ui-react";
import PostCard from "../components/PostCard";

import PostForm from "../components/PostForm";

import { AuthContext } from "../context/auth";

import { FETCH_POSTS_QUERY } from "../util/graphQL/getPosts";

const Home = () => {
	const { user } = useContext(AuthContext);

	const { loading, data: { getPosts: posts } = {} } = useQuery(
		FETCH_POSTS_QUERY
	);

	return (
		<Grid columns={3} divided>
			<Grid.Row className="page-title">
				<h1>Recent Posts</h1>
			</Grid.Row>
			<Grid.Row>
				{user && (
					<Grid.Column>
						<PostForm />
					</Grid.Column>
				)}

				{loading ? (
					<h2> loading posts.....</h2>
				) : (
					posts &&
					posts.map(post => (
						<Grid.Column key={post.id} style={{ marginBottom: 20 }}>
							<PostCard post={post} />
						</Grid.Column>
					))
				)}
			</Grid.Row>
		</Grid>
	);
};

export default Home;
