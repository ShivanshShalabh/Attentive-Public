import React, { useState } from 'react';
import '../../styles/form.css';
import { connect } from 'react-redux';
import { setAlert } from '../../actions/alert';
import { register } from '../../actions/auth';
import PropTypes from 'prop-types';
import { Navigate } from 'react-router-dom';

// * Use: Sign Up form
// * Desc: Signs up new users 
// * Access: Public
// * Testing: Passed ✔ (09-04-2022)

const SignUp = ({ setAlert, register, isAuthenticated }) => {
    const [formData, setFormData] = useState({
        userName: '',
        userEmail: '',
        userType: '',
        userPass: '',
        userPassConfirm: ''

    });
    const { userName, userEmail, userType, userPass, userPassConfirm } = formData;

    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = async (e) => {
        e.preventDefault();
        if (userPass !== userPassConfirm) {
            setAlert('Passwords do not match', 'danger', 5000);
        }
        else {
            register({ userName, userEmail, userType, userPass, userPassConfirm });
        }
    };
    if (isAuthenticated) {
        return <Navigate to='/' />;
    }

    return (
        <form method="POST" onSubmit={e => onSubmit(e)}>
            <div>
                <span> Name: </span>
                <input required type="text" name="userName" id="userName" maxLength="40" value={userName}
                    onChange={e => onChange(e)} />

            </div>
            <div>
                <span> Email: </span>
                <input required name="userEmail" id="userEmail" type="email" maxLength="40" value={userEmail}
                    onChange={e => onChange(e)} />

            </div>
            <div>
                <span> User Type: </span>
                <select name="userType" id="userType" value={userType} onChange={e => onChange(e)}>
                    <option value="">Select User Type</option>
                    <option value="school_admin">School Admin</option>
                    <option value="student">Student</option>
                    <option value="teacher">Teacher</option>
                </select>
            </div>
           

            <div>
                <span> Password: </span>
                <input required type="password" name="userPass" id="userPass" maxLength="40" value={userPass} onChange={e => onChange(e)} />

            </div>
            <div>
                <span> Confirm Password: </span>
                <input required type="password" name="userPassConfirm" id="userPassConfirm" maxLength="40" value={userPassConfirm} onChange={e => onChange(e)} />
            </div>
            <div>
                <button type="submit">
                    Sign Up  
                </button>
            </div>
        </form>
    );
};

SignUp.propTypes = {
    setAlert: PropTypes.func.isRequired,
    register: PropTypes.func.isRequired,
    isAuthenticated: PropTypes.bool
};

const mapStateToProps = state => ({
    isAuthenticated: state.auth.isAuthenticated
});



export default connect(mapStateToProps, { setAlert, register })(SignUp);