
import moment from 'moment';
import sanitize from 'sanitize-filename';

const fs = require('fs');

const jsonfile = require('jsonfile');

export function readFilesAsOne(dirname, callback) {
  let allData = [];

  const filenames = fs.readdirSync(dirname);
  filenames.forEach((filename) => {
    const content = fs.readFileSync(dirname + filename, 'utf-8');

    if (filename.indexOf('.json') > -1) {
      const myContent = JSON.parse(content).repository.pullRequests.edges;
      allData = allData.concat(myContent);
    }
  });
  return allData;
}

function createDirIfNotExist(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }
}

export function saveToFile(data, cursor) {
  createDirIfNotExist('data/');
  const file = `data/${sanitize(cursor)}.json`;
  jsonfile.writeFile(file, data, (err) => {
    err && console.error(err);
  });
}

export function saveJSONOutput(data, fileName) {
  createDirIfNotExist('output/');
  let file;
  if (!fileName) {
    file = `output/${moment().format('YYYY-MM-DD-HH-MM-SS')}.json`;
  } else {
    file = `output/${fileName}`;
  }
  jsonfile.writeFile(file, data, (err) => {
    err && console.error(err);
  });
}

export function getOldestCursor(dirname) {
  const data = readFilesAsOne(dirname);

  let minDate;
  let selectedCursor;
  data.forEach(({ node, cursor }) => {
    // console.log('Data: ', node.mergedAt);
    // console.log('Data: ', cursor);
    if (!minDate || moment(minDate).isAfter(node.createdAt)) {
      // console.log('True');
      minDate = node.createdAt;
      selectedCursor = cursor;
    }
  });
  return selectedCursor;
}
export function getMostRecentCursor(dirname) {
  const data = readFilesAsOne(dirname);

  let maxDate;
  let selectedCursor;
  data.forEach(({ node, cursor }) => {
    // console.log('Data: ', node.mergedAt);
    // console.log('Data: ', cursor);
    if (!maxDate || moment(maxDate).isBefore(node.createdAt)) {
      // console.log('True');
      maxDate = node.createdAt;
      selectedCursor = cursor;
    }
  });
  return selectedCursor;
  // console.log('MaxDate: ', maxDate);
  // console.log('Cursor: ', selectedCursor);
}
