"use strict"

/**
 * @class boxspring.view.ScrollView
 * @super boxspring.view.View
 * @since 0.9
 */
var ScrollView = boxspring.define('boxspring.view.ScrollView', {

	inherits: boxspring.view.View,

	//--------------------------------------------------------------------------
	// Methods
	//--------------------------------------------------------------------------

	properties: {

		/**
		 * @property contentSize
		 * @since 0.9
		 */
		contentSize: {
			value: function() {
				return new boxspring.geom.Size()
			}
		},
	},

	constructor: function() {
		ScrollView.parent.constructor.call(this)
		var onPropertyChange = this.bind('onPropertyChange')
		this.on('propertychange', 'contentSize.x', onPropertyChange)
		this.on('propertychange', 'contentSize.y', onPropertyChange)
		this.overflow = 'hidden'
		return this
	},

	layout: function() {

		if (this.content) {
			this.content.size.x = this.contentSize.x === 'fill' ? this.measuredSize.x : this.contentSize.x
			this.content.size.y = this.contentSize.y === 'fill' ? this.measuredSize.y : this.contentSize.y
			this.content.layout(this, this.children)
		}

		return this
	},

	scrollTo: function() {},

	scrollBy: function() {}

})