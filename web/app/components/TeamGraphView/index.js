/**
*
* TeamGraphView
*
*/

import React from 'react';
import Reactable from 'reactable';
import { ProgressBar } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { Td } from 'reactable';
import _ from 'lodash';

import './TeamGraphView.scss';

import SimpleSortableTable from '../SimpleSortableTable';
import Panel from '../Panel';
import ClearFloat from '../ClearFloat';
import ProximityGraphView from '../ProximityGraphView';
// import styled from 'styled-components';

class TeamGraphView extends React.Component { // eslint-disable-line react/prefer-stateless-function
  // constructor(props) {
  //   super(props);
  //   this.state = {
  //     selectedUsers: this.props.selectedUsers,
  //     highlightedIdentifier: null,
  //     overviewUserdata: window.overviewUserdata,
  //   };
  //   this.computeData(this.state.selectedUsers);
  //
  //   if (!this.state.overviewUserdata) {
  //     const jsLoader = new GlobalJavascriptLoader();
  //     jsLoader.loadJavascriptFile('./data/overview.js', () => {
  //       this.setState({
  //         overviewUserdata: window.overviewUserdata,
  //       });
  //     });
  //   }
  // }
  //
  // componentWillReceiveProps(nextProps) {
  //   if (!nextProps.selectedUsers.equals(this.state.selectedUsers)) {
  //     this.setState({
  //       selectedUsers: nextProps.selectedUsers,
  //     });
  //     this.computeData(nextProps.selectedUsers);
  //   }
  // }
  //
  // computeData(selectedUsers) {
  //   this._reviewRequestorData = this.props.userdata.getReviewRequestors(selectedUsers);
  //   this._nonRespondingUserData = [];
  //
  //   const reviewerData = this.props.userdata.getFilteredReviewerDataForOwnCommits(selectedUsers);
  //         // append all users in 'team' who did not request reviews
  //   for (let i = 0; i < reviewerData.length; ++i) {
  //     const reviewerItem = reviewerData[i];
  //     const identifier = reviewerItem.identity.identifier;
  //     if (!hasIdentifier(this._reviewRequestorData, identifier)) {
  //       this._nonRespondingUserData.push({
  //         approvalData: {
  //           addedAsReviewerCount: -1,
  //           approvalCount: -1,
  //         },
  //         identity: reviewerItem.identity,
  //       });
  //     }
  //   }
  // }
  //
  // getColumnMetadataForReviewRequestors() {
  //   return {
  //     name: {
  //       header: 'Name',
  //       description: 'The name of the user, as shown in Gerrit.',
  //       sortFunction: Reactable.Sort.CaseInsensitive,
  //       cell: (data, index) => (
  //         <Td key={index} column="name" value={getShortPrintableName(data.identity)}>
  //           <Link to={getProfilePageLinkForIdentity(data.identity)}>
  //             {getShortPrintableName(data.identity)}
  //           </Link>
  //         </Td>
  //                 ),
  //     },
  //     timesAdded: {
  //       header: () => (
  //         <span>Reviews<br />requested</span>
  //                 ),
  //       sortFunction: Reactable.Sort.NumericInteger,
  //       description: 'How many reviews did this user request. Each changeset counts as one.',
  //       cell: (data, index) => (
  //         <Td key={index} column="timesAdded">{data.approvalData.addedAsReviewerCount}</Td>
  //                 ),
  //     },
  //     approvalsReceived: {
  //       header: () => (
  //         <span>Approvals<br />received</span>
  //                 ),
  //       sortFunction: Reactable.Sort.NumericInteger,
  //       description: 'How many approvals (-2..+2) this user received from the author of this profile.',
  //       cell: (data, index) => (
  //         <Td key={index} column="approvalsReceived">{data.approvalData.approvalCount}</Td>
  //                 ),
  //     },
  //   };
  // }
  //
  // getColumnMetadataForNoResponses() {
  //   return {
  //     name: {
  //       header: 'Name',
  //       description: 'The name of the user, as shown in Gerrit.',
  //       sortFunction: Reactable.Sort.CaseInsensitive,
  //       cell: (data, index) => (
  //         <Td key={`name_${index}`} column="name">
  //           <Link to={getProfilePageLinkForIdentity(data.identity)}>
  //             {getShortPrintableName(data.identity)}
  //           </Link>
  //         </Td>
  //                 ),
  //     },
  //   };
  // }
  //
  // getIdentifierForRowIndex(table, index) {
  //   return (index != -1 && index < table.length) ? table[index].identity.identifier : null;
  // }
  //
  // onHighlightedRowChangedForReviewRequestorTable(highlightedIndex) {
  //   const identifier = this.getIdentifierForRowIndex(this._reviewRequestorData, highlightedIndex);
  //   this.onHighlightedIdentifierChanged(identifier);
  // }
  //
  // onHighlightedRowChangedForNonRespondingTable(highlightedIndex) {
  //   const identifier = this.getIdentifierForRowIndex(this._nonRespondingUserData, highlightedIndex);
  //   this.onHighlightedIdentifierChanged(identifier);
  // }
  //
  // onHighlightedIdentifierChanged(highlightedIdentifier) {
  //   this.setState({
  //     highlightedIdentifier,
  //   });
  // }
  //
  // getRowIndexForIdentifier(table, identifierToSeek) {
  //   return table.findIndex((item) => item.identity.identifier == identifierToSeek);
  // }

