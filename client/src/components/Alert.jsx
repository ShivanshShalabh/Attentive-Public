import React from 'react';
import { connect } from 'react-redux';

// * Use: Alert component
// * Desc: Displays the alerts to the user
// * Access: Public
// * Testing: Passed ✔ (09-04-2022)
const Alert = ({ alerts }) => alerts?.length > 0 && alerts.map(alert => (
    <div key={alert.id} className={`alert ${alert.alertType} cnt-1`}>
        {alert.msg}
    </div>
));

const mapStateToProps = state => ({
    alerts: state.alert
});

export default connect(mapStateToProps)(Alert);