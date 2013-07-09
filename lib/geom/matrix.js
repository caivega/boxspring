"use strict"

/**
 * A transformation matrix.
 * @class boxspring.geom.Matrix
 * @since 0.9
 */
 var Matrix = boxspring.define('boxspring.geom.Matrix', {

	//--------------------------------------------------------------------------
	// Properties
	//--------------------------------------------------------------------------

	properties: {

		/**
		 * The scale on the x axis.
		 * @property scaleX
		 * @since 0.9
		 */
		scaleX: {
			value: 0
		},

		/**
		 * The scale on the y axis.
		 * @property scaleY
		 * @since 0.9
		 */
		scaleY: {
			value: 0
		},

		/**
		 * The scale on the z axis.
		 * @property scaleZ
		 * @since 0.9
		 */
		scaleZ: {
			value: 0
		},

		/**
		 * The shear on the x axis.
		 * @property shearX
		 * @since 0.9
		 */
		shearX: {
			value: 0
		},

		/**
		 * The shear on the y axis.
		 * @property shearY
		 * @since 0.9
		 */
		shearY: {
			value: 0
		},

		/**
		 * The shear on the y axis.
		 * @property shearY
		 * @since 0.9
		 */
		shearZ: {
			value: 0
		},

		/**
		 * The rotation on the x axis.
		 * @property rotateX
		 * @since 0.9
		 */
		rotateX: {
			value: 0
		},

		/**
		 * The rotation on the y axis.
		 * @property rotateX
		 * @since 0.9
		 */
		rotateY: {
			value: 0
		},

		/**
		 * The rotation on the z axis.
		 * @property rotateX
		 * @since 0.9
		 */
		rotateZ: {
			value: 0
		},

		/**
		 * The translation on the x axis.
		 * @property translateX
		 * @since 0.9
		 */
		translateX: {
			value: 0
		},

		/**
		 * The translation on the y axis.
		 * @property translateY
		 * @since 0.9
		 */
		translateY: {
			value: 0
		},

		/**
		 * The translation on the z axis.
		 * @property translateZ
		 * @since 0.9
		 */
		translateZ: {
			value: 0
		}
	},

    //--------------------------------------------------------------------------
    // Methods
    //--------------------------------------------------------------------------

    /**
     * Initialize the object.
     * @method constructor
     * @since 0.9
     */
	constructor: function() {
		return Matrix.parent.constructor.call(this)
	},

    /**
     * Prepare this object for garbage collection.
     * @method destroy
     * @since 0.9
     */
	destroy: function() {
		return Matrix.parent.destroy.call(this)
	},

	/**
	 * Apply a translate transformation to the current matrix
	 * @method translate
	 * @since 0.9
	 */
	translate: function(x, y, z) {

		if (x == null) x = 0
		if (y == null) y = 0
		if (z == null) z = 0

		var matrix = [
			1, 0, 0, 0,
			0, 1, 0, 0,
			x, y, 1, 0,
			0, 0, 0, 1
		]

		return this.combine(matrix)
	},

	/**
	 * Apply a scale transformation to the current matrix
	 * @method scale
	 * @since 0.9
	 */
	scale: function(x, y, z) {

		if (x == null) x = 1
		if (y == null) y = 1
		if (z == null) z = 1

		var matrix = [
			x, 0, 0, 0,
			0, y, 0, 0,
			0, 0, 1, 0,
			0, 0, 0, 1
		]

		return this.combine(matrix)
	},

	/**
	 * Apply a rotation transformation to the current matrix
	 * @method rotate
	 * @since 0.9
	 */
	rotate: function(x, y, z) {

		if (x == null) x = 0
		if (y == null) y = 0
		if (z == null) z = 0

		var s = Math.sin(x);
		var c = Math.cos(y);

		var matrix = [
			c, s, 0, 0,
		   -s, c, 0, 0,
			0, 0, 1, 0,
			0, 0, 0, 1
		]

		return this.combine(matrix)
	},

	/**
	 * Apply a shear transformation to the current matrix
	 * @method shear
	 * @since 0.9
	 */
	shear: function(x, y, z) {

		if (x == null) x = 0
		if (y == null) y = 0
		if (z == null) z = 0

		var x = Math.tan(x)
		var y = Math.tan(y)

		var matrix = [
			1, x, 0, 0,
			y, 1, 0, 0,
			0, 0, 1, 0,
			0, 0, 0, 1
		]

		return this.combine(matrix)
	},

	/**
	 * Combine the specified matrix to the current values
	 * @method combine
	 * @since 0.9
	 */
	combine: function(matrix) {

		var a, b, c, d, e, f

		if (matrix instanceof Matrix) {
			a = matrix.a
			b = matrix.b
			c = matrix.c
			d = matrix.d
			e = matrix.e
			f = matrix.f
		} else {
			a = matrix[0]
			b = matrix[1]
			c = matrix[3]
			d = matrix[4]
			e = matrix[6]
			f = matrix[7]
		}

		// a b 0     ma mb 0
		// c d 0  *  mc md 0
		// e f 1     me mf 1

		this.values = [
			(a * this.a + b * this.c + 0 * this.e), (a * this.b + b * this.d + 0 * this.f), 0,
			(c * this.a + d * this.c + 0 * this.e), (c * this.b + d * this.d + 0 * this.f), 0,
			(e * this.a + f * this.c + 1 * this.e), (e * this.b + f * this.d + 1 * this.f), 1
		]

		return this
	},

	/**
	 * Reset the current matrix to the identity matrix
	 * @method reset
	 * @since 0.9
	 */
	reset: function() {

		this.scaleX = 1
		this.scaleY = 1
		this.scaleZ = 1

		this.translateX = 0
		this.translateY = 0
		this.translateZ = 0



		this.values = [
			1, 0, 0, 0,
			0, 1, 0, 0,
			0, 0, 1, 0,
			0, 0, 0, 1
		]

		return this
	}


})