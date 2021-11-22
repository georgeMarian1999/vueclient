'use strict'
const {merge} = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
    NODE_ENV: '"development"',

    HAS_PROFESSIONAL_MODULE: true, // Tells if the app includes Professional sections (when TRUE), or Pathfinder only (when FALSE).

    // API paths
    API_BASE_URL: '"/SMAS/pro/v2.3"', // No trailing slash!
    API_BASE_URL_PATHFINDER: '"/SMAS/api/v2.3"', // No trailing slash!
    API_BASE_URL_AUTH: '"/SMAS/pro/v2.3"', // No trailing slash!
    API_BASE_URL_LOGOUT: '"/SMAS/pro/v2.3"', // No trailing slash!

    // API_BASE_URL: '"v2"', // No trailing slash!
    // API_BASE_URL_AUTH: '"v2"' // No trailing slash!
});
