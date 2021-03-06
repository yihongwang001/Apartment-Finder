import React from "react";
import { useState, useContext, useEffect, useRef } from "react";
import { Redirect, Link } from "react-router-dom";
import { Form } from "react-bootstrap";
import { MDBBtn } from "mdbreact";
import LoggedIn from "../components/LoginContext";

const LoginPage = (props) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const { loggedIn, setLoggedInHelper } = useContext(LoggedIn);
  const emailRef = useRef();
  const passwordRef = useRef();

  useEffect(() => {
    // Give the focus to the email input the first time
    emailRef.current.focus();
    if (props.location.state && props.location.state.errorMessage) {
      setErrorMessage(props.location.state.errorMessage);
    }
  }, [props.location.state]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const bodyObject = {
      email: email,
      password: password,
    };
    const formBody = Object.keys(bodyObject)
      .map(
        (key) =>
          encodeURIComponent(key) + "=" + encodeURIComponent(bodyObject[key])
      )
      .join("&");

    const response = await fetch("/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Accept: "appliction/json",
      },
      redirect: "follow",
      body: formBody,
    });

    const responseJson = await response.json();

    if (response.status === 200) {
      setLoggedInHelper(
        true,
        responseJson.username,
        responseJson.userId,
        responseJson.adminAccess
      );
    } else {
      setLoggedInHelper(false, null, null, false);
      setErrorMessage("Incorrect username or password");
      emailRef.current.value = "";
      passwordRef.current.value = "";
    }
  };

  if (loggedIn.loggedIn) {
    return <Redirect to="/"></Redirect>;
  } else {
    return (
      <div className="row justify-content-center">
        <div className="col-4 p-2 m-5">
          <Form
            onSubmit={handleSubmit}
            className="border p-5 shadow rounded bg-light login-form"
          >
            <h4 className="mb-4 text-center">Sign In</h4>
            <p>{errorMessage}</p>
            <Form.Group controlId="login-form-email-group">
              <Form.Label>Email address</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter email"
                name="email"
                ref={emailRef}
                onChange={(evt) => setEmail(evt.target.value)}
              />
            </Form.Group>

            <Form.Group controlId="login-form-pwd-group">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Password"
                name="password"
                ref={passwordRef}
                onChange={(evt) => setPassword(evt.target.value)}
              />
            </Form.Group>

            <p className="p-4 text-center">
              Not a member?
              <Link to="/register">Register</Link>
            </p>

            <MDBBtn type="submit" color="mdb-color" block>
              Sign In
            </MDBBtn>
          </Form>
        </div>
      </div>
    );
  }
};

export default LoginPage;
