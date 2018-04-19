import './DatasetOverviewWidget.scss';

import moment from 'moment';
import React from 'react';
import { Glyphicon } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { updateSelectedToDate, updateSelectedFromDate } from '../../containers/App/actions';

// import SelectedUsers from '../model/SelectedUsers';


const mapStateToProps = (state => ({
  dates: state.getIn(['global', 'dates']).toJS(),
  // isDirty: _.get(state, 'core.navigation.routing.isDirty', false),
  // username: _.get(state, 'bank.auth.resetPassword.credential.username', ''),
}));

const mapDispatchToProps = dispatch => ({
  updateDates: bindActionCreators({ updateSelectedToDate, updateSelectedFromDate }, dispatch),
  // resetPasswordActions: bindActionCreators(resetPasswordActions, dispatch),
  // routeActions: bindActionCreators(routeActions, dispatch),
  // trackingActions: bindActionCreators(trackingActions, dispatch),
});
class DatasetOverviewWidget extends React.Component {
  constructor(props) {
    super(props);
    this.handleChangeFrom = this.handleChangeFrom.bind(this);
    this.handleChangeTo = this.handleChangeTo.bind(this);
  }

  handleChangeFrom(date) {
    this.props.updateDates.updateSelectedFromDate(date.format('YYYY-MM-DD'));
  }

  handleChangeTo(date) {
    this.props.updateDates.updateSelectedToDate(date.format('YYYY-MM-DD'));
  }


  renderDate(date) {
    if (date) {
      return moment(date).format('YYYY-MM-DD');
    }
    return '\u2013';
  }

  // renderUserCount() {
  //   const userSelection = this.state.selectedUsers;
  //   if (userSelection) {
  //     return `${userSelection.getSelectedUserCount()} / ${userSelection.getTotalUserCount()}`;
  //   }
  //   return '\u2013';
  // }

  render() {
    // console.log('Dates: ', this.props.dates);
    return (
      <table className="filterBox">
        <tbody>
          <tr>
            <th><Glyphicon glyph="calendar" />From:</th>
            <td className="filterBoxValue">
              <DatePicker
                minDate={moment(this.props.dates.oldestFromDate)}
                maxDate={moment(this.props.dates.newestToDate)}
                selected={moment(this.props.dates.selectedFromDate)}
                onChange={this.handleChangeFrom}
              />
            </td>
          </tr>
          <tr>
            <th><Glyphicon glyph="calendar" />To:</th>
            <td className="filterBoxValue">
              <DatePicker
                minDate={moment(this.props.dates.oldestFromDate)}
                maxDate={moment(this.props.dates.newestToDate)}
                selected={moment(this.props.dates.selectedToDate)}
                onChange={this.handleChangeTo}
              />
            </td>
          </tr>
          { /*
          <tr>
            <th><Glyphicon glyph="user" />Users in analysis:</th>
            { // <td className="filterBoxValue">{this.renderUserCount()}</td>
            }
          </tr>
          */ }
        </tbody>
      </table>
    );
  }
}

DatasetOverviewWidget.displayName = 'DatasetOverviewWidget';

DatasetOverviewWidget.defaultProps = {
  datasetOverview: {
    branchList: [],
    fromDate: 0,
    toDate: 0,
  },
  selectedUsers: null,
};

DatasetOverviewWidget.propTypes = {
  dates: React.PropTypes.object,
    // selectedUsers: React.PropTypes.instanceOf(SelectedUsers).isRequired
};

export default connect(mapStateToProps, mapDispatchToProps)(DatasetOverviewWidget);
