module.exports.validateRegisterInput = (
	username,
	email,
	password,
	confirmPassword
) => {
	let errors = {};

	if (!email || email.trim() === "") {
		errors.email = "Email address is required";
	} else {
		const regEx = /^([0-9a-zA-Z]([-.\w]*[0-9a-zA-Z])*@([0-9a-zA-Z][-\w]*[0-9a-zA-Z]\.)+[a-zA-Z]{2,9})$/;
		if (!email.match(regEx)) {
			errors.email = "Email is not valid";
		}
	}
	if (!username || username.trim() === "") {
		errors.username = "Username is required";
	}
	if (!password || password.length < 8) {
		errors.password = "Password must be at least 8 characters";
	} else if (password !== confirmPassword) {
		errors.confirmPassword = "Password does not match";
	}

	return {
		errors,
		valid: Object.keys(errors).length < 1
	};
};

module.exports.validateLoginInput = (username, password) => {
	let errors = {};

	if (!username || username.trim() === "") {
		errors.username = "Username is incorrect";
	}
	if (!password || password.length < 8 || password.trim() === "") {
		errors.password = "Password is incorrect";
	}

	return {
		errors,
		valid: Object.keys(errors).length < 1
	};
};
