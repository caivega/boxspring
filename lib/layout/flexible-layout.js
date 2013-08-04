"use strict"

/**
 * @class boxspring.layout.FlexibleLayout
 * @super boxspring.layout.FixedLayout
 * @since 0.9
 */
var FlexibleLayout = boxspring.define('boxspring.layout.FlexibleLayout', {

	inherits: boxspring.layout.FixedLayout,

	//--------------------------------------------------------------------------
	// Properties
	//--------------------------------------------------------------------------

	properties: {

		/**
		 * @property orientation
		 * @since 0.9
		 */
		orientation: {
			value: 'vertical'
		},

		/**
		 * @property verticalAlignment
		 * @since 0.9
		 */
		verticalAlignment: {
			value: 'start'
		},

		/**
		 * @property horizontalAlignment
		 * @since 0.9
		 */
		horizontalAlignment: {
			value: 'start'
		}
	},

	//--------------------------------------------------------------------------
	// Methods
	//--------------------------------------------------------------------------

	/**
	 * @method layout
	 * @since 0.9
	 */
	layout: function() {

		FlexibleLayout.parent.layout.call(this)

		switch (this.orientation) {
			case 'vertical':
				this.__layoutVertically()
				break
			case 'horizontal':
				this.__layoutHorizontally()
				break
		}

		return this
	},

	//--------------------------------------------------------------------------
	// Event Handlers
	//--------------------------------------------------------------------------

	/**
	 * @method onPropertyChange
	 * @since 0.9
	 */
	onPropertyChange: function(target, property, newValue, oldValue) {

		if (property === 'orientation' ||
			property === 'verticalAlignment' ||
			property === 'horizontalAlignment') {
			if (this.view) this.view.scheduleLayout()
		}

		FlexibleLayout.parent.onPropertyChange.apply(this, arguments)
	},

	//--------------------------------------------------------------------------
	// Private API
	//--------------------------------------------------------------------------

	/**
	 * @method __layoutHorizontally
	 * @scope private
	 * @since 0.9
	 */
	__layoutHorizontally: function() {

		var contentAlignmentY = this.verticalAlignment
		var contentAlignmentX = this.horizontalAlignment

		var border = this.view.borderWidth
		var paddingT = this.view.padding.top
		var paddingL = this.view.padding.left
		var paddingB = this.view.padding.bottom
		var paddingR = this.view.padding.right

		var contentSizeX = this.size.x - paddingL - paddingR - border * 2
		var contentSizeY = this.size.y - paddingT - paddingB - border * 2

		var usedSpace = 0
		var freeSpace = contentSizeX
		var fluidItems = []
		var fluidSpace = 0
		var fluidCount = 0

		var children = this.view.children

		for (var i = 0; i < children.length; i++) {

            var child = children[i]

			var positionT = child.position.top
			var positionL = child.position.left
			var positionR = child.position.right
			var positionB = child.position.bottom

			if (positionT !== 'auto' || positionB !== 'auto' &&
				positionL !== 'auto' || positionR !== 'auto') {
				continue
			}

            var sizeX = child.size.x
            var sizeY = child.size.y
			var maxSizeX = child.maxSize.x
			var maxSizeY = child.maxSize.y
			var minSizeX = child.minSize.x
			var minSizeY = child.minSize.y

			var marginT = child.margin.top
			var marginL = child.margin.left
			var marginR = child.margin.right
			var marginB = child.margin.bottom
			var marginX = marginL + marginR
			var marginY = marginT + marginB

			var measuredSizeX = sizeX === 'fill' ? contentSizeX : sizeX
			var measuredSizeY = sizeY === 'fill' ? contentSizeY : sizeY

			if (maxSizeX !== 'none' && measuredSizeX > maxSizeX) measuredSizeX = maxSizeX
			if (minSizeX !== 'none' && measuredSizeX < minSizeX) measuredSizeX = minSizeX
			if (maxSizeY !== 'none' && measuredSizeY > maxSizeY) measuredSizeY = maxSizeY
			if (minSizeY !== 'none' && measuredSizeY < minSizeY) measuredSizeY = minSizeY

			if (sizeX === 'fill') {
				fluidItems.push(child)
			} else {
				var space = measuredSizeX - marginX
				freeSpace -= space
				usedSpace += space
			}

			child.measuredSize.x = measuredSizeX
			child.measuredSize.y = measuredSizeY
		}

		fluidCount = fluidItems.length
		fluidSpace = freeSpace / fluidCount

	// super 2 passes probablement mauvais

		for (var i = 0; i < fluidItems.length; i++) {

			var child = fluidItems[i]

			var maxSizeX = child.maxSize.x
			var minSizeX = child.minSize.x

			if (maxSizeX === 'none')
				continue

			var space = fluidSpace
			if (maxSizeX !== 'none' && space > maxSizeX) space = maxSizeX
			if (minSizeX !== 'none' && space < minSizeX) space = minSizeX
			child.measuredSize.x = space

			usedSpace += space
			freeSpace -= space

			fluidCount--
			fluidSpace = freeSpace / fluidCount
		}



		for (var i = 0; i < fluidItems.length; i++) {

			var child = fluidItems[i]

			var maxSizeX = child.maxSize.x
			var minSizeX = child.minSize.x

			if (maxSizeX !== 'none')
				continue

			var space = fluidSpace
			if (maxSizeX !== 'none' && space > maxSizeX) space = maxSizeX
			if (minSizeX !== 'none' && space < minSizeX) space = minSizeX
			child.measuredSize.x = space

			usedSpace += space
			freeSpace -= space

			fluidCount--
			fluidSpace = freeSpace / fluidCount
		}

		var offset = 0

		switch (contentAlignmentX) {
			case 'start':
				offset = paddingL + border
				break
			case 'end':
				offset = paddingL + border + contentSizeX - usedSpace
				break
			case 'center':
				offset = contentSizeX / 2 - usedSpace / 2
				break
		}

		for (var i = 0; i < children.length; i++) {

            var child = children[i]

			var positionT = child.position.top
			var positionL = child.position.left
			var positionR = child.position.right
			var positionB = child.position.bottom

			if (positionT !== 'auto' || positionB !== 'auto' &&
				positionL !== 'auto' || positionR !== 'auto') {
				continue
			}

			var marginT = child.margin.top
			var marginL = child.margin.left
			var marginR = child.margin.right
			var marginB = child.margin.bottom

			var measuredSizeX = child.measuredSize.x
			var measuredSizeY = child.measuredSize.y
			var measuredOffsetX = 0
			var measuredOffsetY = 0

			measuredOffsetX = offset + marginL

			switch (contentAlignmentY) {
				case 'start':
					measuredOffsetY = paddingT + border
					break
				case 'end':
					measuredOffsetY = paddingT + border + contentSizeY - measuredSizeY
					break
				case 'center':
					measuredOffsetY = paddingT + border + contentSizeY / 2 - measuredSizeY / 2
					break
			}

			child.measuredOffset.x = measuredOffsetX
			child.measuredOffset.y = measuredOffsetY

			offset = measuredOffsetX + measuredSizeX
		}

		return this
	},

	/**
	 * @method __layoutVertically
	 * @scope private
	 * @since 0.9
	 */
	__layoutVertically: function() {

		var contentAlignmentY = this.verticalAlignment
		var contentAlignmentX = this.horizontalAlignment

		var border = this.view.borderWidth
		var paddingT = this.view.padding.top
		var paddingL = this.view.padding.left
		var paddingB = this.view.padding.bottom
		var paddingR = this.view.padding.right

		var contentSizeX = this.size.x - paddingL - paddingR - border * 2
		var contentSizeY = this.size.y - paddingT - paddingB - border * 2

		var usedSpace = 0
		var freeSpace = contentSizeY
		var fluidItems = []
		var fluidSpace = 0
		var fluidCount = 0

		var children = this.view.children

		for (var i = 0; i < children.length; i++) {

            var child = children[i]

			var positionT = child.position.top
			var positionL = child.position.left
			var positionR = child.position.right
			var positionB = child.position.bottom

			if (positionT !== 'auto' || positionB !== 'auto' &&
				positionL !== 'auto' || positionR !== 'auto') {
				continue
			}

            var sizeX = child.size.x
            var sizeY = child.size.y
			var maxSizeX = child.maxSize.x
			var maxSizeY = child.maxSize.y
			var minSizeX = child.minSize.x
			var minSizeY = child.minSize.y

			var marginT = child.margin.top
			var marginL = child.margin.left
			var marginR = child.margin.right
			var marginB = child.margin.bottom
			var marginX = marginL + marginR
			var marginY = marginT + marginB

			var measuredSizeX = sizeX === 'fill' ? contentSizeX : sizeX
			var measuredSizeY = sizeY === 'fill' ? contentSizeY : sizeY

			if (maxSizeX !== 'none' && measuredSizeX > maxSizeX) measuredSizeX = maxSizeX
			if (minSizeX !== 'none' && measuredSizeX < minSizeX) measuredSizeX = minSizeX
			if (maxSizeY !== 'none' && measuredSizeY > maxSizeY) measuredSizeY = maxSizeY
			if (minSizeY !== 'none' && measuredSizeY < minSizeY) measuredSizeY = minSizeY

			if (sizeY === 'fill') {
				fluidItems.push(child)
			} else {
				var space = measuredSizeY - marginY
				freeSpace -= space
				usedSpace += space
			}

			child.measuredSize.x = measuredSizeX
			child.measuredSize.y = measuredSizeY
		}

		fluidCount = fluidItems.length
		fluidSpace = freeSpace / fluidCount

		// super 2 passes probablement mauvais

		for (var i = 0; i < fluidItems.length; i++) {

			var child = fluidItems[i]

			var maxSizeY = child.maxSize.y
			var minSizeY = child.minSize.y

			if (maxSizeY === 'none')
				continue

			var space = fluidSpace
			if (maxSizeY !== 'none' && space > maxSizeY) space = maxSizeY
			if (minSizeY !== 'none' && space < minSizeY) space = minSizeY
			child.measuredSize.y = space

			usedSpace += space
			freeSpace -= space

			fluidCount--
			fluidSpace = freeSpace / fluidCount
		}



		for (var i = 0; i < fluidItems.length; i++) {

			var child = fluidItems[i]

			var maxSizeY = child.maxSize.y
			var minSizeY = child.minSize.y

			if (maxSizeY !== 'none')
				continue

			var space = fluidSpace
			if (maxSizeY !== 'none' && space > maxSizeY) space = maxSizeY
			if (minSizeY !== 'none' && space < minSizeY) space = minSizeY
			child.measuredSize.y = space

			usedSpace += space
			freeSpace -= space

			fluidCount--
			fluidSpace = freeSpace / fluidCount
		}



		var offset = 0

		switch (contentAlignmentY) {
			case 'start':
				offset = paddingT + border
				break
			case 'end':
				offset = paddingT + border + contentSizeX - usedSpace
				break
			case 'center':
				offset = contentSizeY / 2 - usedSpace / 2
				break
		}

		for (var i = 0; i < children.length; i++) {

            var child = children[i]

			var positionT = child.position.top
			var positionL = child.position.left
			var positionR = child.position.right
			var positionB = child.position.bottom

			if (positionT !== 'auto' || positionB !== 'auto' &&
				positionL !== 'auto' || positionR !== 'auto') {
				continue
			}

			var marginT = child.margin.top
			var marginL = child.margin.left
			var marginR = child.margin.right
			var marginB = child.margin.bottom

			var measuredSizeX = child.measuredSize.x
			var measuredSizeY = child.measuredSize.y
			var measuredOffsetX = 0
			var measuredOffsetY = 0

			measuredOffsetY = offset + marginT

			switch (contentAlignmentX) {
				case 'start':
					measuredOffsetX = paddingT + border
					break
				case 'end':
					measuredOffsetX = paddingT + border + contentSizeY - measuredSizeY
					break
				case 'center':
					measuredOffsetX = paddingT + border + contentSizeY / 2 - measuredSizeY / 2
					break
			}

			child.measuredOffset.x = measuredOffsetX
			child.measuredOffset.y = measuredOffsetY

			offset = measuredOffsetY + measuredSizeY
		}

		return this
	}

})