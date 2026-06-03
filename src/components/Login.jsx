import { createClient } from "@supabase/supabase-js";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

const Login = () => {
  const [values, setValues] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const invalidEmailEnterd = values.email !== '' && !values.email.includes('@')
  console.log("LOGIN ERROR:", error);

  // axios.defaults.withCredentials = true;

  // const handleSubmit = (event) => {
  //   event.preventDefault();

  //   if (!values.email || !values.password) {
  //     setError("Email and password are required");
  //     return;
  //   }
  //   axios
  //     .post(`${import.meta.env.VITE_API_URL}/auth/login`, values)
  //     .then((result) => {
  //       if (result.data.loginStatus) {
  //         const token = result.data.token;
  //         localStorage.setItem("token", token);

  //         // attempt to decode JWT payload to store user info (id, role)
  //         try {
  //           const payload = JSON.parse(atob(token.split(".")[1]));
  //           localStorage.setItem("user", JSON.stringify({ id: payload.id, role: payload.role, email: payload.email }));
  //         } catch (e) {
  //           // ignore decode errors
  //         }

  //         navigate("/dashboard");
  //       } else {
  //         setError(result.data.error);
  //       }
  //     })
  //     .catch((err) => console.log(err));

  // };
  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!values.email || !values.password) {
      setError("Email and password are required");
      return;
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email: values.email,
      password: values.password,
    });

    if (error) {
      setError(error.message);
      return;
    }

    localStorage.setItem("token", data.session.access_token);
    navigate("/dashboard");
  };


  return (
    <div className="flex flex-row justify-center items-center min-h-screen bg-blue-500">
      <div className="p-3 rounded w-25 border  bg-gray-300">
        <div className="text-danger">{error && error}</div>
        <h2 className="mb-3 text-red-400">JAMATEL</h2>
        <form
          onSubmit={handleSubmit}
          className="space-y-4 p-6 rounded shadow-md w-full max-w-md"
        >
          <div className="flex flex-col mb-3">
            <label htmlFor="email" className="flex items-center">
              <strong>Email or username</strong>
            </label>
            <input
              type="email"
              name="email"
              autoComplete="off"
              placeholder="Enter email or username"
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

            <button
              disabled={!values.email || !values.password}
              className="flex flex-col justify-center items-center mt-5 bg-blue-300 h-10 w-100 rounded-0 mb-2 transition-all duration-150
    active:scale-95
    active:opacity-80
    active:translate-y-[1px]
    cursor-pointer">
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
