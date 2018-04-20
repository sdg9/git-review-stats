// @flow
/**
*
* ReviewsGivenPanel
*
*/
import React from 'react';

import ClearFloat from '../ClearFloat';
import Panel from '../Panel';
import NumberPanel from '../NumberPanel';
import { getAverage, getPercentage } from '../../utils/math';
import HorizontalCenterDiv from '../HorizontalCenterDiv';

import type {
  ReviewData,
  PathMatch,
} from '../../types';

type Props = {
  // match: PathMatch,
  user: string,
  reviewData: ReviewData,
}

class ReviewsGivenPanel extends React.PureComponent<Props> { // eslint-disable-line react/prefer-stateless-function
  render() {
    const user = this.props.user;
    const data = this.props.reviewData.userData[user];
    return (
      <Panel title="Reviews given" size="third">

        <HorizontalCenterDiv>
        <NumberPanel
          title="Total Review"
          tooltip="Total approvals or changes given by user in PR review."
          value={data.approved.value + data.changesRequestedGiven.value}
        />
        </HorizontalCenterDiv>

        <NumberPanel
          title="Approvals"
          tooltip="Total Approvals given in PR review."
          value={data.approved.value}
          rank={data.approved.rank}
        />
        <NumberPanel
          title="Change Requests"
          tooltip="Total change requests given in PR review."
          value={data.changesRequestedGiven.value}
          rank={data.changesRequestedGiven.rank}
        />
        <NumberPanel
          title="comments written"
          tooltip="Number of review comments written to others by this user."
          value={data.commentsGiven.value}
          rank={data.commentsGiven.rank}
        />
        <NumberPanel
          title="comments / review"
          tooltip="How many comments this user wrote to others, per approval. A higher number indicates that the user tends to respond often to review with written feedback."
          value={data.commentsGivenPerApproval.value}
          rank={data.commentsGivenPerApproval.rank}
        />
        <NumberPanel
          title="1st"
          tooltip="Number of first to approve reivews."
          value={data.approvalGivenFirst.value}
          rank={data.approvalGivenFirst.rank}
        />
        <NumberPanel
          title="2nd"
          tooltip="Number of second to approve reviews."
          value={data.approvalGivenSecond.value}
          rank={data.approvalGivenSecond.rank}
        />
        <NumberPanel
          title="3rd+"
          tooltip="Number of third or later to approve reviews."
          value={data.approvalGivenAfterTwoApprovals.value}
          rank={data.approvalGivenAfterTwoApprovals.rank}
        />
        <ClearFloat />
        <NumberPanel
          title="Early Approval"
          tooltip="Total times user approved a PR, that later another dev requested changes."
          value={data.approvedBeforeChangeRequestGivenBySomeoneElse.value}
          rank={data.approvedBeforeChangeRequestGivenBySomeoneElse.rank}
        />
        <NumberPanel
          title="Early Approval/Review"
          tooltip="Percentage of how often user approves first or second compared to how often someone later comes in and requests changes. A higher percentage may indicate the user is not thoroughly reviewing PRs before approving."
          value={`${Math.round(data.approvedBeforeChangeRequestPerPR.value * 100)}%`}
          rank={data.approvedBeforeChangeRequestPerPR.rank}
        />

        { /*
        <NumberPanel
          title="1"
          tooltip="Number of first to approve reivews."
          value={data.approvalGivenFirst}
        />
        <NumberPanel
          title="2"
          tooltip="Number of second to approve reviews."
          value={data.approvalGivenSecond}
        />
        <NumberPanel
          title="3+"
          tooltip="Number of third or later to approve reviews."
          value={data.approvalGivenAfterTwoApprovals}
        />
        */ }
      </Panel>
    );
  }
}

export default ReviewsGivenPanel;
