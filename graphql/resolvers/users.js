const User = require("../../models/User");
const bcrypt = require("bcryptjs");

const { UserInputError } = require("apollo-server");
const generateToken = require("../../util/generateToken");
const {
	validateRegisterInput,
	validateLoginInput
} = require("../../util/validators");

module.exports = {
	Mutation: {
		async login(_, { username, password }, { res }) {
			const { valid, errors } = validateLoginInput(username, password);

			if (!valid) {
				throw new UserInputError("ERRORS: ", { errors });
			}

			const user = await User.findOne({ username });
			if (!user) {
				errors.general = "User not found";
				throw new UserInputError("User not found", { errors });
			}

			const match = await bcrypt.compare(password, user.password);
			if (!match) {
				errors.general = "Wrong Credentials";
				throw new UserInputError("Wrong credentials", { erros });
			}

			const token = generateToken(user, "1h");
			const refreshToken = generateToken(res, "7d");

			return {
				...user._doc,
				id: user._id,
				token,
				refreshToken
			};
		},
		async register(
			_,
			{ registerInput: { username, email, password, confirmPassword } }
		) {
			// Validate user data
			const { valid, errors } = validateRegisterInput(
				username,
				email,
				password,
				confirmPassword
			);
			if (!valid) {
				throw new UserInputError("Errors", { errors });
			}
			// TODO: Make sure user doesnt already exist
			const user = await User.findOne({ username });
			if (user) {
				throw new UserInputError("Username is taken", {
					errors: {
						username: "This username is taken"
					}
				});
			}
			// hash password and create an auth token
			password = await bcrypt.hash(password, 12);

			const newUser = new User({
				email,
				username,
				password,
				createdAt: new Date().toISOString()
			});

			const res = await newUser.save();

			const token = generateToken(res, "1h");
			const refreshToken = generateToken(res, "7d");

			return {
				...res._doc,
				id: res._id,
				token,
				refreshToken
			};
		}
	}
};
