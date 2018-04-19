/**
*
* HorizontalCenterDiv
*
*/

import './HorizontalCenterDiv.scss';

import React from 'react';
// import styled from 'styled-components';


class HorizontalCenterDiv extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  render() {
    return (
      <div className="horizontalCenterDiv">
        {this.props.children}
      </div>
    );
  }
}

HorizontalCenterDiv.displayName = 'HorizontalCenterDiv';


export default HorizontalCenterDiv;
