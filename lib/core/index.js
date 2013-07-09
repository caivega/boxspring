"use strict"

if (global.boxspring === undefined) {
	global.boxspring = {}
}

global._ = require('lodash')

boxspring.version = '0.0.1-dev'

require('./define')
require('./extend')
require('./implement')
require('./override')
require('./properties')
require('./object')