  getColumnMetadataForReviewee() {
    return {
      name: {
        header: 'Name',
        description: 'The name of the user, as shown in Gerrit.',
        sortFunction: Reactable.Sort.CaseInsensitive,
        cell: (data, index) => (
          <Td key={index} column="name" value={data.name}>
            <Link to={`/user/${data.name}`}>
              {data.name}
            </Link>
          </Td>
          ),
      },
      reviewsGiven: {
        header: () => (
          <span>Reviews given</span>
                  ),
        sortFunction: Reactable.Sort.NumericInteger,
        description: 'How many reviews did this user give. Each changeset counts as one.',
        cell: (data, index) => (
          <Td key={index} column="reviewsGiven">{data.reviewsGiven}</Td>
        ),
      },
    };
  }


  render() {
    // const highlightedIdentifier = this.state.highlightedIdentifier;

    const revieweesArray = [];
    Object.keys(this.props.reviewees).forEach((key) => {
      revieweesArray.push({
        reviewsGiven: this.props.reviewees[key],
        name: key,
      });
    });
    const reviewerTableProps = {
      columnMetadata: this.getColumnMetadataForReviewee(),
      rowData: revieweesArray,
      // onHighlightedRowIndexChanged: this.onHighlightedRowChangedForReviewRequestorTable.bind(this),
      // highlightedRowIndex: this.getRowIndexForIdentifier(this._reviewRequestorData, highlightedIdentifier),
    };
    // const reviewRequestorTableProps = {
    //   columnMetadata: this.getColumnMetadataForReviewRequestors(),
    //   rowData: this._reviewRequestorData,
    //   onHighlightedRowIndexChanged: this.onHighlightedRowChangedForReviewRequestorTable.bind(this),
    //   highlightedRowIndex: this.getRowIndexForIdentifier(this._reviewRequestorData, highlightedIdentifier),
    // };
    // const noResponseTableProps = {
    //   columnMetadata: this.getColumnMetadataForNoResponses(),
    //   rowData: this._nonRespondingUserData,
    //   onHighlightedRowIndexChanged: this.onHighlightedRowChangedForNonRespondingTable.bind(this),
    //   highlightedRowIndex: this.getRowIndexForIdentifier(this._nonRespondingUserData, highlightedIdentifier),
    // };
    //

    // console.log('Reviewees: ', revieweesArray);
    let teamGraph;
    // const nodes = revieweesArray.map((item) => ({
    //   name: item.name,
    // }));
    const nodes = revieweesArray.map((item) => (item.name));
    nodes.push({ name: this.props.user });

    const links = revieweesArray.map((item) => ({
      source: this.props.user,
      target: item.name,
      value: item.reviewsGiven,
    }));

    if (revieweesArray.length > 0) {
      teamGraph = (
        <ProximityGraphView
          nodes={nodes}
          links={links}
        />
      );
    } else {
      teamGraph = (<ProgressBar active now={100} />);
    }
    // let teamGraph = null;
    // if (this.state.overviewUserdata) {
    //   const config = {
    //     width: 490,
    //     height: 490,
    //     relativeLinkValueThreshold: 0.025,
    //     charge: -200,
    //     linkDistance: 25,
    //     drawCrosshair: true,
    //     highlightSelection: true,
    //     defaultItemOpacity: 0.6,
    //     centeredIdentifier: this.props.userdata.getIdentifier(),
    //   };
    //
    //   const teamIdentities = this.props.userdata.getTeamIdentities(this.state.selectedUsers);
    //   const teamGraphProps = {
    //     selectedUsers: this.state.selectedUsers,
    //     overviewUserdata: this.state.overviewUserdata,
    //     highlightedIdentifier: this.state.highlightedIdentifier,
    //     onHighlightedIdentifierChanged: this.onHighlightedIdentifierChanged.bind(this),
    //     identityGraph: createIdentityGraph(this.state.overviewUserdata, teamIdentities),
    //     graphConfig: config,
    //   };
    //
    //   teamGraph = (
    //     <ProximityGraphView {...teamGraphProps} />
    //      );
    // } else {
    //   teamGraph = (
    //     <ProgressBar active now={100} />
    //      );
    // }

    return (
      <div>
        <div className="panelBox">

          <Panel title={'Reviews'} size="half">
            <SimpleSortableTable {...reviewerTableProps} />
          </Panel>

          <Panel title="Team graph" size="half">
            {
              teamGraph
            }
          </Panel>
        </div>
      </div>
    );
    // return (
    //   <div>
    //     <div className="panelBox">
    //       <Panel title="They request reviews" size="half">
    //         <SimpleSortableTable {...reviewRequestorTableProps} />
    //       </Panel>
    //       <ClearFloat />
    //       <Panel title="They never responded to review requests" size="half">
    //         <SimpleSortableTable {...noResponseTableProps} />
    //       </Panel>
    //     </div>
    //     <Panel title="Team graph" size="half">
    //       {teamGraph}
    //     </Panel>
    //   </div>
    // );
  }
}

TeamGraphView.displayName = 'TeamGraphView';

TeamGraphView.propTypes = {
  user: React.PropTypes.string,
  reviewees: React.PropTypes.array,
//   // selectedUsers: React.PropTypes.instanceOf(SelectedUsers).isRequired,
//   // userdata: React.PropTypes.instanceOf(GerritUserdata).isRequired,
};

export default TeamGraphView;
