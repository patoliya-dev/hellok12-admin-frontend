import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import LoginForm from "./components/LoginForm";
import SocialLoginSection from "./components/SocialLoginSection";
import TrustSignals from "./components/TrustSignals";
import logo from "../../../assets/logo.svg";
import wavingHand from "../../../assets/waving-hand.svg";
import { loginUser } from "../../../reducers/auth/authThunks";
import { selectLoginStatus } from "../../../reducers/auth/authSelectors";
import { DEFAULT_ROUTES } from "../../../utils/constant";
import { SignInIcon } from "components/icons";

const Login = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const loginStatus = useSelector(selectLoginStatus);

  const dispatch = useDispatch();

  // Mock credentials for different user roles
  // const mockCredentials = {
  //   'student@eduportal.com': { password: 'student123', role: 'student', mfaEnabled: false },
  //   'parent@eduportal.com': { password: 'parent123', role: 'parent', mfaEnabled: true },
  //   'teacher@eduportal.com': { password: 'teacher123', role: 'teacher', mfaEnabled: false },
  //   'admin@eduportal.com': { password: 'admin123', role: 'admin', mfaEnabled: true }
  // };

  const redirectToRoleDashboard = (role) => {
    navigate(DEFAULT_ROUTES[role] || "/admin/dashboard", {
      replace: true,
    });
  };

  const handleLogin = async (formData) => {
    const resultAction = await dispatch(loginUser(formData));

    if (loginUser.fulfilled.match(resultAction)) {
      const { user } = resultAction.payload;
      redirectToRoleDashboard(user.role);
    }
  };

  // const handleSocialLogin = async (provider) => {
  //   setIsLoading(true);
  //   setError('');

  //   try {
  //     // Simulate social login
  //     await new Promise(resolve => setTimeout(resolve, 2000));

  //     // Mock successful social login as student
  //     const userData = {
  //       email: `${provider.toLowerCase()}user@eduportal.com`,
  //       role: 'student',
  //       name: `${provider} User`,
  //       mfaEnabled: false,
  //       loginTime: new Date().toISOString(),
  //       socialProvider: provider
  //     };

  //     localStorage.setItem('currentUser', JSON.stringify(userData));
  //     redirectToRoleDashboard('student');
  //   } catch (err) {
  //     setError(`${provider} login failed. Please try again.`);
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  return (
    <div className="min-h-screen bg-auth-bg bg-cover bg-center">
      <main className="pt-16 min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-8">
          {/* Header */}
          <div className="text-center">
            <img src={logo} alt="Company Logo" className="mx-auto" />
            <div className="flex justify-center">
              <h1 className="text-xl font-bold text-foreground">
                Welcome Back, Admin!
              </h1>
              <img src={wavingHand} alt="Company Logo" className="ml-1" />
            </div>
            <p className="mt-2 text-muted-foreground">
              Sign in to access the HelloK12 Admin Console
            </p>
          </div>

          {/* Login Card */}
          <div className="bg-card border border-border rounded-xl shadow-elevated">
            <div className="border-b border-border px-6 py-4">
              <div className="text-sm font-semibold text-primary text-center flex flex-1 justify-center items-center space-x-2">
                <SignInIcon selected={true} />
                <span className="text-sm">Sign In</span>
              </div>
              {/* <button
                      
                      onClick={() => {
                        setActiveTab(tab.id);
                        setCurrentStep(0);
                      }}
                      className={`
                            flex flex-1 justify-center text-center items-center space-x-2 py-[18px] px-1 border-b-2 font-medium text-sm transition-smooth
                            ${
                              activeTab === tab.id
                                ? "border-primary text-primary"
                                : "border-transparent text-muted-foreground hover:text-foreground hover:border-muted"
                            }
                          `}
                    >
                      
                    </button> */}
            </div>

            {/* Login Form */}
            <LoginForm
              onSubmit={handleLogin}
              isLoading={loginStatus === "loading"}
              currentStep={currentStep}
              setCurrentStep={setCurrentStep}
            />

            {/* Social Login Section */}
            {!currentStep ? (
              <SocialLoginSection
                // onGoogleLogin={() => handleSocialLogin('Google')}
                // onFacebookLogin={() => handleSocialLogin('Facebook')}
                isLoading={loginStatus === "loading"}
              />
            ) : null}
          </div>

          {/* Trust Signals */}
          <TrustSignals />
        </div>
      </main>
    </div>
  );
};

export default Login;
