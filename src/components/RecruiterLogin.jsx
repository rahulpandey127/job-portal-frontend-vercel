import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { assets } from "../assets/assets";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";
const RecruiterLogin = () => {
  let navigate = useNavigate();
  let [state, setState] = useState("Login");
  let [name, setName] = useState("");
  let [password, setPassword] = useState("");
  let [email, setEmail] = useState("");
  const [image, setImage] = useState(false);
  const [isTextDataSubmitted, setIsTextDataSubmitted] = useState(false);
  const { setShowRecruiterLogin, backendUrl, setCompanyToken, setCompanyData } =
    useContext(AppContext);
  const onSubmitHandler = async (e) => {
    //Recruiter login
    e.preventDefault();
    if (state === "Sign Up" && !isTextDataSubmitted) {
      return setIsTextDataSubmitted(true);
    }
    try {
      if (state === "Login") {
        //Login API call
        const { data } = await axios.post(`${backendUrl}/api/company/login`, {
          email,
          password,
        });
        console.log(data);
        if (data.success) {
          setCompanyToken(data.token);
          setCompanyData(data.company);
          localStorage.setItem("companyToken", data.token);
          setShowRecruiterLogin(false);
          navigate("/dashboard");
        } else {
          toast.error(data.message);
        }
      } else {
        const formData = new FormData();
        formData.append("name", name);
        formData.append("email", email);
        formData.append("password", password);
        formData.append("image", image);
        const { data } = await axios.post(
          `${backendUrl}/api/company/register`,
          formData,
        );
        console.log(data);
        if (data.success) {
          toast.success(data.message);
          setCompanyData(data.company);
          setCompanyToken(data.token);
          localStorage.setItem("companyToken", data.token);
          setShowRecruiterLogin(false);
          navigate("/dashboard");
        } else {
          toast.error(data.message);
        }
      }
    } catch (error) {
      console.log("errror here" + error);
      toast.error(error.message);
    }
  };

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  return (
    <div className="absolute top-0 right-0 left-0 bottom-0 z-10 backdrop-blur-sm bg-black/30 flex justify-center items-center">
      <form
        onSubmit={onSubmitHandler}
        className="relative bg-white p-10 rounded-xl text-slate-500"
      >
        <h1 className="text-center text-2xl text-neutral-700 font-medium">
          Recruiter {state}
        </h1>
        <p className="text-sm">Welcome back! Please sign in to continue</p>
        {state === "Sign Up" && isTextDataSubmitted ? (
          <>
            <div className="flex items-center gap-4 my-10">
              <label htmlFor="image">
                <img
                  src={image ? URL.createObjectURL(image) : assets.upload_area}
                  alt="logo-image"
                  className="w-16 h-16 rounded-full cursor-pointer"
                />
                <input
                  type="file"
                  hidden
                  id="image"
                  onChange={(e) => setImage(e.target.files[0])}
                />
              </label>
              <p>
                Upload Company <br /> Logo
              </p>
            </div>
          </>
        ) : (
          <>
            {state !== "Login" && (
              <div className="border px-4 py-2 flex items-center gap-2 rounded-full mt-5">
                <img src={assets.person_icon} alt="person-icon" />
                <input
                  type="text"
                  placeholder="Company Name"
                  required
                  className="outline-none text-sm"
                  onChange={(e) => setName(e.target.value)}
                  value={name}
                />
              </div>
            )}

            <div className="border px-4 py-2 flex items-center gap-2 rounded-full mt-5 ">
              <img src={assets.email_icon} alt="email-icon" />
              <input
                type="email"
                placeholder="Email"
                required
                className="outline-none text-sm"
                onChange={(e) => setEmail(e.target.value)}
                value={email}
              />
            </div>
            <div className="border px-4 py-2 flex items-center gap-2 rounded-full mt-5 ">
              <img src={assets.lock_icon} alt="password-icon" />
              <input
                type="password"
                placeholder="Password"
                required
                className="outline-none text-sm"
                onChange={(e) => setPassword(e.target.value)}
                value={password}
              />
            </div>
          </>
        )}
        {state === "Login" && (
          <p className="text-sm text-blue-600 my-4 cursor-pointer">
            Forgot password?
          </p>
        )}

        <button
          className="bg-blue-600 w-full text-white py-2 rounded-full mt-4"
          type="submit"
        >
          {state === "Login"
            ? "login"
            : isTextDataSubmitted
              ? "create account"
              : "next"}
        </button>
        {state === "Login" ? (
          <p className="mt-5 text-center">
            Dont't have an account ?{" "}
            <span
              className="text-blue-600 cursor-pointer"
              onClick={() => {
                setState("Sign Up");
              }}
            >
              Sign Up
            </span>
          </p>
        ) : (
          <p className="mt-5 text-center">
            Already have an account ?{" "}
            <span
              className="text-blue-600 cursor-pointer"
              onClick={() => {
                setState("Login");
              }}
            >
              Login
            </span>
          </p>
        )}
        <img
          src={assets.cross_icon}
          alt="cross-icon"
          className="absolute top-5 right-5 cursor-pointer"
          onClick={(e) => setShowRecruiterLogin("false")}
        />
      </form>
    </div>
  );
};

export default RecruiterLogin;
