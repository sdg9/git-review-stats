// @flow
import { List } from 'immutable';
import React from 'react';
import { Nav, NavItem } from 'react-bootstrap';

import './NavigationBar.scss';

type Props = {
  onSelectedListener: Function,
  elements: Object,
}
export default class NavigationBar extends React.Component<Props> {

  renderElement(element) {
    const key = element.get('key');
    const displayName = element.get('displayName');

    return (
      <NavItem key={key} eventKey={key}>{displayName}</NavItem>
    );
  }

  renderElements() {
    if (!this.props.elements) {
      return;
    }

    const renderedElements = [];
    this.props.elements.forEach(element =>
            renderedElements.push(this.renderElement(element)),
        );
    return renderedElements;
  }

  render() {
    return (
      <nav>
        <Nav bsStyle="pills" onSelect={this.props.onSelectedListener}>
          {this.renderElements()}
        </Nav>
      </nav>
    );
  }
}
