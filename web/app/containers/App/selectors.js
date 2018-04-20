// @flow

/**
 * The global state selectors
 */

import { createSelector } from 'reselect';
import _ from 'lodash';
import moment from 'moment';

import type {
  Dates,
  ReduxState,
  GithubReviewData,
  PullRequestData,
  Comment,
  AggregateData,
  ReviewData,
  SortedDates,
  IdentityGraphData,
  Users,
} from '../../types';

import { getAverage } from '../../utils/math';
import { calculateBusinessDays } from '../../utils/calculateBusinessDays';

import secrets from '../../../../lib/secrets';


import { createIdentityGraph } from '../../utils/proximityGraph';

const selectGlobal = (state: ReduxState) => state.get('global');

const selectRoute = (state: ReduxState) => state.get('route');

const makeSelectCurrentUser = () => createSelector(
  selectGlobal,
  globalState => globalState.get('currentUser'),
);

const makeSelectLoading = () => createSelector(
  selectGlobal,
  globalState => globalState.get('loading'),
);

const makeSelectError = () => createSelector(
  selectGlobal,
  globalState => globalState.get('error'),
);

const makeSelectRepos = () => createSelector(
  selectGlobal,
  globalState => globalState.getIn(['userData', 'repositories']),
);

const makeSelectPullRequestData = () => createSelector(
  selectGlobal,
  globalState => globalState.get('pullRequestData').toJS(),
);

const makeSelectLocation = () => createSelector(
  selectRoute,
  routeState => routeState.get('location').toJS(),
);

function getPullRequests(data: GithubReviewData) {
  return data.data.repository.pullRequests.edges;
}

function getReviewsByNumber(data: GithubReviewData, number: number) {
  let approvals = [];
  let requestedChanges = [];
  const comments = [];
  const pullRequest = getPullRequests(data).find(item => item.node.number === number);

  if (pullRequest) {
    let pendingApproval = [];
    const pendingChangeRequested = [];
    let existingApprovals = 0;
    pullRequest.node.reviews.nodes.forEach((review) => {
      const object = {
        login: review.author.login,
        state: review.state,
        createdAt: review.createdAt,
        existingApprovals,
        number: pullRequest.node.number,
      };
      if (review.state === 'APPROVED') {
        existingApprovals += 1;
        pendingApproval.push(object);
      } else if (review.state === 'CHANGES_REQUESTED') {
        pendingChangeRequested.push(object);
        pendingApproval = pendingApproval.map(item => ({
          ...item,
          changeRequestedAfterApproval: true,
        }));
        // Push change requested comments as comments
        review.comments.edges.forEach((comment) => {
          comments.push({
            login: comment.node.author.login,
            createdAt: comment.node.createdAt,
            isChangeRequestedComment: true,
          });
        });
      } else if (review.state === 'COMMENTED') {
        // Push review comments as comments
        comments.push({
          login: review.author.login,
          createdAt: review.createdAt,
          isReviewComment: true,
        });
      } else {
        // console.warn(`Unknown review state: ${review.state}`);
      }
    });

    approvals = approvals.concat(pendingApproval);
    requestedChanges = requestedChanges.concat(pendingChangeRequested);
  }
  return {
    approvals,
    requestedChanges,
    comments,
  };
}

function getCommentsByNumber(data: GithubReviewData, number: number): Array<Comment> {
  const comments = [];

  const pullRequest = getPullRequests(data).find(item => item.node.number === number);
  if (pullRequest) {
    pullRequest.node.comments.edges.forEach((comment) => {
      const object = {
        login: comment.node.author.login,
        createdAt: comment.node.createdAt,
        isNonReviewComment: true,
      };

      comments.push(object);
    });
  }
  return comments;
}

// function getAllComments(data: Reviews) {
//   const comments = [];
//   getPullRequests(data).forEach((pullRequest) => {
//     const object = getCommentsByNumber(data, pullRequest.node.number);
//     comments.push(object);
//   });
//   return comments;
// }

const emptyObject = {
  // Given
  approved: 0,
  changesRequestedGiven: 0,
  approvedBeforeChangeRequestGivenBySomeoneElse: 0,
  commentsGiven: 0,
  pullRequestsSubmitted: 0,
  approvalGivenFirst: 0,
  approvalGivenSecond: 0,
  approvalGivenAfterTwoApprovals: 0,
  merged: 0,
  pullRequestsOpened: 0,
  pullRequestsMerged: 0,
  pullRequestsClosed: 0,

  // Recevied
  approvalsReceived: 0,
  changesRequestedReceived: 0,
  commentsReceived: 0,

  // Built at end
  totalActivity: 0,
  firstTwoToApprove: 0,
  changeRequestReceivedPerPR: 0,
  commentsGivenPerApproval: 0,
  approvedBeforeChangeRequestPerPR: 0,
  commentsReceivedPerPR: 0,
};

