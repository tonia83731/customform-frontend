import { FormEvent, useRef, useState } from "react";
import { useNavigate } from "react-router";
import { useDispatch } from "react-redux";
import { addUserInfo } from "../state/auth/authSlice";
import { axiosFetch } from "../api";

const SigninPage = () => {
  const navigate = useNavigate();
  const [isError, setIsError] = useState({
    status: false,
    message: "",
  });
  const emailRef = useRef<HTMLInputElement | null>(null);
  const passwordRef = useRef<HTMLInputElement | null>(null);
  const dispatch = useDispatch();
  const handleSigninSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const email = emailRef.current?.value;
    const password = passwordRef.current?.value;

    if (!email || !password) return;
    try {
      const res = await axiosFetch("POST", "/signin", false, {
        email,
        password,
      });

      if (!res?.data.success) {
        setIsError({
          status: true,
          message: "登入失敗",
        });
        return;
      }
      setIsError({
        status: false,
        message: "",
      });
      const data = res?.data.data;
      const { user, token } = data;
      dispatch(addUserInfo({ name: user.name, email: user.email }));
      localStorage.setItem("authToken", token);
      navigate("/");
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="w-full h-full min-h-screen bg-daylight relative">
      <div className="container w-full max-w-[600px] h-screen mx-auto py-[40px] px-[20px] flex flex-col justify-center items-center gap-10">
        <h1 className="font-bold text-3xl flex justify-start w-full">
          WELCOME BACK,
          <br className="md:hidden" />
          SIGN IN
        </h1>
        <form
          className="flex flex-col gap-8 w-full"
          onSubmit={(e) => handleSigninSubmit(e)}
        >
          <div className="flex flex-col gap-4 w-full">
            <div className="flex flex-col gap-2 w-full">
              <label htmlFor="email" className="text-midnight font-medium">
                EMAIL
              </label>
              <input
                ref={emailRef}
                type="email"
                className="bg-white text-midnight px-4 py-2 hover:border-b hover:border-midnight focus:border-b focus:border-midnight placeholder:text-slate-200"
                placeholder="USER.CUSTOMFORM@EXAMPLE.COM"
              />
            </div>{" "}
            <div className="flex flex-col gap-2 w-full">
              <label htmlFor="password" className="text-midnight font-medium">
                PASSWORD
              </label>
              <input
                ref={passwordRef}
                type="password"
                className="bg-white text-midnight px-4 py-2 hover:border-b hover:border-midnight focus:border-b focus:border-midnight placeholder:text-slate-200"
                placeholder="********"
              />
            </div>
          </div>
          <button
            className="bg-hot text-white rounded-md w-full py-1.5 cursor-pointer"
            type="submit"
          >
            SIGN IN
          </button>
        </form>
        {isError.status && <p className="text-hot">{isError.message}</p>}
      </div>
    </div>
  );
};

export default SigninPage;
