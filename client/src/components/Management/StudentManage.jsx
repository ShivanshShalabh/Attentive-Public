import React, { useEffect } from "react";
import { connect } from "react-redux";
import { getAllStudents } from "../../actions/school";
import { actionMembers } from "../../actions/school";
import Spinner from "../Spinner";
import PropTypes from "prop-types";
import {
  APPROVE,
  REJECT,
  DELETE,
  BLOCK_UNVERIFIED,
  BLOCK_VERIFIED,
  UNBLOCK,
} from "../../utils/actionTypes";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleCheck,
  faCircleXmark,
  faBan,
  faTrashAlt,
  faThumbsUp
} from "@fortawesome/free-solid-svg-icons";
import "./../../styles/table.css";

const StudentManage = ({ getAllStudents, school, user, actionMembers }) => {
  const STUDENTS = "students";
  useEffect(() => {
    getAllStudents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const actionButton = (studentId, action) => {
    return (
      <FontAwesomeIcon style={{ margin: 10 }}
        icon={action === APPROVE ? faCircleCheck : action === REJECT ? faCircleXmark : action === DELETE ? faTrashAlt : action === BLOCK_UNVERIFIED ? faBan : action === BLOCK_VERIFIED ? faBan : action === UNBLOCK ? faThumbsUp : ""}
        className={action === APPROVE ? "green" : action === REJECT ? "red" : action === DELETE ? "red" : action === BLOCK_UNVERIFIED ? "red" : action === BLOCK_VERIFIED ? "red" : action === UNBLOCK ? "green" : ""}
        onClick={() => {
          if (
            window.confirm(
              `Are you sure you want to ${action.toLowerCase()} this student?`
            )
          ) {
            actionMembers({
              memberId: studentId,
              memberType: STUDENTS,
              actionType: action,
            });
          }
        }}
      >iconName</FontAwesomeIcon>
    );
  };
  return !user.loading && user.school && !school.loadingStudents ? (
    <div className="cnt-wrapper cnt-1">
      <h2>Manage Students</h2>

      <div>
        <h3>Unverified Students</h3>
        {school.students.unverified.length ?
          (<table>
            <tr>
              <th className="name">Name</th>
              <th className="email">Email</th>
              <th className="btn">Approve</th>
              <th className="btn">Reject</th>
              <th className="btn">Block</th>
            </tr>
            {school.students.unverified.map((student) => {
              return (
                <tr key={student.id}>
                  <td className="name">{student.name}</td>
                  <td className="email">{student.email}</td>
                  <td className="btn">  {actionButton(student.id, APPROVE)}</td>
                  <td className="btn">  {actionButton(student.id, REJECT)}</td>
                  <td className="btn">  {actionButton(student.id, BLOCK_UNVERIFIED)}</td>
                </tr>
              );
            })}
          </table>) : (<p className="note">No unverified students</p>)}
      </div>
      <div>
        <h3>Verified Students</h3>
        {school.students.verified.length ?
          (<table>
            <tr>
              <th className="name">Name</th>
              <th className="email">Email</th>
              <th className="btn">Delete</th>
              <th className="btn">Block</th>
            </tr>
            {school.students.verified.map((student) => {
              return (
                <tr key={student.id}>
                  <td className="name">{student.name}</td>
                  <td className="email">{student.email}</td>
                  <td className="btn">  {actionButton(student.id, DELETE)}</td>
                  <td className="btn">  {actionButton(student.id, BLOCK_VERIFIED)}</td>
                </tr>
              );
            })}
          </table>) : (<p className="note">No verified students</p>)}
      </div>
      <div>
        <h3>Blocked Students</h3>
        {school.students.blocked.length ?
          (<table>
            <tr>
              <th className="name">Name</th>
              <th className="email">Email</th>
              <th className="btn">Unblock</th>
            </tr>
            {school.students.blocked.map((student) => {
              return (
                <tr key={student.id}>
                  <td className="name">{student.name}</td>
                  <td className="email">{student.email}</td>
                  <td className="btn">  {actionButton(student.id, UNBLOCK)}</td>
                </tr>
              );
            })}
          </table>) : (<p className="note">No blocked students</p>)}
      </div>
    </div>
  ) : (
    <Spinner />
  );
};

StudentManage.propTypes = {
  getAllStudents: PropTypes.func.isRequired,
  actionMembers: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  school: state.school,
  user: state.auth.user,
});

export default connect(mapStateToProps, {
  getAllStudents,
  actionMembers,
})(StudentManage);
