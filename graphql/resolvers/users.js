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
		async login(_, { username, password }) {
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

			if (!valid) {
				throw new UserInputError("Errors: ", { errors });
			}

			const token = generateToken(user);

			return {
				...user._doc,
				id: user._id,
				token
			};
		},
		async register(
			_,
			{ registerInput: { username, email, password, confirmPassword } }
		) {
			// TODO: validate user data

			const { valid, errors } = validateRegisterInput(
				username,
				email,
				password,
				confirmPassword
			);

			if (!valid) {
				throw new UserInputError("Errors: ", { errors });
			}

			// TODO: Mkae sure users doesn't already exist

			const user = await User.findOne({ username });
			if (user) {
				throw new UserInputError("Username is taken", {
					errors: {
						username: "This username is taken"
					}
				});
			}

			// TODO: hash password and create auth token:: DONE
			password = await bcrypt.hash(password, 12);

			const newUser = new User({
				email,
				username,
				password,
				createdAt: new Date().toUTCString()
			});
			const res = await newUser.save();

			const token = generateToken(res);
		}
	}
};
