this.inverseRowWithBackground;// @flow
/**
 * RepoListItem
 *
 * Lists the name and the issue count of a repository
 */

import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { Button } from 'react-bootstrap';
// import { connect } from 'react-redux';
// import { bindActionCreators } from 'redux';
import { createStructuredSelector } from 'reselect';
import { FormattedNumber } from 'react-intl';
import { Table, Thead, Th, Tr } from 'reactable';
import _ from 'lodash';
import ReactTable from 'react-table';
import {
  makeSelectRepos,
  makeSelectLoading,
  makeSelectError,
  makeSelectReviewData,
  makeSortedDates,
} from 'containers/App/selectors';
import { makeSelectCurrentUser } from 'containers/App/selectors';

import 'react-table/react-table.css';

import { numberToColorHsl } from '../../utils/math';
import { idToName } from '../../utils/string';

import type {
  PullRequestData,
  ReviewData,
} from '../../types';

import secrets from '../../../../lib/secrets';

type Props = {
  data: ReviewData
}
type State = {
  curve: number,
  useHeatmap: boolean,
}

// const RowWithBackground = row => (
//   <div style={{
//     backgroundColor: numberToColorHsl(row.tier * 100),
//   }}>
//     {row.value}
//   </div>
// );
// const RowWithBackground = row => (
//   <div style={{
//     backgroundColor: numberToColorHsl(row.tier * 100),
//   }}>
//     {row.value}
//   </div>
// );
//

// const RowWithBackground = row => <div style={{ backgroundColor: numberToColorHsl(row.tier * 100) }}>{row.value}</div>;

const sortMethod = (a, b, desc) => a.value - b.value;

export class Chart extends React.PureComponent<Props, State> { // eslint-disable-line react/prefer-stateless-function

  constructor() {
    super();
    this.state = {
      curve: 4,
      useHeatmap: false,
    };
    this.rowWithBackground = this.rowWithBackground.bind(this);
    this.inverseRowWithBackground = this.inverseRowWithBackground.bind(this);
  }

  rowWithNoBackground({ value }) {
    return <div>{value.value}</div>;
  }
  rowWithBackground({ value }) {
    return this.state.useHeatmap ?
      <div style={{ backgroundColor: numberToColorHsl(value.tier * 100) }}>{value.value}</div>
      :
      <div>{value.value}</div>;
  }

  inverseRowWithBackground({ value }) {
    return this.state.useHeatmap ?
    <div style={{ backgroundColor: numberToColorHsl(100 - (value.tier * 100)) }}>{value.value}</div>
    :
    <div>{value.value}</div>;
  }

