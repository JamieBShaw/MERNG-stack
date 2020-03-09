import React, { createContext } from "react";
import * as actionTypes from "./actionTypes";
import { useReducer } from "react";
import jwtDecoder from "jwt-decode";

const initalState = {
	user: null
};

if (localStorage.getItem("token") || localStorage.getItem("refreshToken")) {
	const decodedToken = jwtDecoder(localStorage.getItem("token"));

	if (decodedToken.exp * 1000 < Date.now()) {
		localStorage.removeItem("token");
	} else {
		initalState.user = decodedToken;
	}
}

const AuthContext = createContext({
	user: null,
	login: userData => {},
	logout: () => {}
});

const authReducer = (state, action) => {
	switch (action.type) {
		case actionTypes.LOGIN:
			return {
				...state,
				user: action.payload
			};
		case actionTypes.LOGOUT:
			return {
				...state,
				user: null
			};
		default:
			return state;
	}
};

const AuthProvider = props => {
	const [state, dispatch] = useReducer(authReducer, initalState);

	const login = userData => {
		localStorage.setItem("token", userData.token);
		localStorage.setItem("refreshToken", userData.refreshToken);

		dispatch({
			type: actionTypes.LOGIN,
			payload: userData
		});
	};

	const logout = () => {
		localStorage.removeItem("token");
		localStorage.removeItem("refreshToken");
		dispatch({
			type: actionTypes.LOGOUT
		});
	};

	return (
		<AuthContext.Provider
			value={{
				user: state.user,
				login,
				logout
			}}
			{...props}>
			{props.children}
		</AuthContext.Provider>
	);
};

export { AuthProvider, AuthContext };
