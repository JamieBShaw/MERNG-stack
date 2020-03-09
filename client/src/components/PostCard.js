import React, { useContext } from "react";
import { Card, Image, Button, Icon, Popup } from "semantic-ui-react";
import { Link } from "react-router-dom";
import moment from "moment";

import { AuthContext } from "../context/auth";

import DeleteButton from "./DeleteButton";
import LikeButton from "./LikeButton";
// co

const PostCard = props => {
	const { user } = useContext(AuthContext);

	// Destructuring props and post objects to get data points of our post
	const {
		body,
		createdAt,
		id,
		username,
		likeCount,
		commentCount,
		likes
	} = props.post;

	return (
		<Card fluid>
			<Card.Content>
				<Image
					floated="right"
					size="mini"
					src="https://react.semantic-ui.com/images/avatar/large/molly.png"
				/>
				<Card.Header>{username}</Card.Header>
				<Card.Meta as={Link} to={`/posts/${id}`}>
					{moment(createdAt).fromNow()}
				</Card.Meta>
				<Card.Description>{body}</Card.Description>
			</Card.Content>
			<Card.Content extra>
				<LikeButton user={user} post={{ id, likeCount, likes }} />
				<Popup
					content="Comment on Post"
					trigger={
						<Button
							toggle
							active
							as={Link}
							to={`/posts/${id}`}
							color="blue"
							basic>
							<Icon name={commentCount >= 3 ? "comments" : "comment"} />
							{commentCount}
						</Button>
					}
				/>
				{user && user.username === username && <DeleteButton postId={id} />}
			</Card.Content>
		</Card>
	);
};

export default PostCard;
