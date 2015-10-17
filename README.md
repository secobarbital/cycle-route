# Cycle Route

A simple router factory that takes a static map of route => label and returns a function that maps a path to a route object of the form

```js
{
  path: '/',
  name: 'home',
  params: {}
}
```

It was created to be used with [```cycle-pushstate-driver```](https://github.com/secobarbital/cycle-pushstate-driver) but is a generic URL mapper that can be as a helper in any routing engine.

## Install

```sh
npm install @cycle-route
```

## Usage

Basics:

```js
import makeRouter from ‘cycle-route’

const router = makeRouter({
  ‘/’: ‘home’,
  ‘/foo/:bar’: ‘foo’,
  ‘*’: ‘notfound’          // default route
})

router(‘/’)
```

[Cycle.js](http://cycle.js.org/) use case:

```js
import { makePushStateDriver } from ‘cycle-pushstate-driver’
import makeRouter from ‘cycle-route’
import routes from ‘routes’

const router = makeRouter(routes)

function main({ DOM, Path }) {
  const Route = Path
    .map(router)

  const homeRequests = home({ Route })
  const fooRequests = foo({ Route })
  const barRequests = bar({ Route })

  const localLinkClick$ = DOM.select('a').events('click')
    .filter(e => e.currentTarget.host === global.location.host)

  const navigate$ = DOM.select(‘a’).events(‘click’)
    .map(e => e.currentTarget.pathname)

  const vtree$ = Rx.Observable.combineLatest(
    Route, homeRequests.DOM, fooRequests.DOM, barRequests.DOM,
    (route, homePage, fooPage, barPage) => {
      const pages = {
        ‘home’: homePage,
        ‘foo’: fooPage,
        ‘bar’: barPage
      }
      return pages[route.name]
    }
  )

  return {
    DOM: vtree$,
    Path: navigate$,
    PreventDefault: localLinkClick$
  };
}
```
