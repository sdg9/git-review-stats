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
  describe('buildAllData', () => {
    it('total comments (review and comments)', () => {
      // const authors = requestFetch(undefined, '2018-01-01');
      // const oldestCursor = getOldestCursor('data/');
      const newestCursor = getMostRecentCursor('data/');
      // console.log('O: ', oldestCursor);
      if (newestCursor) {
        requestFetch({
          // beforeCursor: oldestCursor,
          afterCursor: newestCursor,
          afterDate: '2018-01-01',
        });
      }
      // const authors = fetch();
      // console.log('Authors: ', authors);
    });
  });
});
