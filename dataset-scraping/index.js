const fs = require('mz/fs')
const json2csv = require('json2csv')

// Import scrapers. Expects the module to export a function that
// takes no arguments and returns a Promise of an array of
// objects like:
//   {name: String, description: String, category: String, url: String}

const socrata = require('./socrata')

Promise.all([ socrata() ])
  .then((resultSets) => {
    const results = [].concat.apply([], resultSets) // flatten
    const csv = json2csv({data: results, fields: ['name', 'description', 'category', 'url']})
    return fs.writeFile('output.csv', csv)
  })
  .then(() => {
    console.log('wrote to output.csv')
  })
  .catch((err) => {
    console.error(err)
  })