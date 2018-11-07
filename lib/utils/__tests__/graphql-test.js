// @flow

import {
  requestFetch,
  // fetch,
} from '../graphql';
import {
  // getOldestCursor,
  getMostRecentCursor,
} from '../file';


describe('utils/graphql', () => {
  describe('requestFetch', () => {
    it('Fetch data from backend', () => {
      // const authors = requestFetch(undefined, '2018-01-01');
      // const oldestCursor = getOldestCursor('data/');
      // const newestCursor = getMostRecentCursor('data/');
      // if (newestCursor) {
      //   requestFetch({
      //     // beforeCursor: oldestCursor,
      //     afterCursor: newestCursor,
      //     afterDate: '2018-04-01',
      //   });
      // } else {
      // Fetch all
      requestFetch({
        afterDate: '2018-10-01',
      });
      // }
    });
  });
});
