import { setValue } from "../utils/local-storage";
import { navigate } from "../utils/navigator";
import { URLS } from "../constants";
import {
	createDiv,
	createForm,
	createHeader1,
	createInput,
	createLabel,
	createParagraph,
	createSpan,
	onPressClick,
} from "../utils/dom";
import Header from "../components/Header";
import Button from "../components/buttons/Button";
import { postRequest } from "../api";

const getInput = (name, type, description) => {
	const label = createLabel();
	label.classList.add("column");
	const span = createSpan();
	const input = createInput();
	input.name = name;
	input.type = type;
	span.innerText = description;
	label.append(span, input);
	return label;
};

const onRegister = async () => {
	const form = document.querySelector("form");
	const email = form.email.value;
	const password = form.password.value;

	// todo don't redirect to login on catch
	// remove catch from api calls and make every call with it's own catch
	// or make separate function for each api call
	await postRequest(URLS.SIGNUP, { email, password });
	return navigate(URLS.LOGIN);
};

const getRegistrationForm = () => {
	const form = createForm();
	form.classList.add("column", "gap");
	const email = getInput("email", "email", "Email Address");
	const password = getInput("password", "password", "Password");
	const btn = Button({
		text: "Register",
		once: false,
		color: "blue",
		onClick: onRegister,
	});
	form.append(email, password, btn);
	return form;
};

const onLogin = async () => {
	const form = document.querySelector("form");
	const email = form.email.value;
	const password = form.password.value;

	const tokens = await postRequest(URLS.SIGNIN, { email, password });
	if (tokens) {
		setValue("token", tokens.accessToken);
		return navigate(URLS.LISTS);
	}
};

const getLoginForm = () => {
	const form = createForm();
	form.classList.add("column", "gap");
	const email = getInput("email", "email", "Email Address");
	const password = getInput("password", "password", "Password");
	// todo forget password, remember me
	const btn = Button({
		text: "Login",
		once: false,
		color: "blue",
		onClick: onLogin,
	});
	form.append(email, password, btn);
	return form;
};

const config = {
	login: {
		title: "Login",
		h1: "Hello, Welcome Back!",
		h2: "Happy to see you, please login here.",
		switcherText:
			"Don't have an account? <span style='color: #71b6f6;'>Register</span>",
		switchFn: () => render(true),
		getForm: getLoginForm,
	},
	registration: {
		title: "Registration",
		h1: "Hello, Welcome!",
		h2: "First, let's create your account.",
		switcherText:
			"Already have an account? <span style='color: #71b6f6;'>Login</span>",
		switchFn: () => render(false),
		getForm: getRegistrationForm,
	},
};

const render = (isRegistration = false) => {
	const params = isRegistration ? config.registration : config.login;
	const body = document.querySelector("body");
	const container = createDiv();
	container.classList.add("dialog-modal");
	body.innerText = "";
	const h1 = createHeader1();
	h1.innerText = params.h1;
	const h2 = createParagraph();
	h2.innerText = params.h2;
	const switcher = createParagraph();
	switcher.innerHTML = params.switcherText;
	onPressClick(switcher, () => params.switchFn(), { once: true });
	container.append(h1, h2, params.getForm(), switcher);
	body.append(Header({ title: params.title }), container);
};

export default () => render();
