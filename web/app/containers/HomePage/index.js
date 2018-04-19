// @flow
/*
 * HomePage
 *
 * This is the first thing users see of our App, at the '/' route
 */

import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import { InteractiveForceGraph, ForceGraph, ForceGraphNode, ForceGraphLink } from 'react-vis-force';

import 'react-datepicker/dist/react-datepicker.css';

import { loadRepos } from '../App/actions';

import AtPrefix from './AtPrefix';
import CenteredSection from './CenteredSection';
import Form from './Form';
import Input from './Input';
import Section from './Section';
import messages from './messages';
import reducer from './reducer';
import saga from './saga';

import injectReducer from 'utils/injectReducer';
import injectSaga from 'utils/injectSaga';
import {
  makeSelectRepos,
  makeSelectLoading,
  makeSelectError,
  makeSelectReviewData,
  makeSortedDates,
  makeIdentityGraph,
} from 'containers/App/selectors';
import H2 from 'components/H2';
import ReposList from 'components/ReposList';
import Chart from 'containers/Chart';
import PageHeader from 'components/PageHeader';
import NavigationBar from 'components/NavigationBar';
import InteractiveForceGraphWidget from 'components/InteractiveForceGraphWidget';

import type {
  SortedDates,
} from '../../types';

type Props = {
  // sortedDates: SortedDates,
}

export class HomePage extends React.PureComponent<Props, void> { // eslint-disable-line react/prefer-stateless-function

  render() {
    return (
      <article>
        <div>
          <PageHeader
            subtitle={'All Users'}
          />
          <NavigationBar />
          <Section>
            <Chart />
          </Section>
        </div>
      </article>
    );
  }
}

const mapStateToProps = createStructuredSelector({
  // sortedDates: makeSortedDates(),
});

const withConnect = connect(mapStateToProps);

const withReducer = injectReducer({ key: 'home', reducer });
const withSaga = injectSaga({ key: 'home', saga });

export default compose(
  withReducer,
  withSaga,
  withConnect,
)(HomePage);
