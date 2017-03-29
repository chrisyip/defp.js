# defp.js

Define object properties in an easier way. Inspired by [prr](https://github.com/rvagg/prr).

## Install

```
npm i defp
```

## Requirements

- `defp` written in ES2015, use transpiler when needed
- Add `Object.assign` polyfill if it's not available

## Usage

```js
const defp = require('defp')

defp(TARGET_OBJECT, KEY, [VALUE, [DESCRIPTOR_OPTIONS]])
```

```js
defp(obj, 'foo', 'baz')
```

Equals to:

```js
Object.defineProperty(obj, 'foo', {
  configurable: false,
  enumerable: false,
  writable: false,
  value: 'baz'
})
```

### Descriptor options

```js
defp(obj, 'foo', 'baz', 'cew')
// c === configurable
// e === enumerable
// w === writable

defp(obj, 'foo', {
  configurable: true,
  enumerable: true,
  writable: true,
  value: 'baz'
})
```

Equals:

```js
Object.defineProperty(obj, 'foo', {
  configurable: true,
  enumerable: true,
  writable: true,
  value: 'baz'
})
```

`getter` and `setter`:

```js
defp(obj, 'foo', {
  get () { return this._foo },
  set (val) { this._foo = val }
})
```

Overriding descriptor options for special key:

```js
defp(obj, {
  privateVar: {
    enumerable: false,
    value: 'privateVar'
  },

  publicVar: 'publicVar'
}, 'ew')
```

Note:

- If `VALUE` contains one of these keys: `get`, `set`, `value`, `enumerable`, `configurable`, `defp` will treat `VALUE` as a descriptor.

