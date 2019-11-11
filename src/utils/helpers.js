export const getShowHideStyle = condition => (condition ? { display: 'flex' } : { display: 'none' });

export const validateEmail = email => {
	const reg = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()\.,;\s@\"]+\.{0,1})+[^<>()\.,;:\s@\"]{2,})$/;
	const isValid = reg.test(String(email).toLowerCase());

	return isValid;
};
