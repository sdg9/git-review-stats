// @flow

// import { GraphQLClient } from 'graphql-request';
import moment from 'moment';
import request from 'request';

import secrets from '../secrets';

import {
  saveToFile,
} from './file';

const RateLimiter = require('limiter').RateLimiter;

const limiter = new RateLimiter(1, 2000);

// const client = new GraphQLClient('https://api.github.com/graphql', {
//   headers: {
//     Authorization: `Bearer ${secrets.GITHUB_API_TOKEN}`,
//   },
//   proxy: `${secrets.PROXY_URL}`,
// });

const variables = {
  owner: secrets.GITHUB_OWNER,
  name: secrets.GITHUB_REPOSITORY,
  count: 30,
  // states: 'MERGED',
};

// const queryNoBody = `query Something($owner:String!, $name:String!, $count:Int!, $states:[PullRequestState!], $beforeCursor:String, $afterCursor:String) {
//   repository(owner:$owner, name:$name) {
//     pullRequests(last:$count, states:$states, before:$beforeCursor, after:$afterCursor) {
const queryNoBody = `query Something($owner:String!, $name:String!, $count:Int!, $beforeCursor:String, $afterCursor:String) {
  repository(owner:$owner, name:$name) {
    pullRequests(last:$count, before:$beforeCursor, after:$afterCursor) {
          totalCount
          edges {
            cursor
            node {
              baseRef {
                id
                name
              }
              id
              title
              url
              number
              author {
                login
              }
              createdAt
              mergedAt
              state
              closed
              closedAt
              headRef {
                id
                name
              }
              mergedBy {
                login
              }
              reviewRequests(last:100) {
                totalCount
                nodes {
                  reviewer {
                    login
                  }
                }
              }
              suggestedReviewers {
                reviewer {
                  login
                }
              }
              commits {
                totalCount
              }
              additions
              deletions
              changedFiles
              reviews(last:100) {
                totalCount
                nodes {
                  comments(last:100){
                    totalCount
                    edges{
                      node{
                        createdAt
                        author {
                          login
                        }
                      }
                    }
                  }
                  state
                  author {
                    login
                  }
                  createdAt
                }
              }
              comments(last:100) {
                totalCount
                edges{
                  node {
                    author {
                      login
                    }
                    createdAt
                  }
                }
              }
            }
          }
        }
      }
      rateLimit{
        cost
        limit
        remaining
        resetAt
      }
}`;

type FetchInput = {
  beforeCursor?: string,
  afterCursor?: string,
  beforeDate?: string,
  afterDate?: string
}

export function requestFetch({
  beforeCursor,
  afterCursor,
  beforeDate,
  afterDate,
}: FetchInput = {}) {
  console.log('BeforeCursor: ', beforeCursor);
  console.log('AfterCursor: ', afterCursor);
  console.log('BeforeDate: ', beforeDate);
  console.log('AfterDate: ', afterDate);
  limiter.removeTokens(1, () => {
    request.post({
      url: 'https://api.github.com/graphql',
      headers: {
        Authorization: `Bearer ${secrets.GITHUB_API_TOKEN}`,
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/55.0.2883.87 Safari/537.36',
      },
      proxy: secrets.PROXY_URL,
      body: JSON.stringify({
        query: queryNoBody,
        variables: {
          ...variables,
          beforeCursor,
          afterCursor,
        },
      }),
    }, (e, r, body) => {
      // console.log('Error: ', e);
      // console.log('R: ', r);
      // console.log('Body: ', body);
      // console.log('Data: ', JSON.parse(body).data);

      const data = JSON.parse(body).data;
      if (data.repository.pullRequests.edges.length === 0) {
        console.log('All done!');
        return;
      }
      const myCursor = data.repository.pullRequests.edges[0].cursor;

      // console.log('Current Cursor: ', myCursor);

      let isDateTooEarly = false;
      let isDateTooLate = false;

      data.repository.pullRequests.edges.forEach((item) => {
        const createdAt = item.node.createdAt;
        const createdAtMoment = moment(createdAt);

        if (afterDate && createdAtMoment.isBefore(afterDate)) {
          console.log(`${createdAtMoment.format('YYYY-MM-DD')} is before ${afterDate}`);
          isDateTooEarly = true;
        }
        if (beforeDate && createdAtMoment.isAfter(beforeDate)) {
          console.log(`${createdAtMoment.format('YYYY-MM-DD')} is before ${beforeDate}`);
          isDateTooLate = true;
        }
      });
      // saveToFile(data, myCursor);
      saveToFile(data, moment().format('YYYY-MM-DD-HH-mm-ss-SSS'));

      if (!isDateTooEarly && !isDateTooLate) {
        requestFetch({
          beforeCursor: myCursor,
          afterCursor,
          beforeDate,
          afterDate,
        });
      }
    });
  });
}
//
// export const fetch = (cursor?: String, after?: String = '2018-04-01') => {
//   console.log('About to fetch');
//   limiter.removeTokens(1, () => {
//     client.request(queryNoBody, {
//       ...variables,
//       cursor,
//     }).then(
//       (data) => {
//         const myCursor = data.repository.pullRequests.edges[0].cursor;
//         // console.log('Cursor: ', myCursor);
//
//         let isBefore = false;
//
//         data.repository.pullRequests.edges.forEach((item) => {
//           const merged = item.node.mergedAt;
//           const mergedMoment = moment(merged);
//
//           if (mergedMoment.isBefore(after)) {
//             console.log(`${mergedMoment.format('YYYY-MM-DD')} is before ${after}`);
//             isBefore = true;
//           } else {
//             console.log(`${mergedMoment.format('YYYY-MM-DD')} is NOT before ${after}, continuing`);
//           }
//         });
//         saveToFile(data, myCursor);
//
//         if (!isBefore) {
//           fetch(myCursor, after);
//         }
//       },
//       error => console.warn(error),
//     );
//   });
// };
