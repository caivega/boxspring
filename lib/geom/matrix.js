"use strict"

/**
 * @class boxspring.geom.Matrix
 * @super boxspring.Object
 * @since 0.9
 */
 var Matrix = boxspring.define('boxspring.geom.Matrix', {

	//--------------------------------------------------------------------------
	// Properties
	//--------------------------------------------------------------------------

	properties: {

		/**
		 * @property m11
		 * @since 0.9
		 */
		m11: {
			value: 1
		},

		/**
		 * @property m12
		 * @since 0.9
		 */
		m12: {
			value: 0
		},

		/**
		 * @property m13
		 * @since 0.9
		 */
		m13: {
			value: 0
		},

		/**
		 * @property m14
		 * @since 0.9
		 */
		m14: {
			value: 0
		},

		/**
		 * @property m21
		 * @since 0.9
		 */
		m21: {
			value: 0
		},

		/**
		 * @property m22
		 * @since 0.9
		 */
		m22: {
			value: 1
		},

		/**
		 * @property m23
		 * @since 0.9
		 */
		m23: {
			value: 0
		},

		/**
		 * @property m24
		 * @since 0.9
		 */
		m24: {
			value: 0
		},

		/**
		 * @property m31
		 * @since 0.9
		 */
		m31: {
			value: 0
		},

		/**
		 * @property m32
		 * @since 0.9
		 */
		m32: {
			value: 0
		},

		/**
		 * @property m33
		 * @since 0.9
		 */
		m33: {
			value: 1
		},

		/**
		 * @property m34
		 * @since 0.9
		 */
		m34: {
			value: 0
		},

		/**
		 * @property m41
		 * @since 0.9
		 */
		m41: {
			value: 0
		},

		/**
		 * @property m42
		 * @since 0.9
		 */
		m42: {
			value: 0
		},

		/**
		 * @property m43
		 * @since 0.9
		 */
		m43: {
			value: 0
		},

		/**
		 * @property m44
		 * @since 0.9
		 */
		m44: {
			value: 1
		}

	},

    //--------------------------------------------------------------------------
    // Methods
    //--------------------------------------------------------------------------

	/**
	 * @method translate
	 * @since 0.9
	 */
	translate: function(x, y, z) {

		if (x == null) x = 0
		if (y == null) y = 0
		if (z == null) z = 0

		var matrix = [
			1, 0, 0, x,
			0, 1, 0, y,
			0, 0, 1, z,
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
			0, 0, z, 0,
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

		var m11, m12, m13, m14,
		    m21, m22, m23, m24,
		    m31, m32, m33, m34,
		    m41, m42, m43, m44

		if (matrix instanceof Matrix) {
			m11 = matrix.m11
			m12 = matrix.m12
			m13 = matrix.m13
			m14 = matrix.m14
			m21 = matrix.m21
			m22 = matrix.m22
			m23 = matrix.m23
			m24 = matrix.m24
			m31 = matrix.m31
			m32 = matrix.m32
			m33 = matrix.m33
			m34 = matrix.m34
			m41 = matrix.m41
			m42 = matrix.m42
			m43 = matrix.m43
			m44 = matrix.m44
		} else {
			m11 = matrix[0]
			m12 = matrix[1]
			m13 = matrix[2]
			m14 = matrix[3]
			m21 = matrix[4]
			m22 = matrix[5]
			m23 = matrix[6]
			m24 = matrix[7]
			m31 = matrix[8]
			m32 = matrix[9]
			m33 = matrix[10]
			m34 = matrix[11]
			m41 = matrix[12]
			m42 = matrix[13]
			m43 = matrix[14]
			m44 = matrix[15]
		}

		var s11 = (m11 * this.m11) + (m12 * this.m21) + (m13 * this.m31) + (m14 * this.m41)
		var s12 = (m11 * this.m21) + (m12 * this.m22) + (m13 * this.m32) + (m14 * this.m42)
		var s13 = (m11 * this.m31) + (m12 * this.m23) + (m13 * this.m33) + (m14 * this.m43)
		var s14 = (m11 * this.m41) + (m12 * this.m24) + (m13 * this.m34) + (m14 * this.m44)
		var s21 = (m21 * this.m11) + (m22 * this.m21) + (m23 * this.m31) + (m24 * this.m41)
		var s22 = (m21 * this.m21) + (m22 * this.m22) + (m23 * this.m32) + (m24 * this.m42)
		var s23 = (m21 * this.m31) + (m22 * this.m23) + (m23 * this.m33) + (m24 * this.m43)
		var s24 = (m21 * this.m41) + (m22 * this.m24) + (m23 * this.m34) + (m24 * this.m44)
		var s31 = (m31 * this.m11) + (m32 * this.m21) + (m33 * this.m31) + (m34 * this.m41)
		var s32 = (m31 * this.m21) + (m32 * this.m22) + (m33 * this.m32) + (m34 * this.m42)
		var s33 = (m31 * this.m31) + (m32 * this.m23) + (m33 * this.m33) + (m34 * this.m43)
		var s34 = (m31 * this.m41) + (m32 * this.m24) + (m33 * this.m34) + (m34 * this.m44)
		var s41 = (m41 * this.m11) + (m42 * this.m21) + (m43 * this.m31) + (m44 * this.m41)
		var s42 = (m41 * this.m21) + (m42 * this.m22) + (m43 * this.m32) + (m44 * this.m42)
		var s43 = (m41 * this.m31) + (m42 * this.m23) + (m43 * this.m33) + (m44 * this.m43)
		var s44 = (m41 * this.m41) + (m42 * this.m24) + (m43 * this.m34) + (m44 * this.m44)

		this.m11 = s11
		this.m12 = s12
		this.m13 = s13
		this.m14 = s14
		this.m21 = s21
		this.m22 = s22
		this.m23 = s23
		this.m24 = s24
		this.m31 = s31
		this.m32 = s32
		this.m33 = s33
		this.m34 = s34
		this.m41 = s41
		this.m42 = s42
		this.m43 = s43
		this.m44 = s44

		return this
	},

	/**
	 * Reset the current matrix to the identity matrix
	 * @method reset
	 * @since 0.9
	 */
	reset: function() {
		this.m11 = 1
		this.m12 = 0
		this.m13 = 0
		this.m14 = 0
		this.m21 = 0
		this.m22 = 1
		this.m23 = 0
		this.m24 = 0
		this.m31 = 0
		this.m32 = 0
		this.m33 = 1
		this.m34 = 0
		this.m41 = 0
		this.m42 = 0
		this.m43 = 0
		this.m44 = 1
		return this
	}
})