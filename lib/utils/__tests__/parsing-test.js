// @flow
import _ from 'lodash';

import {
  readData,
  // getReviews,
  // getComments,
  // getCommentsVsReviews,
  // pullRequestsByAuthor,
  // getRequestedChanges,
  // getAllReviews,
  buildAllData,
  // getReviewsByNumber,
  // commentsReceviedByPR,
} from '../parsing';



describe('utils/parsing', () => {
  const query = readData();
  // describe('readData', () => {
  //   it('should handle a valid number', () => {
  //     expect(query.data.repository.pullRequests.edges.length).toBe(40);
  //   });
  // });
  // describe('getReviews', () => {
  //   it('should handle a valid number', () => {
  //     const object = getReviews(query);
  //     // console.log(object);
  //     // expect(query.data.repository.pullRequests.edges.length).toBe(40);
  //   });
  // });
  // describe('getComments', () => {
  //   it('should handle a valid number', () => {
  //     const object = getComments(query);
  //     // expect(query.data.repository.pullRequests.edges.length).toBe(40);
  //   });
  // });
  // describe('getCommentsVsReviews', () => {
  //   it('should handle a valid number', () => {
  //     const object = getCommentsVsReviews(query);
  //     // console.log(object);
  //     // console.log('Comments: ', object.comments.length);
  //     // console.log('Reviews: ', object.reviews.length);
  //     // console.log('Reviews: ', object.reviews);
  //     // console.log('Comments: ', JSON.stringify(object.comments));
  //     // console.log('Reviews: ', JSON.stringify(object.reviews));
  //     // expect(query.data.repository.pullRequests.edges.length).toBe(40);
  //   });
  // });
  // describe('getCommentsVsReviews', () => {
  //   it('total comments (review and comments)', () => {
  //     const object = getCommentsVsReviews(query);
  //     // console.log(object);
  //     // console.log('All: ', object.comments.length);
  //     // console.log('Change Requested: ', _.filter(object.comments, item => item.isChangeRequestedComment).length);
  //     // console.log('Other Review Comment: ', _.filter(object.comments, item => item.isReviewComment).length);
  //     // console.log('NonReview Comment: ', _.filter(object.comments, item => item.isNonReviewComment).length);
  //     // console.log('Approvals: ', object.approvals.length);
  //     // console.log('Request Changes: ', object.requestedChanges.length);
  //
  //     // console.log(object);
  //     // console.log('Comments: ', object.comments.length);
  //     // console.log('Reviews: ', object.reviews.length);
  //     // console.log('Reviews: ', object.reviews);
  //     // console.log('Comments: ', JSON.stringify(object.comments));
  //     // console.log('Reviews: ', JSON.stringify(object.reviews));
  //     // expect(query.data.repository.pullRequests.edges.length).toBe(40);
  //   });
  // });
  // describe('getCommentsVsReviews', () => {
  //   it('total comments (review and comments)', () => {
  //     const commentCount = commentsReceviedByPR(query, 7631);
  //     // console.log('CommentCount: ', commentCount);
  //   });
  // });
  //
  //
  // describe('pullRequestsByAuthor', () => {
  //   it('total comments (review and comments)', () => {
  //     const authors = pullRequestsByAuthor(query);
  //     // console.log('Authors: ', authors);
  //   });
  // });
  //
  // describe('getRequestedChanges', () => {
  //   it('total comments (review and comments)', () => {
  //     const authors = getRequestedChanges(query);
  //     // console.log('Authors: ', authors);
  //   });
  // });
  // describe('getAllReviews', () => {
  //   it('total comments (review and comments)', () => {
  //     const authors = getAllReviews(query);
  //     console.log('Authors: ', authors);
  //   });
  // });
  //
  // describe('commentsReceviedByPR', () => {
  //   it('total comments (review and comments)', () => {
  //     const authors = commentsReceviedByPR(query, 7631);
  //     // console.log('commentsReceviedByPR: ', authors);
  //   });
  // });
  //
  // describe('getReviewsByNumber', () => {
  //   it('total comments (review and comments)', () => {
  //     const authors = getReviewsByNumber(query, 7631);
  //     // console.log('Review: ', authors);
  //   });
  // });

  describe('buildAllData', () => {
    it('total comments (review and comments)', () => {
      const authors = buildAllData(query);
      console.log('Authors: ', authors);
    });
  });
});
