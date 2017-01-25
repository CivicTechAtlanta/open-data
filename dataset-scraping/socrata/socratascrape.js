// var sets = $('.browse2-result').map((i, el) => {
//   return {
//     title: $(el).find('.browse2-result-name [itemprop]=name').text().trim(),
//     url: $(el).find('itemprop="url"').attr('content'),
//     keywords: $(el).find('itemprop="keywords"').text().trim(),
//     updated: $(el).find('.browse2-result-timestamp-value').text().trim(),
//     views: $(el).find('.browse2-result-view-count-value').text().trim(),
//     tags: $(el).find('.browse2-result-topic').map((i, t) => {return $(t).text().trim() })
//   }
// })

const fetch = require('node-fetch')

const CATALOG_ENDPOINT = 'http://api.us.socrata.com/api/catalog/v1?domains=brigades.opendatanetwork.com&Brigade_Group=Code%20for%20Atlanta'


// https://www.opendatanetwork.com

function loadPage(offset, loadedResults) {
  return fetch(`${CATALOG_ENDPOINT}&offset=${offset}`)
    .then((res) => res.json())
    .then((res) => {
      const totalResults = loadedResults.concat(res.results.map((result) => {
        return {
          name: result.resource.name,
          description: result.resource.description,
          categories: result.classification.categories,
          tags: result.classification.tags,
          domain_category: result.classification.domain_category,
          permalink: result.classification.permalink
        }
      })) 
      if (res.resultSetSize > totalResults.length) {
        return loadPage(totalResults.length, totalResults)
      }
      return Promise.resolve(totalResults)
    })
}

loadPage(0, []).then(console.log.bind(console))
