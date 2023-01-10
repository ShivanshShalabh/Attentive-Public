import React, { useEffect } from "react";
import { connect } from "react-redux";
import { getClassroom } from "../../actions/classroom";
import { actionMembers } from "../../actions/classroom";
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
import "./../../styles/table.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleCheck,
  faCircleXmark,
  faBan,
  faTrashAlt,
  faThumbsUp
} from "@fortawesome/free-solid-svg-icons";

const ClassroomMemberManage = ({ getClassroom, classroom, user, actionMembers }) => {
  const STUDENTS = "students";
  const TEACHERS = "teachers";
  useEffect(() => {
    getClassroom();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const actionButton = (memberId, action, memberType) => (
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
              memberId: memberId,
              memberType: memberType,
              actionType: action,
            });
          }
        }}
      >iconName</FontAwesomeIcon>
    )
  );

  return !user.loading && user.school && !classroom.loadingStudents ? (
    <div className="cnt-wrapper cnt-1">
      <h2>Manage Students</h2>

      <div>
        <h3>Unverified Students</h3>
        {classroom.students.unverified.length ?
          (<table>
            <tr>
              <th className="name">Name</th>
              <th className="email">Email</th>
              <th className="btn">Approve</th>
              <th className="btn">Reject</th>
              <th className="btn">Block</th>
            </tr>
            {classroom.students.unverified.map((student) => {
              return (
                <tr key={student.id}>
                  <td className="name">{student.name}</td>
                  <td className="email">{student.email}</td>
                  <td className="btn">  {actionButton(student.id, APPROVE, STUDENTS)}</td>
                  <td className="btn">  {actionButton(student.id, REJECT, STUDENTS)}</td>
                  <td className="btn">  {actionButton(student.id, BLOCK_UNVERIFIED, STUDENTS)}</td>
                </tr>
              );
            })}
          </table>) : (<p className="note">No unverified students</p>)}
      </div>
      <div>
        <h3>Verified Students</h3>
        {classroom.students.verified.length ?
          (<table>
            <tr>
              <th className="name">Name</th>
              <th className="email">Email</th>
              <th className="btn">Delete</th>
              <th className="btn">Block</th>
            </tr>
            {classroom.students.verified.map((student) => {
              return (
                <tr key={student.id}>
                  <td className="name">{student.name}</td>
                  <td className="email">{student.email}</td>
                  <td className="btn">  {actionButton(student.id, DELETE, STUDENTS)}</td>
                  <td className="btn">  {actionButton(student.id, BLOCK_VERIFIED, STUDENTS)}</td>
                </tr>
              );
            })}
          </table>) : (<p className="note">No verified students</p>)}
      </div>
      <div>
        <h3>Blocked Students</h3>
        {classroom.students.blocked.length ?
          (<table>
            <tr>
              <th className="name">Name</th>
              <th className="email">Email</th>
              <th className="btn">Unblock</th>
            </tr>
            {classroom.students.blocked.map((student) => {
              return (
                <tr key={student.id}>
                  <td className="name">{student.name}</td>
                  <td className="email">{student.email}</td>
                  <td className="btn">  {actionButton(student.id, UNBLOCK, STUDENTS)}</td>
                </tr>
              );
            })}
          </table>) : (<p className="note">No blocked students</p>)}
      </div>
      <hr className="half-breaker" />
      <h2>Manage Teachers</h2>
      <div>
        <h3>Unverified Teachers</h3>
        {classroom.teachers.unverified.length ?
          (<table>
            <tr>
              <th className="name">Name</th>
              <th className="email">Email</th>
              <th className="btn">Approve</th>
              <th className="btn">Reject</th>
              <th className="btn">Block</th>
            </tr>
            {classroom.teachers.unverified.map((teacher) => {
              return (
                <tr key={teacher.id}>
                  <td className="name">{teacher.name}</td>
                  <td className="email">{teacher.email}</td>
                  <td className="btn">  {actionButton(teacher.id, APPROVE, TEACHERS)}</td>
                  <td className="btn">  {actionButton(teacher.id, REJECT, TEACHERS)}</td>
                  <td className="btn">  {actionButton(teacher.id, BLOCK_UNVERIFIED, TEACHERS)}</td>

                </tr>
              );
            })}
          </table>) : (<p className="note">No unverified teachers</p>)}
      </div>
      <div>
        <h3>Verified Teachers</h3>
        {classroom.teachers.verified.length ?
          (<table>
            <tr>
              <th className="name">Name</th>
              <th className="email">Email</th>
              <th className="btn">Delete</th>
              <th className="btn">Block</th>
            </tr>
            {classroom.teachers.verified.map((teacher) => {
              return (
                <tr key={teacher.id}>
                  <td className="name">{teacher.name}</td>
                  <td className="email">{teacher.email}</td>
                  <td className="btn">  {actionButton(teacher.id, DELETE, TEACHERS)}</td>
                  <td className="btn">  {actionButton(teacher.id, BLOCK_VERIFIED, TEACHERS)}</td>
                </tr>
              );
            })}
          </table>) : (<p className="note">No verified teachers</p>)}
      </div>
      <div>
        <h3>Blocked Teachers</h3>
        {classroom.teachers.blocked.length ?
          (<table>
            <tr>
              <th className="name">Name</th>
              <th className="email">Email</th>
              <th className="btn">Unblock</th>
            </tr>
            {classroom.teachers.blocked.map((teacher) => {
              return (
                <tr key={teacher.id}>
                  <td className="name">{teacher.name}</td>
                  <td className="email">{teacher.email}</td>
                  <td className="btn">  {actionButton(teacher.id, UNBLOCK, TEACHERS)}</td>
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

ClassroomMemberManage.propTypes = {
  getClassroom: PropTypes.func.isRequired,
  actionMembers: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  classroom: state.classroom,
  user: state.auth.user,
});

export default connect(mapStateToProps, {
  getClassroom,
  actionMembers,
})(ClassroomMemberManage);
