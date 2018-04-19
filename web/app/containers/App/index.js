/**
 *
 * App
 *
 * This component is the skeleton around the actual pages, and should only
 * contain code that should be seen on all pages. (e.g. navigation bar)
 */

import React from 'react';
import { Helmet } from 'react-helmet';
import styled from 'styled-components';
import { Switch, Route } from 'react-router-dom';
import HomePage from 'containers/HomePage/Loadable';
import FeaturePage from 'containers/FeaturePage/Loadable';
import UserPage from 'containers/UserPage/Loadable';
import NotFoundPage from 'containers/NotFoundPage/Loadable';
import Header from 'components/Header';
import Footer from 'components/Footer';

  // max-width: calc(768px + 16px * 2);
const AppWrapper = styled.div`
  margin: 0 auto;
  display: flex;
  min-height: 100%;
  padding: 0 16px;
  flex-direction: column;
`;

export default function App() {
  return (
    <AppWrapper>
      <Helmet
        titleTemplate="%s"
        defaultTitle="Git-Review-Stats"
      >
        <meta name="description" content="A tool to view github.com stats" />
      </Helmet>
      {
        // <Header />
      }
      <Switch>
        <Route exact path="/" component={HomePage} />
        <Route path="/features" component={FeaturePage} />
        <Route path="/user/:name" component={UserPage} />
        <Route path="" component={NotFoundPage} />
      </Switch>
      <Footer />
    </AppWrapper>
  );
}
