/**
*
* ClearFloat
*
*/

import React from 'react';
// import styled from 'styled-components';


class ClearFloat extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function

  render() {
    const clearStyle = {
      clear: 'both',
    };
    return (
      <div style={clearStyle}></div>
    );
  }
}

ClearFloat.propTypes = {

};

export default ClearFloat;
