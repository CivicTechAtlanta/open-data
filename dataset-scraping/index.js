const fs = require('mz/fs')

// Import scrapers. Expects the module to export a function that
// takes no arguments and returns a Promise of an array of
// objects like:
//   {name: String, description: String, category: String, url: String}

const scrapers = [
  require('./socrata')()
]

Promise.all(scrapers)
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
      const links = data[key].reduce((acc, item) => acc + `* [${item.name}](${item.url})\n`, "")
      return acc + `# ${key}` + '\n\n' + links + '\n\n'
    }, `Last Generated: ${new Date().toLocaleString()}\n\n`)
    return fs.writeFile('output.md', md)
  }, "")
  .then(() => {
    console.log('wrote to output.md')
  })
  .catch((err) => {
    console.error(err)
  })