import "./Button.css";

function joinClasses(...classes) {
	return classes.filter(Boolean).join(" ");
}

function Button({
	children,
	type = "button",
	variant = "primary",
	size = "md",
	block = false,
	className,
	...props
}) {
	return (
		<button
			type={type}
			className={joinClasses(
				"ui-button",
				`ui-button--${variant}`,
				`ui-button--${size}`,
				block ? "ui-button--block" : "",
				className,
			)}
			{...props}
		>
			{children}
		</button>
	);
}

export default Button;
