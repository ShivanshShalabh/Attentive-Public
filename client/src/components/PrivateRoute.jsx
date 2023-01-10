import React from "react";
import { connect } from "react-redux";
import { Navigate } from "react-router-dom";
import PropTypes from "prop-types";

// * Use: Private Route
// * Desc: Ensures that the user is logged in
// * Access: Authorized
// * Testing: Passed ✔ (09-04-2022)

const PrivateRoute = ({
  children,
  auth: { isAuthenticated, loading, user },
  userType,
}) => {
  while (loading) {
    return <div></div>;
  }
    if (!isAuthenticated || (userType && !userType.includes(user.type)))
      return <Navigate to="/login" />;

  return children;
};

PrivateRoute.propTypes = {
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state, { userType }) => {
  return { auth: state.auth, userType };
};

export default connect(mapStateToProps)(PrivateRoute);
