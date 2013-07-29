"use strict"

if (global.boxspring === undefined) {
	global.boxspring = {}
}

global._ = require('lodash')

_.mixin({

	include: function(array, value) {
		var index = _.indexOf(array, value)
		if (index < 0) array.push(value)
	},

	remove: function(array, value) {
		var index = _.indexOf(array, value)
		if (index > -1) array.splice(index, 1)
	}
})

boxspring.version = '0.0.1-dev'

require('./define')
require('./extend')
require('./implement')
require('./override')
require('./properties')
require('./object')