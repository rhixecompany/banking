# React Patterns and Techniques

## React Bits Overview

React Bits is a collection of React patterns, techniques, tips and tricks compiled from various sources. This document covers key patterns used in this project.

## Design Patterns and Techniques

### Conditional in JSX

```jsx
// Using && for conditional rendering
{
  show && <Component />;
}

// Using ternary for if-else
{
  isLoggedIn ? <Dashboard /> : <Login />;
}

// Using IIFE for complex conditions
{
  (() => {
    if (condition1) return <Component1 />;
    if (condition2) return <Component2 />;
    return <Default />;
  })();
}
```

### Async Nature Of setState

setState is asynchronous. Use the callback form or componentDidUpdate:

```jsx
this.setState({ count: this.state.count + 1 }, () => {
  console.log("State updated:", this.state.count);
});
```

### Dependency Injection

Pass dependencies as props rather than importing directly:

```jsx
function UserList({ userService, onSelect }) {
  const users = userService.getUsers();
  return (
    <ul>
      {users.map(u => (
        <li onClick={() => onSelect(u)}>{u.name}</li>
      ))}
    </ul>
  );
}
```

### Context Wrapper

Use context for global state:

```jsx
const UserContext = React.createContext();

function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
}
```

### Event Handlers

Bind handlers in constructor or use arrow functions:

```jsx
// Constructor binding
this.handleClick = this.handleClick.bind(this);

// Arrow function
handleClick = () => { ... }

// Inline arrow (creates new function each render)
onClick={(e) => this.handleClick(e)}
```

### One Way Data Flow

Data flows down, events flow up. Parent passes props to children, children call callbacks passed from parent.

### Presentational vs Container

- **Presentational**: How things look (JSX, styles)
- **Container**: How things work (data fetching, state)

### Passing Function To setState

```jsx
this.setState((prevState, props) => ({
  count: prevState.count + props.increment
}));
```

### Component Switch

Use object mapping for conditional rendering:

```jsx
const components = {
  home: <Home />,
  about: <About />,
  contact: <Contact />
};

const Component = components[view] || <Default />;
```

### List Components

Use stable keys, avoid indexes as keys:

```jsx
// Good
items.map(item => <Item key={item.id} {...item} />);

// Bad (avoid)
items.map((item, index) => <Item key={index} {...item} />);
```

### React Fragments

```jsx
// Instead of wrapper div
return (
  <>
    <Child1 />
    <Child2 />
  </>
);
```

## Anti-Patterns

### Props In Initial State

```jsx
// Anti-pattern
constructor(props) {
  super(props);
  this.state = { name: props.name };
}

// Better
constructor(props) {
  super(props);
  this.state = {};
}
componentDidMount() {
  this.setState({ name: this.props.name });
}
```

### findDOMNode()

Avoid using findDOMNode(). Use ref callback instead:

```jsx
// Anti-pattern
const node = ReactDOM.findDOMNode(this);

// Better
<input ref={this.inputRef} />;
this.inputRef.current.focus();
```

### setState() in componentWillMount()

Avoid - can cause double rendering. Use constructor or componentDidMount instead.

### Mutating State

```jsx
// Anti-pattern
this.state.items.push(newItem);
this.setState({ items: this.state.items });

// Better
this.setState({ items: [...this.state.items, newItem] });
```

### Using Indexes as Key

```jsx
// Anti-pattern
items.map((item, i) => <Item key={i} />);

// Better
items.map(item => <Item key={item.id} />);
```

## Performance Tips

### shouldComponentUpdate

```jsx
shouldComponentUpdate(nextProps, nextState) {
  return nextProps.id !== this.props.id;
}
```

### Using Pure Components

```jsx
class MyComponent extends React.PureComponent {}
```

Or with functional components:

```jsx
const MyComponent = React.memo(function MyComponent({ data }) {
  // ...
});
```

### Using reselect

Create memoized selectors:

```jsx
import { createSelector } from "reselect";

const selectTodos = state => state.todos;
const selectFilter = state => state.filter;

const filteredTodos = createSelector(
  [selectTodos, selectFilter],
  (todos, filter) => todos.filter(todo => todo.status === filter)
);
```

## Styling

### Styles Module

```jsx
// styles.module.css
.button {
  background: blue;
  color: white;
}

// Component
import styles from './styles.module.css';
<button className={styles.button}>Click</button>
```

### CSS-in-JS

Using libraries like styled-components or emotion:

```jsx
const Button = styled.button`
  background: blue;
  color: white;
  &:hover {
    background: darkblue;
  }
`;
```

### HOC for Styling

```jsx
function withStyles(styles) {
  return function (Component) {
    return function (props) {
      return <Component {...props} styles={styles} />;
    };
  };
}
```

## Gotchas

### Pure Render Checks

React.memo and PureComponent do shallow comparison. Be careful with:

- Objects created inline: `{...props}` creates new object each render
- Arrays created inline: `[...arr]` creates new array

### Synthetic Events

Event pooling - reuse of synthetic events. Access properties immediately or use persist():

```jsx
handleClick(e) {
  console.log(e.target); // OK
  e.persist();
  setTimeout(() => console.log(e.target), 1000); // Now accessible
}
```

## Related Documentation

- [React Bits](../react-bits.md)

---

_Source: https://github.com/vasanthk/react-bits_
