import React, { useContext, useState, useRef } from "react";
import gql from "graphql-tag";
import { useQuery, useMutation } from "@apollo/react-hooks";
import moment from "moment";
import { AuthContext } from "../context/auth";
import LikeButton from "../components/LikeButton";
import {
	Button,
	Card,
	Form,
	Grid,
	Image,
	Icon,
	Label
} from "semantic-ui-react";
import DeleteButton from "../components/DeleteButton";

const SinglePost = props => {
	const postId = props.match.params.postId;

	const { user } = useContext(AuthContext);

	const [comment, setComment] = useState("");

	const commentInputRef = useRef(null);

	const { data: { getPost } = {} } = useQuery(FETCH_POST_QUERY, {
		variables: {
			postId
		}
	});

	const [createComment] = useMutation(CREATE_COMMENT, {
		update() {
			setComment("");
			commentInputRef.current.blur();
		},
		variables: { postId, body: comment }
	});

	const deleteCallback = () => {
		props.history.push("/");
	};

	let postMarkup;

	if (!getPost) {
		postMarkup = <p> loading </p>;
	} else {
		const {
			id,
			body,
			createdAt,
			username,
			comments,
			likes,
			likeCount,
			commentCount
		} = getPost;

		postMarkup = (
			<Grid>
				<Grid.Row>
					<Grid.Column width={2}>
						<Image
							src="https://react.semantic-ui.com/images/avatar/large/molly.png"
							size="small"
							float="right"
						/>
					</Grid.Column>
					<Grid.Column width={10}>
						<Card fluid>
							<Card.Content>
								<Card.Header>{username}</Card.Header>
								<Card.Meta>{moment(createdAt).fromNow()}</Card.Meta>
								<Card.Description>{body}</Card.Description>
							</Card.Content>
							<hr />
							<Card.Content extra>
								<LikeButton user={user} post={{ id, likeCount, likes }} />
								<Button
									as="div"
									labelPosition="right"
									onClick={() => console.log("Comment on Post")}>
									<Button basic color="blue">
										<Icon name="comments" />
									</Button>
									<Label basic color="blue" pointing="left">
										{commentCount}
									</Label>
								</Button>
								{user && user.username === username && (
									<DeleteButton postId={id} callback={deleteCallback} />
								)}
							</Card.Content>
						</Card>
						{user && (
							<Card fluid>
								<Card.Content>
									<p> Post a comment </p>
									<Form>
										<div className="ui action input fluid">
											<input
												type="text"
												placeholder="Comment here..."
												name="comment"
												value={comment}
												onChange={e => setComment(e.target.value)}
											/>
											<button
												className="ui button teal"
												type="submit"
												disabled={comment.trim() === ""}
												onClick={createComment}
												ref={commentInputRef}>
												Post
											</button>
										</div>
									</Form>
								</Card.Content>
							</Card>
						)}
						{comments.map(comment => {
							return (
								<Card fluid key={comment.id}>
									<Card.Content>
										{user && user.username === comment.username && (
											<DeleteButton postId={id} commentId={comment.id} />
										)}
										<Card.Header>{comment.username}</Card.Header>
										<Card.Meta>{moment(comment.createdAt).fromNow()}</Card.Meta>
										<Card.Description> {comment.body}</Card.Description>
									</Card.Content>
								</Card>
							);
						})}
					</Grid.Column>
				</Grid.Row>
			</Grid>
		);
	}
	return postMarkup;
};

const CREATE_COMMENT = gql`
	mutation createComment($postId: ID!, $body: String!) {
		createComment(postId: $postId, body: $body) {
			id
			comments {
				id
				body
				createdAt
				username
			}
			commentCount
		}
	}
`;

const FETCH_POST_QUERY = gql`
	query($postId: ID!) {
		getPost(postId: $postId) {
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

export default SinglePost;
