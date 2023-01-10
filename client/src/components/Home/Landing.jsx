import overlay1 from '../../images/overlay1.svg';
import overlay2 from '../../images/overlay2.svg';
import meetingImg from '../../images/meeting.svg';
import React from 'react';
import { connect } from "react-redux";
import { TEACHER, STUDENT } from "../../utils/userTypes";
// * Use: Landing component
// * Desc: Landing poster for the application
// * Access: Public
// * Testing: Passed ✔ (09-04-2022)

const Landing = ({ auth: { isAuthenticated, loading, user } }) =>
    <div className="box">
        <img src={overlay1} alt="" id="home-overlay" />
        <img src={overlay2} alt="" id="home-overlay2" />

        <div className="left">
            <h5 className='tagline'>Be attentive with <span className="heading">Attentive</span></h5>

            <div className="menu">
                {!loading && !isAuthenticated ? (
                    <>

                        <a className="button-morphism" href="/signup">Sign Up</a>

                        <a className="button-morphism" href="/login">Log In</a>
                    </>) : user.type === TEACHER ? (
                        <>
                            <a className="button-morphism" href="/meeting/join"
                            >Join Meeting <i className="fas fa-phone-alt"></i
                            ></a>
                            <a className="button-morphism" href="/meeting/new"
                            >New Meeting <i className="fas fa-pen"></i></a>
                        </>
                    ) : user.type === STUDENT ?
                    <>
                        <a className="button-morphism" href="/meeting/join"
                        >Join Meeting <i className="fas fa-phone-alt"></i
                        ></a>
                        <a className="button-morphism" href="/meetings"
                        >My Classroom <i className="fas fa-phone-alt"></i
                        ></a>
                    </>
                    : null
                }
            </div>
        </div>
        <div className="right">
            <img src={meetingImg} alt="" />

        </div>
    </div>;

const mapStateToProps = (state) => ({ auth: state.auth, });
export default connect(mapStateToProps, null)(Landing);