export function buildUserData(data: GithubReviewData, businessDays: number): Users {
  const authors = {};

  getPullRequests(data).forEach((pullRequest) => {
    const author = pullRequest.node.author.login;

    if (secrets.blacklistUsers && secrets.blacklistUsers.includes(author)) {
      return;
    }
    const number = pullRequest.node.number;
    if (!authors.hasOwnProperty(author)) {
      authors[author] = {
        ...emptyObject,
      };
    }
    authors[author].pullRequestsSubmitted += 1;
    authors[author].commentsReceived += commentsReceviedByPR(data, number);
    const review = getReviewsByNumber(data, number);
    const comments = getCommentsByNumber(data, number);
    authors[author].approvalsReceived += review.approvals.length;
    authors[author].changesRequestedReceived += review.requestedChanges.length;

    const state = pullRequest.node.state;

    if (state === 'MERGED') {
      authors[author].pullRequestsMerged += 1;
      const mergedByUser = pullRequest.node.mergedBy.login;
      if (!authors.hasOwnProperty(mergedByUser)) {
        authors[mergedByUser] = {
          ...emptyObject,
        };
      }
      authors[mergedByUser].merged += 1;
    } else if (state === 'OPEN') {
      authors[author].pullRequestsOpened += 1;
    } else if (state === 'CLOSED') {
      authors[author].pullRequestsClosed += 1;
    }

    review.approvals.forEach((approval) => {
      const approvalAuthor = approval.login;
      if (secrets.blacklistUsers && secrets.blacklistUsers.includes(approvalAuthor)) {
        return;
      }
      if (!authors.hasOwnProperty(approvalAuthor)) {
        authors[approvalAuthor] = {
          ...emptyObject,
        };
      }
      authors[approvalAuthor].approved += 1;
      if (approval.changeRequestedAfterApproval) {
        authors[approvalAuthor].approvedBeforeChangeRequestGivenBySomeoneElse += 1;
      }
      if (approval.existingApprovals === 0) {
        authors[approvalAuthor].approvalGivenFirst += 1;
      }
      if (approval.existingApprovals === 1) {
        authors[approvalAuthor].approvalGivenSecond += 1;
      }
      if (approval.existingApprovals >= 2) {
        authors[approvalAuthor].approvalGivenAfterTwoApprovals += 1;
      }
    });
    review.requestedChanges.forEach((requestedChanges) => {
      const requestedChangesAuthor = requestedChanges.login;
      if (secrets.blacklistUsers && secrets.blacklistUsers.includes(requestedChangesAuthor)) {
        return;
      }
      if (!authors.hasOwnProperty(requestedChangesAuthor)) {
        authors[requestedChangesAuthor] = {
          ...emptyObject,
        };
      }
      authors[requestedChangesAuthor].changesRequestedGiven += 1;
    });
    // Review Comments
    review.comments.forEach((comment) => {
      const commentAuthor = comment.login;
      if (secrets.blacklistUsers && secrets.blacklistUsers.includes(commentAuthor)) {
        return;
      }
      if (!authors.hasOwnProperty(commentAuthor)) {
        authors[commentAuthor] = {
          ...emptyObject,
        };
      }
      authors[commentAuthor].commentsGiven += 1;
    });
    // Regular Comments
    comments.forEach((comment) => {
      const commentAuthor = comment.login;
      if (secrets.blacklistUsers && secrets.blacklistUsers.includes(commentAuthor)) {
        return;
      }
      if (!authors.hasOwnProperty(commentAuthor)) {
        authors[commentAuthor] = {
          ...emptyObject,
        };
      }
      authors[commentAuthor].commentsGiven += 1;
    });

    // requestedChanges
  });

  // TODO build misc attributes
  _.forEach(authors, (authorData, user) => {
    const totalActivity = authorData.approved + authorData.changesRequestedGiven + authorData.commentsGiven;
    authors[user].name = user;
    authors[user].totalActivity = totalActivity;
    authors[user].firstTwoToApprove = authorData.approvalGivenFirst + authorData.approvalGivenSecond;
    authors[user].changeRequestReceivedPerPR = getAverage(authorData.changesRequestedReceived, authorData.pullRequestsSubmitted);
    authors[user].commentsGivenPerApproval = getAverage(authorData.commentsGiven, authorData.approved);
    authors[user].approvedBeforeChangeRequestPerPR = getAverage(authorData.approvedBeforeChangeRequestGivenBySomeoneElse, authorData.approved - authorData.approvalGivenAfterTwoApprovals);
    authors[user].commentsReceivedPerPR = getAverage(authorData.commentsReceived, authorData.pullRequestsSubmitted);
    authors[user].approvalsReceivedPerPR = getAverage(authorData.approvalsReceived, authorData.pullRequestsSubmitted);
    authors[user].activityPerDay = getAverage(totalActivity, businessDays);
    authors[user].reviewPerDay = getAverage(authorData.approved + authorData.changesRequestedGiven, businessDays);
    authors[user].commentsPerDay = getAverage(authorData.commentsGiven, businessDays);
  });

  const allScoresSorted = calculateTier(authors);

  const wrappedData = wrapAuthorData(authors, allScoresSorted);
  // console.log('WD: ', wrappedData);

  // return authors;
  return wrappedData;
}

