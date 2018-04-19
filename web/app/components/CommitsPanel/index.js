/**
*
* CommitsPanel
*
*/

import React from 'react';

import ClearFloat from '../ClearFloat';
import Panel from '../Panel';
import NumberPanel from '../NumberPanel';
import HorizontalCenterDiv from '../HorizontalCenterDiv';
// import styled from 'styled-components';


class CommitsPanel extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  render() {
    return (
      <Panel title="Commits" size="third">
        <NumberPanel
          title="total commits"
          tooltip="Number of total commits for the user."
          value={1}
        />
        <NumberPanel
          title="added as reviewer"
          tooltip="Number of times that the user was added as a reviewer."
          value={2}
        />
        <ClearFloat />
        <NumberPanel
          title="max patch set count"
          tooltip="The highest number of patch sets of all the user's commits. See 'Iteration' for details."
          value={3}
        />
        <NumberPanel
          title="abandoned"
          tooltip="Number of abandoned commits, which were never merged to a branch."
          value={4}
        />
        <ClearFloat />
        <HorizontalCenterDiv>
          <NumberPanel
            title="in review"
            tooltip="Number of commits currently in review by this user."
            value={5}
          />
        </HorizontalCenterDiv>
      </Panel>
    );
  }
}

CommitsPanel.displayName = 'CommitsPanel';
CommitsPanel.propTypes = {

};

export default CommitsPanel;
