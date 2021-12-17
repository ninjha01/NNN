import React, { Suspense, useState } from "react";
import { HashRouter, Route } from "react-router-dom";
import "./App.css";
import "./bootstrap.css";
import HomePage from "./components/HomePage";
import { LoginHandler } from "./components/LoginHandler";

/* const HomePage = lazy(() => import("./components/HomePage")); */

interface AppProps {}

const App = (props: AppProps) => {
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  if (!currentUserId) {
    return (
      <HashRouter>
        <LoginHandler setCurrentUserId={setCurrentUserId} />
      </HashRouter>
    );
  } else {
    return (
      <HashRouter>
        <Suspense fallback={<div>Loading...</div>}>
          <Route
            exact
            path="/"
            component={() => <HomePage token={currentUserId} />}
          />
        </Suspense>
      </HashRouter>
    );
  }
};

export default App;
