const R = require('ramda');
const fs = require('fs');

/**
 * Gets contents of specified filePath
 * 
 * @param {string} filePath 
 */
const getFileContents = (filePath) => {
  if (!filePath) throw new Error('File Path not defined');

  return fs.readFileSync(filePath, 'utf8');;
};

/**
 * Checks that the tags are valid
 * 
 * @param {string} fileContents
 * @return {string} result
 */
const checkTags = (fileContents) => {
  const tagRegex = /<\/?[A-Z]>/g;
  let tagsInOrder = fileContents.match(tagRegex);
  
  while(!R.isEmpty(tagsInOrder)) {
    const openTagIndex = R.findLastIndex(R.test(/<[A-Z]>/g), tagsInOrder);

    const openTag = tagsInOrder[openTagIndex];
    const closeTag = tagsInOrder[openTagIndex + 1];

    if (!openTag) return `Expected # found ${closeTag}`;
    if (!closeTag) return `Expected </${openTag[1]}> found #`;
    if (openTag[1] !== closeTag[2]) return `Expected </${openTag[1]}> found ${closeTag}`;

    tagsInOrder = R.remove(openTagIndex, 2, tagsInOrder);
  }

  return 'Correctly tagged paragraph';
};

/**
 * Main Entry
 * 
 * @param {string} filePath
 */
const runTagChecker = (filePath) => {
  try {
    const fileContents = getFileContents(filePath);  

    const result = checkTags(fileContents);

    console.log(result);
  } catch (error) {
    console.log(error.message);
  }
};

runTagChecker(process.argv.slice(2)[0]);