// @flow
/**
*
* InteractiveForceGraphWidget
*
*/

import React, { cloneElement } from 'react';
import _ from 'lodash';
import { InteractiveForceGraph, ForceGraphArrowLink, ForceGraph, ForceGraphNode, ForceGraphLink } from 'react-vis-force';
import { Button } from 'react-bootstrap';

import { scaleCategory20 } from 'd3-scale';
// import styled from 'styled-components';

import secrets from '../../../../lib/secrets';

import type {
  IdentityGraphData,
  Users,
  AggregateData,
} from '../../types';

// console.log('Secrets: ', secrets);

const action = (stuff) => { console.log(stuff); };
function attachEvents(child) {
  return cloneElement(child, {
    onMouseDown: action(`clicked <${child.type.name} />`),
    onMouseOver: action(`hovered <${child.type.name} />`),
    onMouseOut: action(`blurred <${child.type.name} />`),
  });
}

type Props = {
  defaultSelectedNode: string,
  identityGraphData: IdentityGraphData,
  userData: Users,
  aggregatedData: AggregateData,
  onSelectNode: Function,
  onDeselectNode: Function,
}
type State = {
  userTeamColors: boolean,
}

class InteractiveForceGraphWidget extends React.Component<Props, State> { // eslint-disable-line react/prefer-stateless-function

  constructor(props: Props) {
    super(props);
    this.state = {
      userTeamColors: true,
      // selected: null,
    };
    // console.log('ID: ', this.props.identityGraphData);
  }

  companyMapping(user: string) {
    const company = _.get(secrets, ['userMapping', user, 'company'], undefined);

    if (company === 'S') {
      return 'blue';
    } else if (company === 'C') {
      return 'green';
    } else if (company === 'D') {
      return 'orange';
    }
    // console.log('Company: ', company);
    return 'red';
  }

  teamMapping(user: string) {
    const team = _.get(secrets, ['userMapping', user, 'team'], undefined);

    if (team === 'AA') {
      return '#2af794';
    } else if (team === 'RA') {
      return '#c0cedb';
    } else if (team === 'JJ') {
      return '#2af794';
    } else if (team === 'BH') {
      // return '#6f6f6f';
      return 'black';
    } else if (team === 'ADA') {
      return '#b60205';
    } else if (team === 'WT') {
      return '#f9f9f9';
      // return '#ededed';
    } else if (team === 'RR') {
      return '#ff9e99';
    } else if (team === 'ADA') {
      return '#314c8e';
    } else if (team === 'ABT') {
      return '#42f4d9';
    } else if (team === 'F') {
      return '#e48400';
    } else if (team === 'SS') {
      // return '#ededed';
      return '#6f6f6f';
    } else if (team === 'PP') {
      return '#d4c5f9';
    } else if (team === 'ARCH') {
      return 'yellow';
    }
    // console.log('Company: ', company);
    return 'orange';
  }
  teamMappingStroke(user: string) {
    const team = _.get(secrets, ['userMapping', user, 'team'], undefined);
    if (team === 'WT' || team === 'ARCH') {
      return 'black';
    }
    return this.teamMapping(user);
  }

  getRadius(userData: Users, aggregatedData: AggregateData, user: string) {
    const data = _.get(userData, user, undefined);
    if (!data) {
      return 5;
    }
    const { approved, changesRequestedGiven } = data;
    // const { maxApproval } = aggregatedData;
    // console.log(userData[user].approved + userData[user].changesRequestGiven);
    // console.log(userData[user].changesRequestedGiven);
    // console.log(approved + changesRequestedGiven);
    // const totalReview = approved.value + changesRequestedGiven.value;
    const reviewTier = approved.tier + changesRequestedGiven.tier / 2;
    // console.log(maxApproval);

    // const percentile = totalReview.value / maxApproval;

    return Math.ceil(reviewTier * 10) + 2;

    // return 8;
  }

  render() {
    return (
      <div>
        <Button onClick={() => { this.setState({ userTeamColors: true }); }}>Team Colors</Button>
        <Button onClick={() => { this.setState({ userTeamColors: false }); }}>Company Colors</Button>
        <div>
          <InteractiveForceGraph
            showLabels
            labelAttr="label"
            simulationOptions={{
              height: 600,
              width: 600,
              strength: {
                charge: -400,
              },
            }}
            defaultSelectedNode={{ id: this.props.defaultSelectedNode }}
            onSelectNode={(event, node) => {
              console.log('Selected: ', node);
              this.props.onSelectNode(node);
            }}
            onDeselectNode={(event, node) => {
              this.props.onDeselectNode(node);
            }}
            highlightDependencies
          >
            {
            this.props.identityGraphData.nodes.map(item => (
              <ForceGraphNode

                onMouseOver={() => console.log(`hovered <${item.id} />`)}
                key={item.id}
                node={{
                  id: item.id,
                  label: item.label,
                  radius: this.getRadius(this.props.userData, this.props.aggregatedData, item.id),
                // radius: this.props.identityGraphData.links[this.props.user][item.id],
                }}
                fill={
                  this.state.userTeamColors ? this.teamMapping(item.id) : this.companyMapping(item.id)
                }
                stroke={
                  this.state.userTeamColors ? this.teamMappingStroke(item.id) : this.companyMapping(item.id)
                }
              />
            ))
          }
            {
                _.map(this.props.identityGraphData.links, (values, source) =>
                  // console.log('Val: ', values);
                  // console.log('source: ', source);

                  _.map(values, (strength, target) =>
                    // console.log('Target: ', target);
                    // console.log('Strength: ', strength);

                    (
                      <ForceGraphLink
                        key={`${source}=>${target}`}
                        link={{
                          source,
                          target,
                          value: strength,
                        }}
                      />
                    )),

                  // return null;
                  // return (
                  //   <ForceGraphLink
                  //     key={`${item.source}=>${item.target}`}
                  //     link={{
                  //       source: item.source,
                  //       target: item.target,
                  //     }}
                  //   />
                  // );

                )
          }
          </InteractiveForceGraph>
        </div>
      </div>
    );
  }
}

export default InteractiveForceGraphWidget;
