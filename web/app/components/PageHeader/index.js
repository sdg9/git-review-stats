// @flow
import './PageHeader.scss';

import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

import DatasetOverviewWidget from '../DatasetOverviewWidget';

import {
  makeSortedDates,
} from 'containers/App/selectors';

import type {
  SortedDates,
} from '../../types';

type Props = {
  sortedDates: SortedDates,
  mainTitle: string,
  subtitle: string,
  showBackButton: boolean,
}

class PageHeader extends React.Component<Props> {

  static defaultProps = {
    mainTitle: 'Git Review Stats',
    subtitle: null,
    showBackButton: false,
  };

  renderMainTitle() {
    return this.props.mainTitle;
  }

  renderBackButton() {
    if (this.props.showBackButton) {
      return (
        <Link to="/"><img src={require('../../images/ic_back.png')} /></Link>
      );
    }
  }

  render() {
    return (
      <header>
        <DatasetOverviewWidget
          datasetOverview={{
            fromDate: this.props.sortedDates.head,
            toDate: this.props.sortedDates.last,
          }}
        />
        {this.renderBackButton()}
        <div style={{ display: 'inline-block' }}>
          <h1 className="pageTitle">{this.renderMainTitle()}</h1>
          <div className="subtitleH1">{this.props.subtitle}</div>
        </div>
      </header>
    );
  }
}

const mapStateToProps = (state, ownProps) => ({
  sortedDates: makeSortedDates()(state),
});
export default connect(mapStateToProps)(PageHeader);
