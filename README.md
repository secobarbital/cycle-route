# Cycle Route

A simple router factory that takes a static map of route => label and returns a function that maps a path to a route object.

It was created to be used with [```cycle-pushstate-driver```](https://github.com/secobarbital/cycle-pushstate-driver) but is a generic URL mapper that can be as a helper in any routing engine.

## Install

```sh
npm install cycle-route
```

## API

### ```makeRouter(routes)```

Takes as input a map from route definition to route name and returns a router function. ```cycle-route``` uses [```routington```](https://github.com/pillarjs/routington) so it accepts all route definitions that ```routington``` accepts and adds a ```*``` route to define the default route.

## Format of route object

```js
{
  path: '/',         // this is the input path
  name: 'home',      // this is the value from the routes map
  params: {}         // this are the matched params
}
```

## Usage

Basics:

```js
import { makeRouter } from 'cycle-route'

const router = makeRouter({
  '/': 'home',
  '/foo/:bar': 'foo',
  '*': 'notfound'          // default route
})

router('/')
```

[Cycle.js](http://cycle.js.org/) use case:

```js
import { makePushStateDriver } from 'cycle-pushstate-driver'
import { makeRouter } from 'cycle-route'
import routes from 'routes'

const router = makeRouter(routes)

function main({ DOM, Path }) {
  const Route = Path
    .map(router)

  const homeRequests = home({ Route })
  const fooRequests = foo({ Route })
  const barRequests = bar({ Route })

  const localLinkClick$ = DOM.select('a').events('click')
    .filter(e => e.currentTarget.host === global.location.host)

  const navigate$ = DOM.select('a').events('click')
    .map(e => e.currentTarget.pathname)

  const vtree$ = Rx.Observable.combineLatest(
    Route, homeRequests.DOM, fooRequests.DOM, barRequests.DOM,
    (route, homePage, fooPage, barPage) => {
      const pages = {
        'home': homePage,
        'foo': fooPage,
        'bar': barPage
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
