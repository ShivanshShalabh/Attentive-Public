import React, { useState } from "react";
import { Link } from "react-router-dom";
import { logout } from "../actions/auth";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { SCHOOL_ADMIN, TEACHER, STUDENT } from "../utils/userTypes";
import "./../styles/nav.css";
import logo from "./../images/logo.svg";

// -------------------------------------------------->

// * Use: Navbar component
// * Desc: Shows navigation bar for the application
// * Access: Public
// * Testing: Passed ✔ (09-04-2022)

const Navbar = ({ auth: { isAuthenticated, loading, user }, logout }) => {
  const [navCheckBox, setnavCheckBox] = useState(false);
  const guestLinks = (
    <>
      <li><Link data-text="Sign Up" onClick={() => setnavCheckBox(prev => !prev)} to={"/signup"}>Sign Up</Link></li>
      <li><Link data-text="Log In" onClick={() => setnavCheckBox(prev => !prev)} to={"/login"}>Log In</Link></li>
    </>
  );
  const studentLinks = (
    <>
      <li><Link data-text="Profile" onClick={() => setnavCheckBox(prev => !prev)} to={"/profile/me"}>Profile</Link></li>
      <li><Link data-text="Join Meeting" onClick={() => setnavCheckBox(prev => !prev)} to={"/meeting/join"}>Join Meeting</Link></li>
      {user.school ? (
        user.classrooms.length ? (
          <li><Link data-text="My Classroom" onClick={() => setnavCheckBox(prev => !prev)} to={"/meetings"}>My Classroom</Link></li>
        ) : (
          <li><Link data-text="Join Classroom" onClick={() => setnavCheckBox(prev => !prev)} to={"/classroom/join"}>Join Classroom</Link></li>
        )
      ) : (
        <li><Link data-text="Join School" onClick={() => setnavCheckBox(prev => !prev)} to={"/school/join"}>Join School</Link></li>
      )}
    </>
  );
  const teacherLinks = (
    <>
      <li><Link data-text="Create Meeting" onClick={() => setnavCheckBox(prev => !prev)} to={"/meeting/new"}>Create Meeting</Link></li>
      <li><Link data-text="All Meetings" onClick={() => setnavCheckBox(prev => !prev)} to={"/meetings"}>All Meetings</Link></li>
      {!user.school ? (
        <li><Link data-text="Join School" onClick={() => setnavCheckBox(prev => !prev)} to={"/school/join"}>Join School</Link></li>
      ) : <>
        <li><Link data-text="Join Classroom" onClick={() => setnavCheckBox(prev => !prev)} to={"/classroom/join"}>Join Classroom</Link></li>
        {(user.classrooms.length ? (
          <li><Link data-text="Manage Classroom" onClick={() => setnavCheckBox(prev => !prev)} to={"/classroom/all"}>Manage Classroom</Link></li>
        ) : (
          <li><Link data-text="Create Classroom" onClick={() => setnavCheckBox(prev => !prev)} to={"/classroom/new"}>Create Classroom</Link></li>
        ))}
      </>}
    </>
  );
  const schoolAdminNav = (
    <>
      {!user.school ? (
        <li><Link data-text="Register School" onClick={() => setnavCheckBox(prev => !prev)} to={"/school/register"}>Register School</Link></li>
      ) : (
        <>
          <li><Link data-text="Teacher Management" onClick={() => setnavCheckBox(prev => !prev)} to={"/school/teachers/"}>Teacher Management</Link></li>
          <li><Link data-text="Student Management" onClick={() => setnavCheckBox(prev => !prev)} to={"/school/students/"}>Student Management</Link></li>
        </>
      )}
    </>
  );
  const logoutLink = (
    <li><Link to={"/"} data-text="Log Out" onClick={() => { setnavCheckBox(prev => !prev); logout(); }}>
      Log Out
    </Link></li>
  );
  return (
    <nav>
      <div className="logo">
        <Link to={"/"}>
          <img src={logo} alt="" />
        </Link>
      </div>
      <h1 className="heading">Attentive</h1>
      <input type="checkbox" name="" id="active" checked={navCheckBox} style={{ display: "none" }} readOnly={true} />
      <label htmlFor="active" className="menu-btn" onClick={() => setnavCheckBox(prev => !prev)} >
        <div id="hamburger" className="hamburglar is-open">
          <div className="burger-icon">
            <div className="burger-container">
              <span className="burger-bun-top"></span>
              <span className="burger-filling"></span>
              <span className="burger-bun-bot"></span>
            </div>
          </div>
          {/* Explicitly using SVG for animation purposes */}
          <div className="burger-ring">
            <svg className="svg-ring">
              <path className="path" fill="none" stroke="#00b7ff" strokeMiterlimit="10" strokeWidth="4" d="M 34 2 C 16.3 2 2 16.3 2 34 s 14.3 32 32 32 s 32 -14.3 32 -32 S 51.7 2 34 2" />
            </svg>
          </div>

          <svg width="0" height="0">
            <mask id="mask">
              <path xmlns="http://www.w3.org/2000/svg" fill="none" stroke="#ff0000" strokeMiterlimit="10" strokeWidth="4" d="M 34 2 c 11.6 0 21.8 6.2 27.4 15.5 c 2.9 4.8 5 16.5 -9.4 16.5 h -4" />
            </mask>
          </svg>
          <div className="path-burger">
            <div className="animate-path">
              <div className="path-rotation"></div>
            </div>
          </div>

        </div>

      </label>
      <div className="wrapper">
        <ul>
          <li><Link data-text="Home" onClick={() => setnavCheckBox(prev => !prev)} to={"/"}>Home</Link></li>
          {!loading && (
            <>
              {!isAuthenticated
                ? guestLinks
                : user.type === SCHOOL_ADMIN
                  ? schoolAdminNav
                  : user.type === TEACHER
                    ? teacherLinks
                    : user.type === STUDENT
                      ? studentLinks
                      : null}{" "}
              {isAuthenticated && logoutLink}{" "}
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

Navbar.propTypes = {
  logout: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired
};

const mapStateToProps = (state) => ({ auth: state.auth, });

export default connect(mapStateToProps, { logout })(Navbar);
