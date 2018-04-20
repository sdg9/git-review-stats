Build website Data

```
// Get data
yarn test graphql-test
// Write to JSON
yarn test stats-test
// Run website
cd web
yarn start
```

TODO:
- Update graphql query to account for not yet merged PRs,
  - Currently query only grabs merged prs, but cursor it uses makes it jump too far into the future if an older PR is not yet merged yet
- Fix any eslint/flow issues
- Count emoji toward comment interactions
