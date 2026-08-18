import { useState } from "react";
import { useNavigate } from "react-router-dom";

import API from "../utils/axiosConfig";
import { useAuth } from "../context/AuthContext";

import "./Login.css";

function Login() {

    const navigate = useNavigate();

    const { login } = useAuth();

    const [form, setForm] = useState({
        email: "",
        password: "",
    });

    const [isSubmitting, setIsSubmitting] = useState(false);

    const [errorMessage, setErrorMessage] = useState("");

    const handleChange = (event) => {

        setForm({
            ...form,
            [event.target.name]: event.target.value,
        });

    };

    const handleSubmit = async (event) => {

        event.preventDefault();

        setErrorMessage("");

        setIsSubmitting(true);

        try {

            const res = await API.post(
                "/employees/login",
                form
            );

            login(
                res.data.employee,
                res.data.token
            );

            navigate("/");

        } catch (error) {

            console.error(error);

            setErrorMessage(
                "Invalid credentials. Please check your email and password."
            );

        } finally {

            setIsSubmitting(false);

        }

    };

    return (

        <main className="login-page">

            <div className="login-page__background">

                <div className="login-page__glow login-page__glow--one" />

                <div className="login-page__glow login-page__glow--two" />

            </div>

            <section className="login-card">

                {/* Brand */}

                <div className="login-brand">

                    <div className="login-brand__logo">

                        <span>SE</span>

                    </div>

                    <div>

                        <p className="login-brand__company">

                            SHRINATH ENTERPRISES

                        </p>

                        <p className="login-brand__product">

                            IBOP

                        </p>

                    </div>

                </div>

                {/* Heading */}

                <div className="login-heading">

                    <p className="login-heading__eyebrow">

                        INTEGRATED BUSINESS OPERATIONS PLATFORM

                    </p>

                    <h1>

                        Welcome back

                    </h1>

                    <p>

                        Sign in to access your IBOP workspace.

                    </p>

                </div>

                {/* Form */}

                <form
                    onSubmit={handleSubmit}
                    className="login-form"
                >

                    <div className="login-field">

                        <label htmlFor="email">

                            Work Email

                        </label>

                        <input
                            id="email"
                            type="email"
                            name="email"
                            placeholder="name@company.com"
                            value={form.email}
                            onChange={handleChange}
                            autoComplete="email"
                            required
                        />

                    </div>

                    <div className="login-field">

                        <label htmlFor="password">

                            Password

                        </label>

                        <input
                            id="password"
                            type="password"
                            name="password"
                            placeholder="Enter your password"
                            value={form.password}
                            onChange={handleChange}
                            autoComplete="current-password"
                            required
                        />

                    </div>

                    {errorMessage && (

                        <div className="login-error">

                            {errorMessage}

                        </div>

                    )}

                    <button
                        type="submit"
                        className="login-button"
                        disabled={isSubmitting}
                    >

                        {isSubmitting ? (

                            <>

                                <span className="login-spinner" />

                                Signing in...

                            </>

                        ) : (

                            "Sign in"

                        )}

                    </button>

                </form>

                {/* Footer */}

                <div className="login-footer">

                    <span className="login-footer__dot" />

                    <span>

                        Secure access for authorized users only

                    </span>

                </div>

                <div className="login-footer__company">

                    Shrinath Enterprises

                    <span>•</span>

                    IBOP v1.0.0

                </div>

            </section>

        </main>

    );

}

export default Login;