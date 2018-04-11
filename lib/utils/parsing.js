// @flow
// require('babel-core').transform('code');

// import _ from 'lodash';

import type { Reviews } from '../types/queryTypes';

const fs = require('fs');

export function readData(): Reviews {
  const obj: Reviews = JSON.parse(fs.readFileSync('./data/graphql/query1.json', 'utf8'));
  return obj;
}

function getPullRequests(data: Reviews) {
  return data.data.repository.pullRequests.edges;
}

function getReviewsByNumber(data: Reviews, number: number) {
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
        console.warn(`Unknown review state: ${review.state}`);
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

function getAllReviews(data: Reviews) {
  const approvals = [];
  const requestedChanges = [];
  const comments = [];

  getPullRequests(data).forEach((pullRequest) => {
    const object = getReviewsByNumber(data, pullRequest.node.number);
    approvals.push(object.approvals);
    requestedChanges.push(object.requestedChanges);
    comments.push(object.comments);
  });
  return {
    approvals,
    requestedChanges,
    comments,
  };
}
function getCommentsByNumber(data: Reviews, number: number) {
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

function getAllComments(data: Reviews) {
  const comments = [];
  getPullRequests(data).forEach((pullRequest) => {
    const object = getCommentsByNumber(data, pullRequest.node.number);
    comments.push(object);
  });
  return comments;
}
//
// export function getCommentsVsReviews(data: Reviews) {
//   const comments = getComments(data);
//   const reviews = getAllReviews(data);
//
//   const totalComments = comments.concat(reviews.comments);
//
//   return {
//     comments: totalComments,
//     approvals: reviews.approvals,
//     requestedChanges: reviews.requestedChanges,
//   };
// }

// export function getAllComments(data: Reviews) {
//   const object = getCommentsVsReviews(data);
//   return object.comments;
// }
//
// export function getChangesRequested(data: Reviews) {
//   const object = getCommentsVsReviews(data);
//   return _.filter(object.comments, item => item.isChangeRequestedComment);
// }
//
// export function getReviewComments(data: Reviews) {
//   const object = getCommentsVsReviews(data);
//   return _.filter(object.comments, item => item.isReviewComment);
// }
//
// export function getNonReviewComments(data: Reviews) {
//   const object = getCommentsVsReviews(data);
//   return _.filter(object.comments, item => item.isNonReviewComment);
// }
//
// export function getApprovals(data: Reviews) {
//   const object = getCommentsVsReviews(data);
//   return object.approvals;
// }
//
// export function getRequestedChanges(data: Reviews) {
//   const object = getCommentsVsReviews(data);
//   return object.requestedChanges;
// }

function commentsReceviedByPR(data: Reviews, number: number) {
  const pullRequest = getPullRequests(data).find(item => item.node.number === number);
  let comments;
  if (pullRequest) {
    const reviewComments = getReviewsByNumber(data, number).comments.length;
    const regularComments = getCommentsByNumber(data, number).length;
    comments = reviewComments + regularComments;
  }
  return comments;
}
//
// export function feedbackReceviedByPR(data: Reviews, number: number) {
//   return getPullRequests(data).find(item => item.node.number === number);
// }

// user     PRs APPROVED    Requested Changes   Comments Given  PRs Submitted   Comments Received/PR
// user1
// user2


// TODO: PRs APPROVED
// Requested Changes
// Comments Given
// Comments Given/PR
// PRs Submitted
// Time in review?
//
// Comments Received
// Comments Received/PR

// PRs Submitted
function pullRequestsByAuthor(data: Reviews) {
  const authors = {};
  getPullRequests(data).forEach((pullRequest) => {
    const author = pullRequest.node.author.login;
    const number = pullRequest.node.number;

    if (authors.hasOwnProperty(author)) {
      authors[author].pullRequestsSubmitted.push(number);
    } else {
      authors[author] = {
        pullRequestsSubmitted: [number],
      };
    }
  });
  return authors;
}
//
// export function getCommentsVsReviewsByPR(data: Reviews, number) {
//   const comments = getCommentsByPR(data, number);
//   const reviews = getReviewsByPR(data, number);
//
//   const totalComments = comments.concat(reviews.comments);
//
//   return {
//     comments: totalComments,
//     approvals: reviews.approvals,
//     requestedChanges: reviews.requestedChanges,
//   };
// }

const emptyObject = {
  approved: 0,
  changesRequestedGiven: 0,
  changesRequestedReceived: 0,
  approvedBeforeChangeRequestGivenBySomeoneElse: 0,
  commentsGiven: 0,
  commentsReceived: 0,
  pullRequestsSubmitted: 0,
  approvalGivenFirst: 0,
  approvalGivenAfterTwoApprovals: 0,
};

export function buildAllData(data: Reviews) {
  const authors = {};

  getPullRequests(data).forEach((pullRequest) => {
    const author = pullRequest.node.author.login;
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
    authors[author].changesRequestedReceived += review.requestedChanges.length;

    review.approvals.forEach((approval) => {
      const approvalAuthor = approval.login;
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
      if (approval.existingApprovals >= 2) {
        authors[approvalAuthor].approvalGivenAfterTwoApprovals += 1;
      }
    });
    review.requestedChanges.forEach((requestedChanges) => {
      const requestedChangesAuthor = requestedChanges.login;
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
      if (!authors.hasOwnProperty(commentAuthor)) {
        authors[commentAuthor] = {
          ...emptyObject,
        };
      }
      authors[commentAuthor].commentsGiven += 1;
    });

    // requestedChanges
  });
  return authors;
}
