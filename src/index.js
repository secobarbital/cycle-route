import routington from 'routington'

export default function makeRouter (routes) {
  const router = routington()
  let defaultRoute
  Object.keys(routes).forEach(route => {
    if (route === '*') {
      defaultRoute = routes[route]
    } else {
      const node = router.define(route)[0]
      node.label = routes[route]
    }
  })
  return function matchRoute (path) {
    const match = router.match(path)
    if (!match) {
      if (defaultRoute) {
        return { path, name: defaultRoute, params: {} }
      } else {
        throw new Error(`No route matched "${path}" and no default "*" route defined`)
      }
    }
    const { param: params, node: { label: name } } = match
    return { path, name, params }
  }
}
