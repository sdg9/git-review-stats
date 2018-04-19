// @flow
/*
 * AppReducer
 *
 * The reducer takes care of our data. Using actions, we can change our
 * application state.
 * To add a new action, add it to the switch statement in the reducer function
 *
 * Example:
 * case YOUR_ACTION_CONSTANT:
 *   return state.set('yourStateVariable', true);
 */

import { fromJS } from 'immutable';
import _ from 'lodash';
import moment from 'moment';

import {
  LOAD_REPOS_SUCCESS,
  LOAD_REPOS,
  LOAD_REPOS_ERROR,
  UPDATE_SELECTED_TO_DATE,
  UPDATE_SELECTED_FROM_DATE,
} from './constants';

import type {
  PullRequestData,
} from '../../types';

const allData = require('../../../../output/allData.json');

const uniques: Array<PullRequestData> = _.uniqBy(allData, object => object.cursor);
const sortedArray = uniques.sort((a, b) => {
  const dateA = moment(a.node.createdAt);
  const dateB = moment(b.node.createdAt);
  return dateA.unix() - dateB.unix();
});

// The initial state of the App
const initialState = fromJS({
  loading: false,
  error: false,
  currentUser: false,
  userData: {
    repositories: false,
  },
  pullRequestData: uniques,
  dates: {
    oldestFromDate: _.head(sortedArray).node.createdAt,
    newestToDate: _.last(sortedArray).node.createdAt,
    selectedFromDate: _.head(sortedArray).node.createdAt,
    selectedToDate: _.last(sortedArray).node.createdAt,
  },
  // githubData: data
});

function appReducer(state: Object = initialState, action: Object) {
  switch (action.type) {
    case UPDATE_SELECTED_TO_DATE:
      return state.setIn(['dates', 'selectedToDate'], action.payload.date);
    case UPDATE_SELECTED_FROM_DATE:
      return state.setIn(['dates', 'selectedFromDate'], action.payload.date);
    case LOAD_REPOS:
      return state
        .set('loading', true)
        .set('error', false)
        .setIn(['userData', 'repositories'], false);
    case LOAD_REPOS_SUCCESS:
      return state
        .setIn(['userData', 'repositories'], action.repos)
        .set('loading', false)
        .set('currentUser', action.username);
    case LOAD_REPOS_ERROR:
      return state
        .set('error', action.error)
        .set('loading', false);
    default:
      return state;
  }
}

export default appReducer;
