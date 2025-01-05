import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  CognitoUserPool,
  CognitoUserAttribute,
  CognitoUser,
} from "amazon-cognito-identity-js";

const poolData = {
  UserPoolId: "us-east-2_xnWIB5BRA", // Your User Pool ID
  ClientId: "33dm3ph8qk5d56js00vshbb11", // Your Client ID
};

const userPool = new CognitoUserPool(poolData);

const SignUp: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [isVerificationStep, setIsVerificationStep] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    // Sign up logic with Cognito
    const attributeList = [
      new CognitoUserAttribute({ Name: "email", Value: email }),
    ];
    userPool.signUp(email, password, attributeList, [], (err, result) => {
      if (err) {
        alert(err.message || JSON.stringify(err));
        return;
      }
      console.log("User name is " + result?.user.getUsername());
      alert("Sign up successful! Please check your email for verification.");
      setIsVerificationStep(true);
    });
  };

  const handleVerificationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const userData = {
      Username: email,
      Pool: userPool,
    };
    const cognitoUser = new CognitoUser(userData);
    cognitoUser.confirmRegistration(verificationCode, true, (err, result) => {
      if (err) {
        alert(err.message || JSON.stringify(err));
        return;
      }
      console.log("Verification result: " + result);
      alert("Verification successful! You can now log in.");
      navigate("/login");
    });
  };

  return (
    <div className="sign-up-container">
      <h2>Sign Up</h2>
      {!isVerificationStep ? (
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="confirmPassword">Confirm Password:</label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit">Sign Up</button>
        </form>
      ) : (
        <form onSubmit={handleVerificationSubmit}>
          <div>
            <label htmlFor="verificationCode">Verification Code:</label>
            <input
              type="text"
              id="verificationCode"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
              required
            />
          </div>
          <button type="submit">Verify Account</button>
        </form>
      )}
      <button onClick={() => navigate("/")}>Back to Home</button>
    </div>
  );
};

export default SignUp;
