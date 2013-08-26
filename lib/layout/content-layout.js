"use strict"

/**
 * @class boxspring.layout.ContentLayout
 * @super boxspring.Object
 * @since 0.9
 */
var ContentLayout = boxspring.define('boxspring.layout.ContentLayout', {

	//--------------------------------------------------------------------------
	// Properties
	//--------------------------------------------------------------------------

	properties: {

		target: {
			value: null
		},

		/**
		 * @property size
		 * @since 0.9
		 */
		size: {
			value: function() {
				return new boxspring.geom.Size()
			}
		},

		/**
		 * @property offset
		 * @since 0.9
		 */
		offset: {
			value: function() {
				return new boxspring.geom.Point()
			}
		},

		/**
		 * @property orientation
		 * @since 0.9
		 */
		orientation: {
			value: 'vertical'
		},

		/**
		 * @property alignment
		 * @since 0.9
		 */
		alignment: {
			value: function() {
				return new boxspring.geom.Alignment()
			}
		}
	},

	//--------------------------------------------------------------------------
	// Methods
	//--------------------------------------------------------------------------

	/**
	 * @method update
	 * @since 0.9
	 */
	update: function() {
		var children = this.target.children
		this.measure(children)
		this.layout(children)
	},

	/**
	 * @method measure
	 * @since 0.9
	 */
	measure: function(children) {

		var border = this.target.borderWidth
		var paddingT = this.target.padding.top
		var paddingL = this.target.padding.left
		var paddingB = this.target.padding.bottom
		var paddingR = this.target.padding.right

		var paddingBoxSizeX = this.size.x - border * 2
		var paddingBoxSizeY = this.size.y - border * 2
		var contentBoxSizeX = paddingBoxSizeX - paddingL - paddingR
		var contentBoxSizeY = paddingBoxSizeY - paddingT - paddingB

		var paddingBoxSize = 0
		var contentBoxSize = 0

		switch (this.orientation) {
			case 'vertical':
				paddingBoxSize = paddingBoxSizeY
				contentBoxSize = contentBoxSizeY
				break
			case 'horizontal':
				paddingBoxSize = paddingBoxSizeX
				contentBoxSize = contentBoxSizeX
				break
		}

		var flexibles = []
		var confineds = []
		var space = contentBoxSize
		var total = 0

		for (var i = 0; i < children.length; i++) {

			var child = children[i]

			var measuredSizeX = 0
			var measuredSizeY = 0

			var positionT = child.position.top
			var positionL = child.position.left
			var positionR = child.position.right
			var positionB = child.position.bottom

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

			if (positionT !== 'auto' || positionB !== 'auto' ||
				positionL !== 'auto' || positionR !== 'auto') {
				measuredSizeX = sizeX === 'fill' ? paddingBoxSizeX : sizeX
				measuredSizeY = sizeY === 'fill' ? paddingBoxSizeY : sizeY
				if (positionL !== 'auto' && positionR !== 'auto') measuredSizeX = paddingBoxSizeX - positionL - positionR - marginL - marginR
				if (positionT !== 'auto' && positionB !== 'auto') measuredSizeY = paddingBoxSizeY - positionT - positionB - marginT - marginB
				continue
			}

			measuredSizeX = sizeX === 'fill' ? (contentBoxSizeX - marginL - marginR) : sizeX
			measuredSizeY = sizeY === 'fill' ? (contentBoxSizeY - marginT - marginB) : sizeY

			if (maxSizeX !== 'none' && measuredSizeX > maxSizeX) measuredSizeX = maxSizeX
			if (minSizeX !== 'none' && measuredSizeX < minSizeX) measuredSizeX = minSizeX
			if (maxSizeY !== 'none' && measuredSizeY > maxSizeY) measuredSizeY = maxSizeY
			if (minSizeY !== 'none' && measuredSizeY < minSizeY) measuredSizeY = minSizeY

			total += child.weight

			if (sizeY === 'fill') {

				if (maxSizeY !== 'none' ||
					minSizeY !== 'none') {
					confineds.push(child)
				} else {
					flexibles.push(child)
				}

			} else {

				switch (this.orientation) {
					case 'vertical':
						space -= measuredSizeY - marginT - marginB
						break
					case 'horizontal':
						space -= measuredSizeX - marginL - marginB
						break
				}
			}

			child.measuredSize.x = measuredSizeX
			child.measuredSize.y = measuredSizeY
		}

		for (var i = 0; i < confineds.length; i++) {

			var child = confineds[i]

			var maxSizeX = child.maxSize.x
			var maxSizeY = child.maxSize.y
			var minSizeX = child.minSize.x
			var minSizeY = child.minSize.y

			var maxSize = 0
			var minSize = 0

			switch (this.orientation) {
				case 'vertical':
					maxSize = maxSizeY
					minSize = minSizeY
					break
				case 'horizontal':
					maxSize = maxSizeX
					minSize = minSizeX
			}

			var measuredSize = child.weight / total * space
			if (measuredSize > maxSize) measuredSize = maxSizeY
			if (measuredSize < minSize) measuredSize = minSizeY

			total -= child.weight
			space -= measuredSize

			switch (this.orientation) {
				case 'vertical':
					child.measuredSize.y = measuredSize
					break
				case 'horizontal':
					child.measuredSize.x = measuredSize
					break;
			}
		}

		for (var i = 0; i < flexibles.length; i++) {

			var child = flexibles[i]

			switch (this.orientation) {
				case 'vertical':
					child.measuredSize.y = child.weight / total * space
					break
				case 'horizontal':
					child.measuredSize.x = child.weight / total * space
					break
			}
		}
	},

	/**
	 * @method layout
	 * @since 0.9
	 */
	layout: function(children) {

		var border = this.target.borderWidth
		var paddingT = this.target.padding.top
		var paddingL = this.target.padding.left
		var paddingB = this.target.padding.bottom
		var paddingR = this.target.padding.right

		var paddingBoxSizeX = this.size.x - border * 2
		var paddingBoxSizeY = this.size.y - border * 2
		var contentBoxSizeX = paddingBoxSizeX - paddingL - paddingR
		var contentBoxSizeY = paddingBoxSizeY - paddingT - paddingB

		var offset = 0
		var alignmentX = this.alignment.x
		var alignmentY = this.alignment.y

		for (var i = 0; i < children.length; i++) {

            var child = children[i]

			var positionT = child.position.top
			var positionL = child.position.left
			var positionR = child.position.right
			var positionB = child.position.bottom

			var marginT = child.margin.top
			var marginL = child.margin.left
			var marginR = child.margin.right
			var marginB = child.margin.bottom

			if (positionT !== 'auto' || positionB !== 'auto' &&
				positionL !== 'auto' || positionR !== 'auto') {
				child.measuredOffset.x = positionL + marginL
				child.measuredOffset.y = positionT + marginT
				continue
			}

			var measuredOffsetX = 0
			var measuredOffsetY = 0

			if (this.orientation === 'vertical') {

				switch (alignmentX) {
					case 'start':
						measuredOffsetX = border + paddingL + marginL
						break
					case 'end':
						measuredOffsetX = border + paddingL + contentBoxSizeX - measuredSizeX
						break
					case 'center':
						measuredOffsetX = border + paddingL + contentBoxSizeX / 2 - measuredSizeX / 2
						break
				}

				measuredOffsetY = offset

				offset += child.measuredSize.y

			}

			if (this.orientation === 'horizontal') {

				switch (alignmentY) {
					case 'start':
						measuredOffsetY = border + paddingT + marginT
						break
					case 'end':
						measuredOffsetY = border + paddingT + contentBoxSizeY - measuredSizeY
						break
					case 'center':
						measuredOffsetY = border + paddingT + contentBoxSizeY / 2 - measuredSizeY / 2
						break
				}

				measuredOffsetX = offset

				offset += child.measuredSize.x

			}

			child.measuredOffset.x = measuredOffsetX
			child.measuredOffset.y = measuredOffsetY

			console.log('W', child.measuredSize.x, 'H', child.measuredSize.y, 'X', child.measuredOffset.x, 'Y', child.measuredOffset.y)
		}
	}
})