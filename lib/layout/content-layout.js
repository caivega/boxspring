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

		/**
		 * @property target
		 * @since 0.9
		 */
		target: {
			value: null
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
		 * @property size
		 * @since 0.9
		 */
		size: {
			value: function() {
				return new boxspring.geom.Size()
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

		//
		// measure all children
		//

		var flexibles = []
		var confineds = []
		var space = contentBoxSize
		var total = 0

		// measure all fixed childs, filter flexible and confined (fleible + min/max width/height)
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

			child.measuredSize.x = measuredSizeX
			child.measuredSize.y = measuredSizeY

			total += child.weight

			var used = 0
			var size = 0
			var maxSize = 0
			var minSize = 0

			switch (this.orientation) {
				case 'vertical':
					size = sizeY
					used = measuredSizeY - marginT - marginB
					maxSize = maxSizeY
					minSize = minSizeY
					break
				case 'horizontal':
					size = sizeX
					used = measuredSizeX - marginL - marginR
					maxSize = maxSizeX
					minSize = minSizeX
					break
				}

			if (size === 'fill') {
				if (maxSize !== 'none' ||
					minSize !== 'none') {
					confineds.push(child)
				} else {
					flexibles.push(child)
				}
			} else {
				space -= used
			}
		}

		// measured confined elements
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

		// measure flexible elements
		for (var i = 0; i < flexibles.length; i++) {

			var child = flexibles[i]

			var marginT = child.margin.top
			var marginL = child.margin.left
			var marginR = child.margin.right
			var marginB = child.margin.bottom

			var used = child.weight / total * space

			switch (this.orientation) {
				case 'vertical':
					child.measuredSize.y = used - marginT - marginB
					break
				case 'horizontal':
					child.measuredSize.x = used - marginR - marginL
					break
			}
		}

		//
		// position
		//

		var offset = border + paddingT
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

			switch (this.orientation) {

				case 'vertical':

					child.measuredOffset.y = offset + marginT

					switch (alignmentX) {
						case 'start':
							child.measuredOffset.x = border + paddingL + marginL
							break
						case 'center':
							child.measuredOffset.x = border + paddingL + contentBoxSizeX - measuredSizeX
							break
						case 'end':
							child.measuredOffset.x = border + paddingL + contentBoxSizeX / 2 - measuredSizeX / 2
							break
					}

					offset += child.measuredSize.y + marginT + marginB

					break

				case 'horizontal':

					child.measuredOffset.x = offset + marginL

					switch (alignmentY) {
						case 'start':
							child.measuredOffset.y = border + paddingT + marginT
							break
						case 'end':
							child.measuredOffset.y = border + paddingT + contentBoxSizeY - measuredSizeY
							break
						case 'center':
							child.measuredOffset.y = border + paddingT + contentBoxSizeY / 2 - measuredSizeY / 2
							break
					}

					offset += child.measuredSize.x + marginL + marginR

					break
			}
		}
	}
})