import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [values, setValues] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const invalidEmailEnterd = values.email !== '' && !values.email.includes('@')


  axios.defaults.withCredentials = true;

  const handleSubmit = (event) => {
    event.preventDefault();
    axios
      .post("http://localhost:3001/auth/login", values)
      .then((result) => {
        if (result.data.loginStatus) {
          localStorage.setItem("valid", true);
          navigate("/dashboard");
        } else {
          setError(result.data.error);
        }
      })
      .catch((err) => console.log(err));
      
  };

  return (
    <div className="flex flex-row justify-center items-center min-h-screen bg-blue-500">
      <div className="p-3 rounded w-25 border  bg-gray-300">
        <div className="text-danger">{error && error}</div>
        <h2 className="mb-3 text-red-400">Konekt</h2>
        <form
          onSubmit={handleSubmit}
          className="space-y-4 p-6 rounded shadow-md w-full max-w-md"
        >
          <div className="flex flex-col mb-3">
            <label htmlFor="email" className="flex items-center">
              <strong>Email</strong>
            </label>
            <input
              type="email"
              name="email"
              autoComplete="off"
              placeholder="Enter Email"
              onChange={(e) => setValues({ ...values, email: e.target.value })}
              className="form-control h-10 rounded-0 text-black p-2 hover:cursor-pointer"
            />
          </div>
          <div>{invalidEmailEnterd && <p>Please enter valid email</p>}</div>
          <div className="flex flex-col mb-3">
            <label htmlFor="password">
              <strong>Password:</strong>
            </label>
            <input
              type="password"
              name="password"
              placeholder="Enter Password"
              onChange={(e) =>
                setValues({ ...values, password: e.target.value })
              }
              className="form-control h-10 rounded-0 text-black p-2 hover:cursor-pointer"
            />

            <button className="flex flex-col justify-center items-center mt-5 bg-blue-300 h-10 w-100 rounded-0 mb-2">
              Log in
            </button>
          </div>

          <div>
            <div className="mb-2">
              Not registerd?{" "}
              <span className="hover:text-blue-600 cursor-pointer">
                Create an account
              </span>
            </div>
            <div className="">
              Forgot password?{" "}
              <span className="hover:text-blue-600 cursor-pointer">
                Reset Password
              </span>{" "}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
