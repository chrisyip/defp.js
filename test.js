'use strict'

import test from 'ava'
import defp from '.'

test('defp', t => {
  t.is(Object.prototype.toString.call(defp), '[object Function]')

  let obj = {}
  let err

  defp(obj, 'foo', 'bar')
  t.is(obj.foo, 'bar')
  t.is(Object.keys(obj).length, 0)
  t.true(obj.hasOwnProperty('foo'))

  err = t.throws(() => Object.defineProperty(obj, 'foo', { value: 'baz' }))
  t.true(err.message.indexOf('Cannot redefine property') > -1)

  err = t.throws(() => { obj.foo = 'baz' })
  t.true(err.message.indexOf('Cannot assign to read only property') > -1)

  defp(obj, 'baz')
  t.true('baz' in obj)
  t.is(obj.baz, undefined)

  const foobar = {}
  defp(obj, 'foobar', foobar)
  t.is(foobar, obj.foobar)
})

test('defp: options `e`', t => {
  const obj = {}
  let err

  defp(obj, 'foo', 'bar', 'e')
  t.true(Object.keys(obj).indexOf('foo') > -1)
  err = t.throws(() => Object.defineProperty(obj, 'foo', { value: 'baz' }))
  t.true(err.message.indexOf('Cannot redefine property') > -1)

  err = t.throws(() => { obj.foo = 'baz' })
  t.true(err.message.indexOf('Cannot assign to read only property') > -1)
})

test('defp: options `c`', t => {
  const obj = {}
  let err

  defp(obj, 'foo', 'bar', 'c')
  t.true(Object.keys(obj).indexOf('foo') === -1)
  Object.defineProperty(obj, 'foo', { value: 'baz' })
  t.is(obj.foo, 'baz')

  err = t.throws(() => { obj.foo = 'bazz' })
  t.true(err.message.indexOf('Cannot assign to read only property') > -1)
})

test('defp: options `w`', t => {
  const obj = {}
  let err

  defp(obj, 'foo', 'bar', 'w')
  t.true(Object.keys(obj).indexOf('foo') === -1)
  err = t.throws(() => Object.defineProperty(obj, 'foo', { value: 'baz', enumerable: true }))
  t.true(err.message.indexOf('Cannot redefine property') > -1)

  obj.foo = 'baz'
  t.is(obj.foo, 'baz')
})

test('defp: options `ewc`', t => {
  const obj = {}

  defp(obj, 'foo', 'bar', 'ewc')
  t.true(Object.keys(obj).indexOf('foo') > -1)

  obj.foo = 'baz'
  t.is(obj.foo, 'baz')

  Object.defineProperty(obj, 'foo', { value: 'baz', enumerable: false })
  t.true(Object.keys(obj).indexOf('foo') === -1)
})

test('defp: getter / setter', t => {
  const obj = {
    _foo: 1
  }

  defp(obj, 'foo', { get () { return this._foo * 2 } })
  t.true(Object.keys(obj).indexOf('foo') === -1)
  t.is(obj.foo, 2)

  defp(obj, 'baz', { set (val) { this._baz = val } })
  obj.baz = 'baz'
  t.is(obj._baz, 'baz')
})

test('defp w/ object value', t => {
  const obj = {}

  defp(obj, {
    foo: { set (val) { this._foo = val }, get () { return this._foo } },
    baz: { value: 'baz', enumerable: true }
  })
  obj.foo = 'foo'
  t.is(obj._foo, 'foo')
  t.is(obj.foo, obj._foo)
  t.true(Object.keys(obj).indexOf('baz') > -1)
})

test('defp w/ properties', t => {
  const obj = {}

  defp(obj, ['foo', 'bar'], 'baz')
  t.is(Object.keys(obj).length, 0)
  t.is(obj.foo, obj.bar)
  t.is(obj.foo, 'baz')
})
