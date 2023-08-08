### Running locally

```
# Install packages
pnpm i

# Run
pnpm start
```

### Technologies

- React
- TypeScript
- Faker
- React-toastify
- SASS
- Jest
- React Testing Library

The table, as well as all of its functionality used here, is a custom generic table component.

### Column reordering and sessions

Press the `Reorder` button at the top of the table to allow columns to be dragged around. This can occur whether or not you are logged in. However, only when logged in can the orders be saved and persisted through sessions.

When first loading into the page, users are logged out by default (the fake 'session' is not persisted, and there is no logout button as it is unnecessary for the criteria). press the Login button to associate the current user with local storage. If column orders had already been saved inside local storage, they will be restored after logging in.

(Note: If you reorder columns first, and _then_ log in, the orders will be _not_ be overridden by the saved ones from the 'logged in user' by design. In a real app, the details of this functionality (whether or not to restore the user's previous save, to show a message saying that a previous save is available, etc.) will be discussed and designed before implementation.)

### Pagination or Infinite scrolling

How I would implement this, at a high level:

1. Make another hook (like [`useSort`](https://github.com/hjklqw/thrive-assessment/blob/main/src/components/table/useSort.tsx) and [`useColumnReorder`](https://github.com/hjklqw/thrive-assessment/blob/main/src/components/table/useColumnReorder.tsx)) to separate concerns, and for cleanliness and readability
2. If doing pagination, create a component that takes in hook values such as the current page, number of results per page, etc. and renders out a pagination control to change the current page number
   a. This component can be rendered within and returned from the hook itself, instead of being separate
   b. If doing infinite scroll, then simply attach an event handler to the relevant scroll container, and increase the page number when the bottom of the page has been reached
3. Feed in data (ex. `const { pagedData } = usePagination(sortedData)`)
4. Output data sliced by current page and num results per page
