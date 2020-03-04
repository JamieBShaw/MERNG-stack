import React, { useState, useContext } from "react";
import { Menu } from "semantic-ui-react";
import { Link } from "react-router-dom";

import { AuthContext } from "../context/auth";

const MenuBar = () => {
	const pathname = window.location.pathname;

	const { user, logout } = useContext(AuthContext);

	const path = pathname === "/" ? "home" : pathname.substr(1);
	const [activeItem, setActiveItem] = useState(path);

	const handleItemClick = (e, { name }) => setActiveItem(name);

	return (
		<Menu pointing secondary size="massive" color="teal">
			<Menu.Item
				name={!user ? "home" : user.username}
				active={!user ? activeItem === "home" : true}
				onClick={handleItemClick}
				as={Link}
				to="/"
			/>
			<Menu.Menu position="right">
				<Menu.Item
					name={user ? "logout" : "login"}
					active={user ? activeItem === "logout" : activeItem === "login"}
					onClick={user ? logout : handleItemClick}
					as={Link}
					to={user ? "/" : "/login"}
				/>

				{!user ? (
					<Menu.Item
						name="register"
						active={activeItem === "register"}
						onClick={handleItemClick}
						as={Link}
						to="/register"
					/>
				) : null}
			</Menu.Menu>
		</Menu>
	);
};

export default MenuBar;