  render() {
    const arrayData = [];

    const { userData } = this.props.data;
    const data = userData;

    const totalActivityArray = [];

    _.forEach(data, (value, key) => {
      if (secrets.blacklistUsers && secrets.blacklistUsers.includes(key)) {
        // TODO skip user
        return;
      }

      const totalActivity = value.approved.value + value.changesRequestedGiven.value + value.commentsGiven.value;
      totalActivityArray.push(totalActivity);

      // TODO consider moving this to selector
      arrayData.push(value);
    });

    const curve = this.state.curve; // Number of "top active people" to toss when trying to find a 100% baseline
    // const maxTotalActivity = totalActivityArray.sort((a, b) => (b - a))[curve];

    const columns = [
      {
        Header: 'Github',
        columns: [
          {
            Header: 'ID',
            accessor: 'name.value', // String-based value accessors!
            Cell: row => (<Link to={`user/${row.value}`}>{idToName(row.value)}</Link>),
          },
        ],
      },
      {
        Header: 'Total Activity',
        columns: [
          {
            Header: 'Percentile',
            accessor: 'totalActivity',
            sortMethod,
            Cell: (row) => {
              const { value, tier } = row.value;
              // console.log('Row: ', row);
              // const percentile = row.value / maxTotalActivity * 100;
              const percentile = tier * 100;
              return (
                <div
                  style={{
                    width: '100%',
                    height: '100%',
                    backgroundColor: '#dadada',
                    borderRadius: '2px',
                  }}
                >
                  <div
                    style={{
                      width: `${percentile}%`,
                      height: '100%',
                      backgroundColor: numberToColorHsl(percentile),
                      // backgroundColor: percentile > 66 ? '#85cc00'
                      // : percentile > 50 ? '#b7cc00'
                      // : percentile > 33 ? '#ffbf00'
                      // : '#ff2e00',
                      borderRadius: '2px',
                      transition: 'all .2s ease-out',
                    }}
                  />
                </div>
              );
            },
          },
        ],
      },
      {
        Header: 'Given / Day',
        columns: [
          // {
          //   Header: 'Total Activity',
          //   accessor: 'activityPerDay',
          // },
          {
            Header: 'Review',
            accessor: 'reviewPerDay',
            // Cell: row => <div>hi</div>,
            sortMethod,
            Cell: this.rowWithBackground,
          },
          {
            Header: 'Comments',
            accessor: 'commentsPerDay',
            sortMethod,
            Cell: this.rowWithBackground,
          },
        ],
      },
      {
        Header: 'Review Given',
        columns: [
          {
            Header: '1st or 2nd',
            accessor: 'firstTwoToApprove',
            sortMethod,
            Cell: this.rowWithBackground,
          },
          // {
          //   Header: '1st',
          //   accessor: 'approvalGivenFirst',
          // },
          // {
          //   Header: '2nd',
          //   accessor: 'approvalGivenSecond',
          // },
          // {
          //   Header: '3rd+',
          //   accessor: 'approvalGivenAfterTwoApprovals',
          // },
          {
            Header: 'Total',
            accessor: 'approved',
            sortMethod,
            Cell: this.rowWithBackground,
          },
          // {
          //   Header: 'Too Early/PR',
          //   accessor: 'approvedBeforeChangeRequestPerPR',
          // },
          {
            Header: 'Block',
            accessor: 'changesRequestedGiven',
            sortMethod,
            Cell: this.rowWithNoBackground,
          },
          {
            Header: 'Comments',
            accessor: 'commentsGiven',
            sortMethod,
            Cell: this.rowWithBackground,
          },
          // {
          //   Header: 'Comments/Approval',
          //   accessor: 'commentsGivenPerApproval',
          //   sortMethod,
          //   Cell: this.rowWithBackground,
          // },
          // {
          //   Header: 'Approve Too Early',
          //   accessor: 'approvedBeforeChangeRequestGivenBySomeoneElse',
          // },
        ],
      },
      // {
      //   Header: 'Chng Req after Approval',
      //   columns: [
      //     {
      //       Header: 'Total',
      //       accessor: 'approvedBeforeChangeRequestGivenBySomeoneElse',
      //     },
      //     {
      //       Header: 'Avg/PR',
      //       accessor: 'approvedBeforeChangeRequestPerPR',
      //     },
      //   ],
      // },
      {
        Header: 'Review Received',
        columns: [
          // {
          //   Header: 'Given',
          //   accessor: 'changesRequestedGiven',
          // },
          {
            Header: 'Blocked',
            accessor: 'changesRequestedReceived',
            sortMethod,
            Cell: this.inverseRowWithBackground,
          },
          {
            Header: 'Blocked/PR',
            accessor: 'changeRequestReceivedPerPR',
            sortMethod,
            Cell: this.inverseRowWithBackground,
          },
          {
            Header: 'Comments',
            accessor: 'commentsReceived',
            sortMethod,
            // Cell: this.inverseRowWithBackground,
            Cell: this.rowWithNoBackground,
          },
          {
            Header: 'Comments/PR',
            accessor: 'commentsReceivedPerPR',
            sortMethod,
            Cell: this.inverseRowWithBackground,
          },
        ],
      },
      // {
      //   Header: 'Comments',
      //   columns: [
      //     {
      //       Header: 'Given',
      //       accessor: 'commentsGiven',
      //     },
      //     {
      //       Header: 'Given/Approval',
      //       accessor: 'commentsGivenPerApproval',
      //     },
      //     {
      //       Header: 'Received',
      //       accessor: 'commentsReceived',
      //     },
      //     {
      //       Header: 'Received/PR',
      //       accessor: 'commentsReceivedPerPR',
      //     },
      //   ],
      // },
      {
        Header: 'PRs',
        columns: [
          {
            Header: 'Complete',
            accessor: 'pullRequestsSubmitted',
            sortMethod,
            // Cell: this.rowWithBackground,
            Cell: this.rowWithNoBackground,
          },
          // {
          //   Header: 'Merged',
          //   accessor: 'merged',
          // },
        ],
      },
    ];

    return (
      <div>
        <form>
          <label>
          <Button
          onClick={() => {
            this.setState(state => ({ useHeatmap: !state.useHeatmap }));
          }}
          >Toggle Heatmap</Button>
          { /*
          Curve:
          <input
            value={this.state.curve}
            type="number"
            name="Curve"
            onChange={(event) => {
              this.setState({ curve: event.target.value });
            }}
          />
          */ }
          </label>
        </form>
        <ReactTable
          data={arrayData}
          columns={columns}
          showPagination={false}
          defaultPageSize={arrayData.length}
          defaultSortDesc
        />
      </div>
    );
  }
}
const mapStateToProps = (state, ownProps) => ({
  data: makeSelectReviewData(ownProps.startDate, ownProps.endDate)(state),
});
export default connect(mapStateToProps)(Chart);
