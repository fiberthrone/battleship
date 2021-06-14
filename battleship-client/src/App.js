import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import PageGame from "./PageGame";
import PageHome from "./PageHome";

function App() {
  return (
    <Router>
      <Switch>
        <Route path="/game/:player" exact>
          <PageGame />
        </Route>
        <Route path="/" exact>
          <PageHome />
        </Route>
        <Route path="*">404</Route>
      </Switch>
    </Router>
  );
}

export default App;
