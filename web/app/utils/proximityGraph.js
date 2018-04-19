// @flow

import * as d3 from 'd3';
import _ from 'lodash';

import type {
  ReduxState,
  UserData,
  Users,
  Links,
  // Reviews,
  PullRequestData,
  IdentityGraphData,
} from '../types';

/**
 * Creates the identity graph node list.
 * @param whitelistedIdentifiers Optional argument containing the identifies that should be
 *                               included. Other identities are excluded.
 */
export function createIdentityGraph(allData: Array<PullRequestData>, userData: Users, user: string, blacklistUsers: Array<string>): IdentityGraphData {
  // console.log('UserData: ', userData);
  // deep copy the data; d3 modifies it

  // console.log('UserData: ', userData);
  // console.log('AllData: ', allData);

  const nodes = [];
  _.forEach(userData, (value: UserData, key: string) => {
    if (blacklistUsers.includes(key)) {
      return;
    }
    nodes.push({ id: key, });
  });

  // const links = [];
  const links = {};
  _.forEach(allData, (pullRequest) => {
    const author = pullRequest.node.author.login;
    if (blacklistUsers.includes(author)) {
      return;
    }
    if (!_.find(nodes, (node) => node.id === author)) {
      nodes.push({ id: author });
    }
    const reviews = pullRequest.node.reviews.nodes;
    _.forEach(reviews, (review) => {
      const reviewer = review.author.login;
      if (blacklistUsers.includes(reviewer)) {
        return;
      }
      if (!_.find(nodes, (node) => node.id === reviewer)) {
        nodes.push({ id: reviewer });
      }
      if (user !== undefined && (author === reviewer || reviewer !== user)) {
        return;
      }

      if (!(reviewer in links)) {
        links[reviewer] = {};
      }
      if (!(author in links[reviewer])) {
        links[reviewer][author] = 1;
      } else {
        links[reviewer][author] += 1;
      }
    });
  });

  return {
    links,
    nodes,
  };

  // _.forEach()
  // console.log();

  // const identityGraphNodes = fromJS(userdata).toJS();
  // if (whitelistedIdentifiers) {
  //   for (let i = 0; i < identityGraphNodes.length; ++i) {
  //     if (!whitelistedIdentifiers.has(identityGraphNodes[i].identifier)) {
  //       identityGraphNodes.splice(i, 1);
  //       --i;
  //     }
  //   }
  // }
  //
  // const identityGraph = {
  //   nodes: identityGraphNodes,
  //   links: [],
  // };
  //
  // for (let i = 0; i < identityGraphNodes.length; ++i) {
  //   const item = identityGraphNodes[i];
  //
  //   for (let j = 0; j < item.myReviewerList.length; ++j) {
  //     const reviewerRecord = item.myReviewerList[j];
  //     if (whitelistedIdentifiers && !whitelistedIdentifiers.has(reviewerRecord.identity.identifier)) {
  //       continue;
  //     }
  //
  //     if (reviewerRecord.reviewData.approvalCount != 0) {
  //       identityGraph.links.push({
  //         source: identityGraphNodes[i],
  //         target: identityGraphNodes[getIndexOfIdentity(reviewerRecord.identity, identityGraphNodes)],
  //         value: reviewerRecord.reviewData.approvalCount,
  //       });
  //     }
  //   }
  // }
  // return identityGraph;
}
