import React from "react";
import { useQuery } from "@apollo/react-hooks";
import gql from "graphql-tag";
import { Grid } from "semantic-ui-react";
import PostCard from "../components/PostCard";

const FETCH_POST_QUERY = gql`
	{
		getPosts {
			id
			body
			createdAt
			username
			likeCount
			likes {
				username
			}
			commentCount
			comments {
				id
				username
				createdAt
				body
			}
		}
	}
`;

const Home = () => {
	const { loading, data: { getPosts: posts } = {} } = useQuery(
		FETCH_POST_QUERY
	);

	return (
		<Grid columns={3} divided>
			<Grid.Row className="page-title">
				<h1>Recent Posts</h1>
			</Grid.Row>
			<Grid.Row>
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
