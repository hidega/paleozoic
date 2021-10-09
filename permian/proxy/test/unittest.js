var assert = require('assert')
var createRedirectUrl = require('../src/create-redirect-url')
var parseOpts = require('../src/parse-opts')

var caseCreateRedirectUrl = () => {
  assert.deepEqual(createRedirectUrl('/fullpath1/a/b?x=1&y=2', {
    selector: 'fullpath1',
    hosts: ['some-host'],
    port: 1234,
    path: 'p/q'
  }), {
    location: 'some-host:1234',
    path: 'p/q/a/b?x=1&y=2'
  })
  assert.deepEqual(createRedirectUrl('/fullpath1/a/b', {
    selector: 'fullpath1',
    hosts: ['some-host'],
    port: 1234,
    path: 'p/q'
  }), {
    location: 'some-host:1234',
    path: 'p/q/a/b'
  })
  assert.deepEqual(createRedirectUrl('/full-path1/a/b?', {
    selector: 'full-path1',
    hosts: ['some-host'],
    port: 1234,
    path: 'p/q'
  }), {
    location: 'some-host:1234',
    path: 'p/q/a/b'
  })
  assert.deepEqual(createRedirectUrl('/full.path/a/b?u', {
    selector: 'full.path',
    hosts: ['some-host'],
    port: 1234,
  }), {
    location: 'some-host:1234',
    path: 'a/b?u'
  })
  assert.deepEqual(createRedirectUrl('/', {
    selector: '',
    hosts: ['some-host'],
    port: 1234,
  }), {
    location: 'some-host:1234',
    path: ''
  })
  assert.deepEqual(createRedirectUrl('/?m=6', {
    selector: '',
    hosts: ['some-host'],
    port: 1234,
  }), {
    location: 'some-host:1234',
    path: '?m=6'
  })
  assert.deepEqual(createRedirectUrl('/', {
    selector: '',
    hosts: ['some-host'],
    path: 'p',
    port: 1234,
  }), {
    location: 'some-host:1234',
    path: 'p'
  })
  assert.deepEqual(createRedirectUrl('/full.path/a', {
    selector: 'full.path',
    port: 1234,
  }), {
    location: 'http://127.0.0.1:1234',
    path: 'a'
  })
  assert.equal(createRedirectUrl('/full.path/a/b?u', {
    selector: 'full.path.ext',
    hosts: ['some-host'],
    port: 1234,
  }), false)
}

var caseValidateOptions = () => {
  assert.throws(() => parseOpts({
    mode: 'http',
    redirectionTable: []
  }))
  assert.throws(() => parseOpts({
    mode: 'http'
  }))
  parseOpts({
    mode: 'http',
    redirectionTable: [{
      selector: '',
      port: 567
    }]
  })
  assert.throws(() => parseOpts({
    mode: 'httpx',
    redirectionTable: [{
      selector: '',
      port: 567
    }]
  }))
  assert.throws(() => parseOpts({
    mode: 'http',
    redirectionTable: [{
      selector: '',
      a: 1,
      port: 567
    }]
  }))
  assert.throws(() => parseOpts({
    mode: 'https',
    redirectionTable: [{
      selector: '',
      port: 57
    }]
  }))
  assert.throws(() => parseOpts({
    mode: 'https',
    redirectionTable: [{
      selector: '',
      port: 5788888
    }]
  }))
  assert.throws(() => parseOpts({
    mode: 'https',
    redirectionTable: [{
      selector: 'sele ctor1',
      port: 576
    }]
  }))
  assert.throws(() => parseOpts({
    mode: 'http',
    redirectionTable: [{
      selector: 'select/or1',
      port: 5788
    }]
  }))
  assert.throws(() => parseOpts({
    mode: 'https',
    redirectionTable: [{
      selector: '/selector1',
      port: 577
    }]
  }))
  assert.throws(() => parseOpts({
    mode: 'https',
    redirectionTable: [{
      path: 'jhgjh/ff  gfd/k',
      selector: 'selector1',
      port: 577
    }]
  }))
  assert.throws(() => parseOpts({
    mode: 'https',
    redirectionTable: [{
      path: '/jhgjh///gfd/k',
      selector: 'selector1',
      port: 577
    }]
  }))
  assert.throws(() => parseOpts({
    mode: 'https',
    redirectionTable: [{
      path: 'jhgjh/ff  gfd/k',
      selector: 'selector1',
      port: 577
    }]
  }))
  assert.throws(() => parseOpts({
    mode: 'https',
    redirectionTable: [{
      hosts: 1,
      path: 'jhgjh/ffd/k',
      selector: 'selector1',
      port: 577
    }]
  }))
  assert.throws(() => parseOpts({
    mode: 'https',
    redirectionTable: [{
      hosts: [],
      path: 'jhgjh/fgfd/k',
      selector: 'selector1',
      port: 577
    }]
  }))
}

caseValidateOptions()
caseCreateRedirectUrl()
