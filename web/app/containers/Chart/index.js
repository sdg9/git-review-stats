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
import { exportData } from '../../utils/exportCSV';

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

    // const curve = this.state.curve; // Number of "top active people" to toss when trying to find a 100% baseline
    // const maxTotalActivity = totalActivityArray.sort((a, b) => (b - a))[curve];

    const columns = [
      {
        Header: '#',
        sortable: false,
        accessor: 'name.value',
        width: 30,
        Cell: row => (<div>{row.viewIndex + 1}</div>),
      },
      {
        Header: 'Github',
        columns: [
          {
            Header: 'ID',
            accessor: 'name.value', // String-based value accessors!
            width: 80,
            filterable: true,
            filterMethod: (filter, row, column) => {
              const filterValue = filter.value !== undefined && filter.value.toLowerCase();
              const name = idToName(row['name.value']);
              const nameLower = name && name.toLowerCase();
              return name !== undefined ? String(nameLower).startsWith(filterValue) : true;
            },
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
            width: 100,
            sortMethod,
            Cell: (row) => {
              // console.log('Row: ', row);
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
            width: 60,
            // Cell: row => <div>hi</div>,
            sortMethod,
            Cell: this.rowWithBackground,
          },
          {
            Header: 'Comments',
            accessor: 'commentsPerDay',
            width: 90,
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
            width: 80,
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
            width: 60,
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
            width: 60,
            sortMethod,
            Cell: this.rowWithNoBackground,
          },
          {
            Header: 'Comments',
            accessor: 'commentsGiven',
            width: 90,
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
            width: 70,
            sortMethod,
            Cell: this.inverseRowWithBackground,
          },
          {
            Header: 'Blocked/PR',
            accessor: 'changeRequestReceivedPerPR',
            width: 90,
            sortMethod,
            Cell: this.inverseRowWithBackground,
          },
          {
            Header: 'Comments',
            accessor: 'commentsReceived',
            width: 90,
            sortMethod,
            // Cell: this.inverseRowWithBackground,
            Cell: this.rowWithNoBackground,
          },
          {
            Header: 'Comt/PR',
            accessor: 'commentsReceivedPerPR',
            width: 90,
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
            Header: 'Merged',
            accessor: 'pullRequestsMerged',
            width: 70,
            sortMethod,
            // Cell: this.rowWithBackground,
            Cell: this.rowWithNoBackground,
          },
          {
            Header: 'Open',
            accessor: 'pullRequestsOpened',
            width: 60,
            sortMethod,
            // Cell: this.rowWithBackground,
            Cell: this.rowWithNoBackground,
          },
          {
            Header: 'Closed',
            accessor: 'pullRequestsClosed',
            width: 60,
            sortMethod,
            // Cell: this.rowWithBackground,
            Cell: this.rowWithNoBackground,
          },
          {
            Header: 'Merged Other',
            accessor: 'merged',
            width: 110,
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
          <Button
          onClick={() => {
            const data = this.reactTable.getResolvedState();
            // console.log(data);
            // exportData();
            const csv = exportData(data);
            if (csv) {
              this.setState({
                showDownload: true,
                download: csv,
              });
            }
          }}
          >Generate Excel</Button>
          {
            this.state.showDownload ? <a href={`data:text/csv;base64,${window.btoa(this.state.download)}`} >Download</a> : null
          }

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
          ref={table => (this.reactTable = table)}
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
