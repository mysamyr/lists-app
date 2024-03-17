const sgMail = require("@sendgrid/mail");

const { SENDGRID_API_KEY, SENDGRID_EMAIL } = process.env;

sgMail.setApiKey(SENDGRID_API_KEY);

const generateMail = (email, subject, text) => ({
	from: SENDGRID_EMAIL,
	to: email,
	subject,
	text,
});

module.exports.sendAuthorisationEmail = async ({ email, url }) => {
	return await sgMail.send(
		generateMail(
			email,
			"Registration on Lister App!",
			`Greetings!
			Your email was used for a registration on Lister App website, but your account isn't activated yet.
			To activate your account and enjoy all features please go to the activation link - ${url}
			If you think it is a mistake - just ignore this message.
			Have a nice day!`,
		),
	);
};
