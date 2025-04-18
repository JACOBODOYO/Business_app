import axios from "axios";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";



const Start = () => {
    const navigate = useNavigate();
useEffect

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 loginPage">
        <div className="p-3 rounded w-25 border">
            <h2 className="text-center">Login As</h2>
            <div className="d-flex justify-content-between mt-5 mb-2">
                <button type="button" className="btn btn-primary" onClick={() => {navigate('/employee_login')}
                }>Employee</button>
                <button type="button" className="btn btn-primary" onClick={() => {navigate('/admin_login')}
                }>Admin</button>
            </div>
        </div>
    </div>
  );
};

export default Start
