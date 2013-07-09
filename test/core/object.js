"use strict"

var expect = require('expect.js')
var sinon  = require('sinon')

require('../../lib/core')
require('../../lib/event/event')

describe('boxspring.Object', function() {

	var View = boxspring.define({
	    properties: {
	        frame: {
	            value: function() {
	                return new Frame()
	            }
	        }
	    }
	})

	 var Frame = boxspring.define({
	    properties: {
	        size: {
	            value: function() {
	                return new Size()
	            }
	        }
	    }
	 })

	var Size = boxspring.define({
	    properties: {
	        x: {
	            value: 0
	        },
	        y: {
	        	value: 0
	        }
	    }
	})

	//--------------------------------------------------------------------------
	// properties
	//--------------------------------------------------------------------------

	describe('Properties', function() {

		var fn = function(value) {
			return function() {
				return value
			}
		}

		it('should assign and read a property to an object using a path', function() {

			var view = new View()
			view.set('frame.size.x', 10)

			var size = new Size()
			size.set('x', 10)

			expect(view.frame.size.x).to.be(10)
			expect(size.x).to.be(10)

			var v1 = view.get('frame.size.x')
			var v2 = size.get('x')

			expect(v1).to.be(10)
			expect(v2).to.be(10)
		})

		it('should assign "false" as the property default value', function() {

			var Test = boxspring.define({
				properties: {
					foo: { value: false }
				}
			})

			expect(new Test().foo).to.be(false)
		})

		it('should assign "false" as the property default value using a function', function() {

			var Test = boxspring.define({
				properties: {
					foo: { value: fn(false) }
				}
			})

			expect(new Test().foo).to.be(false)
		})

		it('should assign "true" as the property default value', function() {

			var Test = boxspring.define({
				properties: {
					foo: { value: true }
				}
			})

			expect(new Test().foo).to.be(true)
		})

		it('should assign "true" as the property default value using a function', function() {

			var Test = boxspring.define({
				properties: {
					foo: { value: fn(true) }
				}
			})

			expect(new Test().foo).to.be(true)
		})

		it('should assign "null" as the property default value', function() {

			var Test = boxspring.define({
				properties: {
					foo: { value: null }
				}
			})

			expect(new Test().foo).to.be(null)
		})

		it('should assign "null" as the property default value using a function', function() {

			var Test = boxspring.define({
				properties: {
					foo: { value: fn(null) }
				}
			})

			expect(new Test().foo).to.be(null)
		})

		it('should assign a falsy numeric value as the property default value', function() {

			var Test = boxspring.define({
				properties: {
					foo: { value: 0 }
				}
			})

			expect(new Test().foo).to.be(0)
		})

		it('should assign a falsy numeric value as the property default value using a function', function() {

			var Test = boxspring.define({
				properties: {
					foo: { value: fn(0) }
				}
			})

			expect(new Test().foo).to.be(0)
		})

		it('should assign a truthy numeric value as the property default value', function() {

			var Test = boxspring.define({
				properties: {
					foo: { value: 1 }
				}
			})

			expect(new Test().foo).to.be(1)
		})

		it('should assign a truthy numeric value as the property default value using a function', function() {

			var Test = boxspring.define({
				properties: {
					foo: { value: fn(1) }
				}
			})

			expect(new Test().foo).to.be(1)
		})

		it('should assign an empty string as the property default value', function() {

			var Test = boxspring.define({
				properties: {
					foo: { value: '' }
				}
			})

			expect(new Test().foo).to.be('')
		})

		it('should assign an empty string as the property default value using a function', function() {

			var Test = boxspring.define({
				properties: {
					foo: { value: fn('') }
				}
			})

			expect(new Test().foo).to.be('')
		})

		it('should assign a string as the property default value', function() {

			var Test = boxspring.define({
				properties: {
					foo: { value: 'bar' }
				}
			})

			expect(new Test().foo).to.be('bar')
		})

		it('should assign a string as the property default value using a function', function() {

			var Test = boxspring.define({
				properties: {
					foo: { value: fn('bar') }
				}
			})

			expect(new Test().foo).to.be('bar')
		})

		it('should assign an object as a property default’s value using a function', function() {

			var Type = boxspring.define({})
			var Test = boxspring.define({
				properties: {
					foo: { value: function() {
						return new Type()
					}}
				}
			})

			expect(new Test().foo instanceof Type).to.be(true)
		});

		it('should properly call the onSet, onGet and onChange callback', function() {

			var setterCalled = false
			var getterCalled = false
			var changeCalled = false

			var Test = boxspring.define({
				properties: {
					foo: {
						onSet: function() {
							setterCalled = true
						},
						onGet: function() {
							getterCalled = true
						},
						onChange: function() {
							changeCalled = true;
						}
					}
				}
			})

			var instance = new Test()
			instance.foo = 'bar'
			instance.foo

			expect(setterCalled).to.be(true)
			expect(getterCalled).to.be(true)
			expect(changeCalled).to.be(true)
		})

		it('should call the onSet callback when the value changes only', function() {

			var called = false

			var Test = boxspring.define({
				properties: {
					foo: {
						value: 'bar',
						onSet: function() {
							called = true
						}
					}
				}
			})

			var instance = new Test
			instance.foo = 'bar'

			expect(called).to.be(false)
		})

		it('should call the onSet callback with the proper parameters', function(done) {

			var Test = boxspring.define({
				properties: {
					foo: {
						value: 'bar',
						onSet: function(newValue, oldValue) {
							expect(newValue).to.be('baz')
							expect(oldValue).to.be('bar')
							done()
						}
					}
				}
			})

			var instance = new Test()
			instance.foo = 'baz'
		})

		it('should call the onSet callback and set the value returned by the callback', function() {

			var Test = boxspring.define({
				properties: {
					foo: {
						value: 'bar',
						onSet: function(newValue, oldValue) {
							return 'nop'
						}
					}
				}
			})

			var instance = new Test()
			instance.foo = 'baz'

			expect(instance.foo).to.be('nop')
		})

		it('should call the onGet when the value is retrieved', function() {

			var called = false

			var Test = boxspring.define({
				properties: {
					foo: {
						value: 'bar',
						onGet: function() {
							called = true
						}
					}
				}
			})

			var instance = new Test
			instance.foo

			expect(called).to.be(true)
		})

		it('should call the onGet callback with the proper parameters', function(done) {

			var Test = boxspring.define({
				properties: {
					foo: {
						value: 'bar',
						onSet: function(value) {
							expect(value).to.be('baz')
							done()
						}
					}
				}
			})

			var instance = new Test()
			instance.foo = 'baz'
			instance.foo
		})

		it('should call the onGet callback and return the value returned by the callback', function() {

			var Test = boxspring.define({
				properties: {
					foo: {
						value: 'bar',
						onGet: function() {
							return 'nop'
						}
					}
				}
			})

			var instance = new Test()
			instance.foo = 'baz'

			expect(instance.foo).to.be('nop')
		})

		it('should inherit descriptors', function() {

			var getterCalled = false
			var setterCalled = false

			var SuperClass = boxspring.define({
				properties: {
					foo: {
						onGet: function(value) {
							getterCalled = true
						}
					}
				}
			})

			var SubClass = boxspring.define({
				inherits: SuperClass,
				properties: {
					foo: {
						onSet: function(value) {
							setterCalled = true
						}
					}
				}
			})

			var instance = new SubClass()
			instance.foo = 'bar'
			instance.foo

			expect(getterCalled).to.be(true)
			expect(setterCalled).to.be(true)
		})

	})

	//--------------------------------------------------------------------------
	// observers
	//--------------------------------------------------------------------------

	describe('Listeners', function() {

		it('should observe the property of an object', function() {

			var callback = sinon.spy()

			var size = new Size()
			size.addPropertyChangeListener('x', callback)
			size.addPropertyChangeListener('y', callback)
			size.x = 10
			size.y = 10

			expect(callback.callCount).to.be(2)
		})

		it('should stop observing the property of an object', function() {

			var callback = sinon.spy()

			var size = new Size()
			size.addPropertyChangeListener('x', callback)
			size.addPropertyChangeListener('y', callback)
			size.x = 10
			size.y = 10
			size.removePropertyChangeListener('x', callback)
			size.removePropertyChangeListener('y', callback)
			size.x = 100
			size.y = 100

			expect(callback.callCount).to.be(2)
		})

		it('should observe the property of an object as a path', function() {

			var callback = sinon.spy()

			var view = new View()
			view.addPropertyChangeListener('frame.size.x', callback)
			view.addPropertyChangeListener('frame.size.y', callback)
			view.frame.size.x = 10
			view.frame.size.y = 10

			expect(callback.callCount).to.be(2)
		})

		it('should stop observing the property of an object as a path', function() {

			var callback = sinon.spy()

			var view = new View()
			view.addPropertyChangeListener('frame.size.x', callback)
			view.addPropertyChangeListener('frame.size.y', callback)
			view.frame.size.x = 10
			view.frame.size.y = 10
			view.removePropertyChangeListener('frame.size.x', callback)
			view.removePropertyChangeListener('frame.size.y', callback)
			view.frame.size.x = 100
			view.frame.size.y = 100

			expect(callback.callCount).to.be(2)
		})

		it('should handle multiple callbacks', function() {

			var callback1 = sinon.spy()
			var callback2 = sinon.spy()

			var view = new View()
			view.addPropertyChangeListener('frame.size.x', callback1)
			view.addPropertyChangeListener('frame.size.y', callback1)
			view.addPropertyChangeListener('frame.size.x', callback2)
			view.addPropertyChangeListener('frame.size.y', callback2)

			view.frame.size.x = 200
			view.frame.size.y = 200

			expect(callback1.callCount).to.be(2)
			expect(callback2.callCount).to.be(2)
		})

		it('should continue observing the values in a path even if the object change', function() {

			var callback = sinon.spy()

			var frame = new Frame()
			frame.size.x = 100
			frame.size.y = 100

			var view = new View()
			view.addPropertyChangeListener('frame.size.x', callback)
			view.addPropertyChangeListener('frame.size.y', callback)

			view.frame = frame
			view.frame.size.x = 200
			view.frame.size.y = 200

			expect(callback.callCount).to.be(4)
		})

		it('should continue observing the values in a path even if the object change with multiple callbacks', function() {

			var callback1 = sinon.spy()
			var callback2 = sinon.spy()

			var frame = new Frame()
			frame.size.x = 100
			frame.size.y = 100

			var view = new View()
			view.addPropertyChangeListener('frame.size.x', callback1)
			view.addPropertyChangeListener('frame.size.y', callback1)
			view.addPropertyChangeListener('frame.size.x', callback2)
			view.addPropertyChangeListener('frame.size.y', callback2)

			view.frame = frame
			view.frame.size.x = 200
			view.frame.size.y = 200

			expect(callback1.callCount).to.be(4)
			expect(callback2.callCount).to.be(4)
		})

		it('should continue observing the values in a path even if the object change with multiple callbacks', function() {

			var callback1 = sinon.spy()
			var callback2 = sinon.spy()

			var frame = new Frame()
			frame.size.x = 100
			frame.size.y = 100

			var view = new View()
			view.addPropertyChangeListener('frame.size.x', callback1)
			view.addPropertyChangeListener('frame.size.y', callback1)
			view.addPropertyChangeListener('frame.size.x', callback2)
			view.addPropertyChangeListener('frame.size.y', callback2)

			view.frame = frame
			view.frame.size.x = 200
			view.frame.size.y = 200

			expect(callback1.callCount).to.be(4)
			expect(callback2.callCount).to.be(4)
		})

		it('should stop dispatching the event if required', function() {

			var spy1 = sinon.spy()
			var spy2 = sinon.spy()

			var callback1 = function(target, property, newValue, oldValue, event) {
				event.cancel()
				spy1()
			}

			var callback2 = function(target, property, newValue, oldValue, event) {
				spy2()
			}

			var view = new View()
			view.addPropertyChangeListener('frame.size.x', callback1)
			view.addPropertyChangeListener('frame.size.y', callback1)
			view.addPropertyChangeListener('frame.size.x', callback2)
			view.addPropertyChangeListener('frame.size.y', callback2)

			view.frame.size.x = 200
			view.frame.size.y = 200

			expect(spy1.callCount).to.be(2)
			expect(spy2.callCount).to.be(0)
		})

		it('should stop dispatching the event if required with that path thing', function() {

			var spy1 = sinon.spy()
			var spy2 = sinon.spy()

			var callback1 = function(target, property, newValue, oldValue, event) {
				event.cancel()
				spy1()
			}

			var callback2 = function(target, property, newValue, oldValue, event) {
				spy2()
			}

			var frame = new Frame()
			frame.size.x = 100
			frame.size.y = 100

			var view = new View()
			view.addPropertyChangeListener('frame.size.x', callback1)
			view.addPropertyChangeListener('frame.size.y', callback1)
			view.addPropertyChangeListener('frame.size.x', callback2)
			view.addPropertyChangeListener('frame.size.y', callback2)

			view.frame = frame
			view.frame.size.x = 200
			view.frame.size.y = 200

			expect(spy1.callCount).to.be(4)
			expect(spy2.callCount).to.be(0)
		})

	})
})