const fs = require('mz/fs')
// const json2csv = require('json2csv')

// Import scrapers. Expects the module to export a function that
// takes no arguments and returns a Promise of an array of
// objects like:
//   {name: String, description: String, category: String, url: String}

const socrata = require('./socrata')

Promise.all([ socrata() ])
  .then((resultSets) => {
    // flatten
    const results = [].concat.apply([], resultSets)
    // group by category
    const data = results.reduce((acc, item) => {
      const cat = item.category || "Uncategorized"
      acc[cat] = [].concat.apply(acc[cat] || [], [item])
      return acc
    }, {})
    // create markdown category headers and links
    const md = Object.keys(data).reduce((acc, key) => {
      const links = data[key].reduce((acc, item) => acc + `- [${item.name}](${item.url})\n`, "")
      return acc + `\n\n# ${key}\n\n` + links
    }, "")
    return fs.writeFile('output.md', md)
  }, "")
  .then(() => {
    console.log('wrote to output.md')
  })
  .catch((err) => {
    console.error(err)
  })