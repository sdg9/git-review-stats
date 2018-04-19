// @flow
/**
 *
 * UserPage
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import { FormattedMessage } from 'react-intl';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import { InteractiveForceGraph, ForceGraphArrowLink, ForceGraph, ForceGraphNode, ForceGraphLink } from 'react-vis-force';
import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import {
  makeIdentityGraph,
  makeSortedDates,
  makeSelectReviewData,
} from 'containers/App/selectors';

import makeSelectUserPage from './selectors';
import reducer from './reducer';
import saga from './saga';
import messages from './messages';

import ClearFloat from 'components/ClearFloat';
import ReviewsGivenPanel from 'components/ReviewsGivenPanel';
import ReviewsReceivedPanel from 'components/ReviewsReceivedPanel';
import CommitsPanel from 'components/CommitsPanel';
import TeamGraphView from 'components/TeamGraphView';
import PageHeader from 'components/PageHeader';
import NavigationBar from 'components/NavigationBar';
import InteractiveForceGraphWidget from 'components/InteractiveForceGraphWidget';

import type {
  ReviewData,
  SortedDates,
  IdentityGraphData,
  PathMatch,
} from '../../types';

type Props = {
  match: PathMatch,
  identityGraphData: IdentityGraphData,
  reviewData: ReviewData,
  sortedDates: SortedDates,
}
type State = {
  selectedUserOnGraph?: string,
}

export class UserPage extends React.PureComponent<Props, State> { // eslint-disable-line react/prefer-stateless-function

  constructor(props: Props) {
    super(props);
    this.state = {
      selectedUserOnGraph: undefined,
    };
  }

  render() {
    const user = this.state.selectedUserOnGraph || this.props.match.params.name;
    // const reviewees = this.props.identityGraphData.links[user];
    return (
      <div>
        <PageHeader
          showBackButton
          subtitle={user}
          datasetOverview={{
            fromDate: this.props.sortedDates.head,
            toDate: this.props.sortedDates.last,
          }}
        />
        <NavigationBar />

        <ReviewsGivenPanel
          {...this.props}
          user={user}
          />
        <ReviewsReceivedPanel
          {...this.props}
          user={user}
        />
        <InteractiveForceGraphWidget
          defaultSelectedNode={user}
          identityGraphData={this.props.identityGraphData}
          aggregatedData={this.props.reviewData.aggregatedData}
          userData={this.props.reviewData.userData}
          onSelectNode={(node) => {
            this.setState({ selectedUserOnGraph: node.id });
          }}
          onDeselsectNode={(node) => {
            this.setState({ selectedUserOnGraph: undefined });
          }}
        />
        <ClearFloat />

        { /* <CommitsPanel {...this.props} /> */
        }
        { /* <TeamGraphView {...this.props} /> */ }

      </div>
    );
  }
}

const mapStateToProps = state => ({
  sortedDates: makeSortedDates()(state),
  reviewData: makeSelectReviewData()(state),
  identityGraphData: makeIdentityGraph()(state),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  };
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);

const withReducer = injectReducer({ key: 'userPage', reducer });
const withSaga = injectSaga({ key: 'userPage', saga });

export default compose(
  withReducer,
  withSaga,
  withConnect,
)(UserPage);
