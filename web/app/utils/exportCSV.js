const json2csv = require('json2csv').parse;

export function exportData(data) {
  const fields = [{
    label: 'Name',
    value: 'name.value',
  }, {
    label: 'Review Per Day ',
    value: 'reviewPerDay.value',
  }, {
    label: 'Comments Per Day',
    value: 'commentsPerDay.value',
  }, {
    label: 'First Two To Approve',
    value: 'firstTwoToApprove.value',
  }, {
    label: 'Total',
    value: 'approved.value',
  }, {
    label: 'Block Given',
    value: 'changesRequestedGiven.value',
  }, {
    label: 'Comments Given',
    value: 'commentsGiven.value',
  }, {
    label: 'Blocked Received',
    value: 'changesRequestedReceived.value',
  }, {
    label: 'Blocked/PR Received',
    value: 'changeRequestReceivedPerPR.value',
  }, {
    label: 'Comments Received',
    value: 'commentsReceived.value',
  }, {
    label: 'Comments/PR Received',
    value: 'commentsReceivedPerPR.value',
  }, {
    label: 'PRs Merged',
    value: 'pullRequestsMerged.value',
  }, {
    label: 'PRs Opened',
    value: 'pullRequestsOpened.value',
  }, {
    label: 'PRs Closed',
    value: 'pullRequestsClosed.value',
  }, {
    label: 'PRs of other people merged',
    value: 'merged.value',
  },
  ];



  // 'reviewPerDay.value', 'commentsPerDay.value', 'firstTwoToApprove.value', 'approved.value'];
  const opts = { fields };

  try {
    const csv = json2csv(data.data, opts);
    console.log('csv', csv);
    return csv;
  } catch (err) {
    console.err(err);
  }
  return undefined;
}
