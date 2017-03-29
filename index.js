'use strict'

const isPlainObj = require('is-plain-obj')

const descriptorKeys = {
  e: 'enumerable',
  w: 'writable',
  c: 'configurable'
}

const preservedKeys = ['get', 'set', 'value', 'enumerable', 'configurable']

function makeDescriptor (options) {
  const descriptor = {}

  if (typeof options === 'string') {
    const keys = options.split('')

    for (let i = 0; i < keys.length; i++) {
      if (keys[i] in descriptorKeys) {
        descriptor[descriptorKeys[keys[i]]] = true
      }
    }
  }

  return descriptor
}

function handleValue (value, descriptor) {
  if (isPlainObj(value)) {
    for (let i = 0; i < preservedKeys.length; i++) {
      if (value.hasOwnProperty(preservedKeys[i])) {
        return Object.assign(descriptor, value)
      }
    }
  }

  descriptor.value = value

  return descriptor
}

module.exports = function defp (obj, key, value, options) {
  if (isPlainObj(key)) {
    const descriptor = makeDescriptor(value)

    for (const k in key) {
      if (key.hasOwnProperty(k)) {
        const _d = Object.assign({}, descriptor)
        handleValue(key[k], _d)
        Object.defineProperty(obj, k, _d)
      }
    }

    return
  }

  const descriptor = makeDescriptor(options)
  handleValue(value, descriptor)

  if (Array.isArray(key)) {
    for (let i = 0; i < key.length; i++) {
      Object.defineProperty(obj, key[i], descriptor)
    }
    return
  }

  Object.defineProperty(obj, key, descriptor)
}
