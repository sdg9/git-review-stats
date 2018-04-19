// @flow
/**
*
* ReviewReceivedPanel
*
*/

import React from 'react';

import ClearFloat from '../ClearFloat';
import Panel from '../Panel';
import NumberPanel from '../NumberPanel';
import HorizontalCenterDiv from '../HorizontalCenterDiv';
// import styled from 'styled-components';
import { getAverage } from '../../utils/math';

import type {
  ReviewData,
  PathMatch,
} from '../../types';

type Props = {
  match: PathMatch,
  reviewData: ReviewData,
  user: string,
}

class ReviewsReceivedPanel extends React.PureComponent<Props> { // eslint-disable-line react/prefer-stateless-function
  render() {
    const user = this.props.user;
    const data = this.props.reviewData.userData[user];
    return (
      <Panel title="Reviews received" size="third">
        <HorizontalCenterDiv>
        <NumberPanel
          title="PRs"
          tooltip="Total pull requests completed by this user."
          value={data.pullRequestsSubmitted.value}
        />
        </HorizontalCenterDiv>
        <ClearFloat />
        <NumberPanel
          title="change request/PR"
          tooltip="Number of change requests received by this user per PR. A higher number may indicate the user is missing things in self review."
          value={data.changeRequestReceivedPerPR.value}
        />
        <NumberPanel
          title="Change Requests"
          tooltip="Number of change requests received by this user."
          value={data.changesRequestedReceived.value}
        />
        <ClearFloat />
        <NumberPanel
          title="comments/PR"
          tooltip="Number of comments received by this user per PR. A higher number may indicate the user's code is not clearly explained."
          value={data.commentsReceivedPerPR.value}
        />
        <NumberPanel
          title="Comments"
          tooltip="Comments received by this user."
          value={data.commentsReceived.value}
        />
        <ClearFloat />
        <NumberPanel
          title="Approvals/PR"
          tooltip="Number of approval reviews received by this user per PR."
          value={data.approvalsReceivedPerPR.value}
        />
        <NumberPanel
          title="Approvals"
          tooltip="Number of approval reviews received by this user."
          value={data.approvalsReceived.value}
        />
      </Panel>
    );
  }
}

export default ReviewsReceivedPanel;
