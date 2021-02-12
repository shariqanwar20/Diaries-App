import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { Label, Input, Button } from "theme-ui";
import { saveToken, setIsAuthenticated } from "../../features/auth/authSlice";
import { setUser } from "../../features/auth/userSlice";
import { User } from "../../interfaces/user.interface";
import { AppDispatch } from "../../redux/store";
import http from "../../services/mirage/api";
import { AuthResponse } from "../../services/mirage/routes/user";
// import { yupResolver } from '@hookform/resolvers/yup';

// const validationSchema = Yup.object().shape({
//   username: Yup.string()
//     .required("What? No username?")
//     .max(16, "Username cannot be longer than 16 characters"),
//   password: Yup.string().required('Without a password, "None shall pass!"'),
//   email: Yup.string().email("Please provide a valid email address (abc@xy.z)"),
// });

export const Auth = () => {
  const { handleSubmit, register } = useForm<User>();
  const [isLogin, setIsLogin] = useState(true);
  // const [loading, setLoading] = useState(false);
  const path = isLogin ? "/auth/login" : "/auth/signup";
  const dispatch = useDispatch<AppDispatch>();

  const submitForm = (data: User) => {
    console.log("submit clicked");
    console.log(path);

    http
      .post<User, AuthResponse>(path, data)
      .then((res) => {
        if (res) {
          const { user, token } = res;
          dispatch(saveToken(token));
          dispatch(setUser(user));
          dispatch(setIsAuthenticated(true));
        }
      })
      .catch((error) => {
        console.log(error);
      });
    // .finally(() => {
    //   setLoading(false);
    // });
  };
  return (
    <>
      <form
        onSubmit={handleSubmit(submitForm)}
        style={{
          boxShadow: "0px 0px 5px grey",
          width: "400px",
          padding: "20px 30px",
          position: "absolute",
          top: "50%",
          borderRadius: "10px",
          left: "50%",
          transform: "translate(-50%, -50%)",
        }}
      >
        <Label htmlFor="username">Username</Label>
        <Input ref={register} name="username" mb={3} placeholder="Username" />
        <Label htmlFor="password">Password</Label>
        <Input
          type="password"
          ref={register}
          name="password"
          mb={3}
          placeholder="Password"
        />
        {isLogin ? null : (
          <>
            <Label htmlFor="email">Email</Label>
            <Input
              ref={register}
              name="email"
              mb={3}
              placeholder="Email(optional)"
            />
          </>
        )}
        <Button
          type="submit"
          // disabled={loading}
          // onClick={() => {
          //   setLoading(true);
          // }}
        >
          {isLogin ? "Log In" : "Create Account"}
        </Button>
        <p style={{ cursor: "pointer" }} onClick={() => setIsLogin(!isLogin)}>
          {isLogin
            ? "Don't have an account. Create one"
            : "Already have an account?"}
        </p>
      </form>
    </>
  );
};
