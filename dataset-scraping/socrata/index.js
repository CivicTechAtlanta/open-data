const fetch = require('node-fetch')

const CATALOG_ENDPOINT = 'http://api.us.socrata.com/api/catalog/v1?domains=brigades.opendatanetwork.com&Brigade_Group=Code%20for%20Atlanta'

// http://docs.socratadiscovery.apiary.io/

function loadPage(offset, loadedResults) {
  return fetch(`${CATALOG_ENDPOINT}&offset=${offset}`)
    .then((res) => res.json())
    .then((res) => {
      const totalResults = loadedResults.concat(res.results.map((result) => {
        return {
          name: result.resource.name,
          description: result.resource.description,
          category: result.classification.domain_category,
          url: result.classification.permalink
        }
      })) 
      if (res.resultSetSize > totalResults.length) {
        return loadPage(totalResults.length, totalResults)
      }
      return Promise.resolve(totalResults)
    })
}

module.exports = function() {
  return loadPage(0, [])
}