function wrapAuthorData(authors: Users, allScoresSorted) {
  const retVal = {};
  _.forEach(authors, (authorData, user) => {
    retVal[user] = {};
    _.forEach(authorData, (value, key) => {
      retVal[user][key] = {
        value,
        tier: getTier(key, value, allScoresSorted),
      };
    });
  });

  return retVal;
}

function getTier(key, value, scores) {
  if (!_.isNumber(value)) {
    return 0;
  }
  // console.log('Value: ', value);
  // if (key === 'totalActivity') {
  //   console.log('TA: ', scores[key]);
  // }
  const scoresDuplicatesRemoved = _.sortedUniq(scores[key]);

  const index = scoresDuplicatesRemoved.indexOf(value);
  return index / scoresDuplicatesRemoved.length;
  // // const index = _.find(value, scores[key]);
  // console.log('index: ', index / scores[key].length);
  // return 1;
}

function calculateTier(authors: Users) {
  const scores = {

  };
  const scoresSorted = {

  };

  _.forEach(authors, (authorData, user) => {
    // console.log(authorData);
    _.forEach(authorData, (value, key) => {
      if (key !== 'name') {
        if (!scores.hasOwnProperty(key)) {
          scores[key] = [value];
        } else {
          scores[key].push(value);
        }
      }
    });
  });
  _.forEach(scores, (score, key) => {
    scoresSorted[key] = score.sort((a, b) => a - b);
  });
  // console.log(scoresSorted);
  return scoresSorted;
}

function commentsReceviedByPR(data: GithubReviewData, number: number) {
  const pullRequest = getPullRequests(data).find(item => item.node.number === number);
  let comments;
  if (pullRequest) {
    const reviewComments = getReviewsByNumber(data, number).comments.length;
    const regularComments = getCommentsByNumber(data, number).length;
    comments = reviewComments + regularComments;
  }
  return comments;
}

// const makeSelectReviewData = (startDate, endDate) => createSelector(
const makeSelectReviewData = () => createSelector(
  selectGlobal,
  (globalState): ReviewData => {
    let data: Array<PullRequestData> = globalState.get('pullRequestData').toJS();

    const dates: Dates = globalState.get('dates').toJS();
    const startDate = dates.selectedFromDate;
    const endDate = dates.selectedToDate;

    if (startDate && endDate) {
      data = _.filter(data, item => moment(item.node.mergedAt).isBetween(moment(startDate), moment(endDate), 'day', '[]'));
    }
    const wrappedData = {
      data: {
        repository: {
          pullRequests: {
            edges: data,
          },
        },
        rateLimit: undefined,
      },
    };

    const businessDays = calculateBusinessDays(startDate, endDate) || 1;

    const userData = buildUserData(wrappedData, businessDays);

    // // const max
    // const maxApprovalItem = _.chain(userData).values().maxBy(item => item.approved + item.changesRequestedGiven).value();
    //
    // const aggregatedData = {
    //   maxApproval: maxApprovalItem.approved.value + maxApprovalItem.changesRequestedGiven.value,
    // };

    return {
      userData,
      // aggregatedData,
    };
  },
);

const makeSortedDates = () => createSelector(
  selectGlobal,
  (globalState): SortedDates => {
    const array = globalState.get('pullRequestData').toJS();

    const sortedArray = array.sort((a, b) => {
      const dateA = moment(a.node.createdAt);
      const dateB = moment(b.node.createdAt);
      return dateA - dateB;
    });

    return {
      head: _.head(sortedArray).node.createdAt,
      last: _.last(sortedArray).node.createdAt,
    };
  },
);

const makeIdentityGraph = (user: string) => createSelector(
  selectGlobal, makeSelectReviewData(),
  (globalState, { userData }): IdentityGraphData => {
    const allData = globalState.get('pullRequestData').toJS();

    const retVal = createIdentityGraph(allData, userData, user, secrets.blacklistUsers);
    return retVal;
  },
);

export {
  selectGlobal,
  makeSelectCurrentUser,
  makeSelectLoading,
  makeSelectError,
  makeSelectRepos,
  makeSelectLocation,
  makeSelectPullRequestData,
  makeSelectReviewData,
  makeSortedDates,
  makeIdentityGraph,
};
