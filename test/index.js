import test from 'tape'
import makeRouter from '../src'
/**
import { Rx } from '@cycle/core'

const { onNext } = Rx.ReactiveTest

function compareMessages (t, actual, expected) {
  t.equal(actual.length, expected.length, 'messages should be same length')
  expected.forEach((message, i) => {
    t.ok(
      Rx.internals.isEqual(actual[i], message),
      'message should be equal'
    )
  })
}
*/

test('makeRouter should return a function', t => {
  const router = makeRouter({})
  t.equal(typeof router, 'function')
  t.end()
})

test('route should create route objects from paths', t => {
  const routes = {
    '/': 'owers',
    '/owers/:ower': 'owees',
    '/transactions/:ower/:owee': 'transactions',
    '*': 'notfound'
  }
  const matchRoute = makeRouter(routes)
  const expected = {
    '/': {
      path: '/',
      name: 'owers',
      params: {}
    },
    '/owers/tom': {
      path: '/owers/tom',
      name: 'owees',
      params: {
        ower: 'tom'
      }
    },
    '/transactions/dick/harry': {
      path: '/transactions/dick/harry',
      name: 'transactions',
      params: {
        ower: 'dick',
        owee: 'harry'
      }
    },
    '/foo': {
      path: '/foo',
      name: 'notfound',
      params: {}
    },
    '/foo/bar': {
      path: '/foo/bar',
      name: 'notfound',
      params: {}
    }
  }
  Object.keys(expected).forEach(path => {
    t.deepEqual(matchRoute(path), expected[path])
  })
  t.end()
})

test('route should throw on unmatched paths without default route', t => {
  const routes = {
    '/': 'home'
  }
  const matchRoute = makeRouter(routes)
  t.throws(() => matchRoute('/foo'))
  t.end()
})
