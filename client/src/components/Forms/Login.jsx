import React, { useState } from 'react';
import { connect } from 'react-redux';
import { Navigate } from 'react-router-dom';
import '../../styles/form.css';
import { login } from '../../actions/auth';
import PropTypes from 'prop-types';

// * Use: Login User form 
// * Desc: Serves login form to user
// * Access: Public
// * Testing: Passed ✔ (09-04-2022)

const Login = ({ login, isAuthenticated }) => {

    const [formData, setFormData] = useState({
        userEmail: '',
        userPass: ''
    });
    const { userEmail, userPass } = formData;

    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = async (e) => {
        e.preventDefault();
        login({ userEmail, userPass });
    };

    if (isAuthenticated) {
        return <Navigate to='/' />;
    }


    return (
        <form method="POST" onSubmit={e => onSubmit(e)}>
            <div>
                <span> Email: </span>
                <input required name="userEmail" id="userEmail" type="email" maxLength="40" value={userEmail} onChange={e => onChange(e)} />
            </div>


            <div>
                <span> Password: </span>
                <input required type="password" name="userPass" id="userPass" maxLength="40" value={userPass} onChange={e => onChange(e)} />
            </div>

            <div>
                <button type="submit">
                    Log In  
                </button>
            </div>
        </form>
    );
};

Login.propTypes = {
    login: PropTypes.func.isRequired,
    isAuthenticated: PropTypes.bool
};

const mapStateToProps = state => ({
    isAuthenticated: state.auth.isAuthenticated
});


export default connect(mapStateToProps, { login })(Login);