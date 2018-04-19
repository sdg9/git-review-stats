// @flow

import moment from 'moment';

import {
  readFilesAsOne,
  getMostRecentCursor,
  getOldestCursor,
} from '../file';

describe('utils/file', () => {
  describe('buildAllData', () => {
    it('total comments (review and comments)', () => {
      const data = readFilesAsOne('data/');
      // console.log('Data: ', data);
    });
  });
  describe('getMostRecentCursor', () => {
    it('should say', () => {
      console.log('Newest Cursor: ', getMostRecentCursor('data/'));
    });
    describe('getOldestCursor', () => {
      it('should say ', () => {
        console.log('Oldest Cursor: ', getOldestCursor('data/'));
      });
    });
  });
});
