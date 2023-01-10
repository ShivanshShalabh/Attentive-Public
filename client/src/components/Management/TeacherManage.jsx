import React, { useEffect } from "react";
import { connect } from "react-redux";
import { getAllTeachers } from "../../actions/school";
import { actionMembers } from "../../actions/school";
import PropTypes from "prop-types";
import Spinner from "../Spinner";
import {
  APPROVE,
  REJECT,
  DELETE,
  BLOCK_UNVERIFIED,
  BLOCK_VERIFIED,
  UNBLOCK,
} from "../../utils/actionTypes";
import "./../../styles/table.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleCheck,
  faCircleXmark,
  faBan,
  faTrashAlt,
  faThumbsUp
} from "@fortawesome/free-solid-svg-icons";

const TeacherManage = ({ getAllTeachers, school, user, actionMembers }) => {
  const TEACHERS = "teachers";
  useEffect(() => {
    getAllTeachers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const actionButton = (teacherId, action) =>
  (
    <FontAwesomeIcon style={{ margin: 10 }}
      icon={action === APPROVE ? faCircleCheck : action === REJECT ? faCircleXmark : action === DELETE ? faTrashAlt : action === BLOCK_UNVERIFIED ? faBan : action === BLOCK_VERIFIED ? faBan : action === UNBLOCK ? faThumbsUp : ""}
      className={action === APPROVE ? "green" : action === REJECT ? "red" : action === DELETE ? "red" : action === BLOCK_UNVERIFIED ? "red" : action === BLOCK_VERIFIED ? "red" : action === UNBLOCK ? "green" : ""}
      onClick={() => {
        if (
          window.confirm(
            `Are you sure you want to ${action.toLowerCase()} this teacher?`
          )
        ) {
          actionMembers({
            memberId: teacherId,
            memberType: TEACHERS,
            actionType: action,
          });
        }
      }}
    >iconName</FontAwesomeIcon>
  );


  return !user.loading && user.school && !school.loadingTeachers ? (
    <div className="cnt-wrapper cnt-1">
      <h2>Manage Teachers</h2>

      <div>
        <h3>Unverified Teachers</h3>
        {school.teachers.unverified.length ?
          (<table>
            <tr>
              <th className="name">Name</th>
              <th className="email">Email</th>
              <th className="btn">Approve</th>
              <th className="btn">Reject</th>
              <th className="btn">Block</th>
            </tr>
            {school.teachers.unverified.map((teacher) => {
              return (
                <tr key={teacher.id}>
                  <td className="name">{teacher.name}</td>
                  <td className="email">{teacher.email}</td>
                  <td className="btn">  {actionButton(teacher.id, APPROVE)}</td>
                  <td className="btn">  {actionButton(teacher.id, REJECT)}</td>
                  <td className="btn">  {actionButton(teacher.id, BLOCK_UNVERIFIED)}</td>

                </tr>
              );
            })}
          </table>) : (<p className="note">No unverified teachers</p>)}
      </div>
      <div>
        <h3>Verified Teachers</h3>
        {school.teachers.verified.length ?
          (<table>
            <tr>
              <th className="name">Name</th>
              <th className="email">Email</th>
              <th className="btn">Delete</th>
              <th className="btn">Block</th>
            </tr>
            {school.teachers.verified.map((teacher) => {
              return (
                <tr key={teacher.id}>
                  <td className="name">{teacher.name}</td>
                  <td className="email">{teacher.email}</td>
                  <td className="btn">  {actionButton(teacher.id, DELETE)}</td>
                  <td className="btn">  {actionButton(teacher.id, BLOCK_VERIFIED)}</td>
                </tr>
              );
            })}
          </table>) : (<p className="note">No verified teachers</p>)}
      </div>
      <div>
        <h3>Blocked Teachers</h3>
        {school.teachers.blocked.length ?
          (<table>
            <tr>
              <th className="name">Name</th>
              <th className="email">Email</th>
              <th className="btn">Unblock</th>
            </tr>
            {school.teachers.blocked.map((teacher) => {
              return (
                <tr key={teacher.id}>
                  <td className="name">{teacher.name}</td>
                  <td className="email">{teacher.email}</td>
                  <td className="btn">  {actionButton(teacher.id, UNBLOCK)}</td>
                </tr>
              );
            })}
          </table>) : (<p className="note">No blocked teachers</p>)}
      </div>
    </div>
  ) : (
    <Spinner />
  );
};

TeacherManage.propTypes = {
  getAllTeachers: PropTypes.func.isRequired,
  actionMembers: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  school: state.school,
  user: state.auth.user,
});

export default connect(mapStateToProps, {
  getAllTeachers,
  actionMembers,
})(TeacherManage);
