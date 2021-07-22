import React from "react";
import { Box, Container } from "theme-ui";
import { Header } from "components/Header";
import { Route, Switch } from "react-router-dom";
import "i18n/config";
import { Main } from "pages/Main";
import { ToastContainer } from "react-toastify";

const App: React.FC = () => {
  return (
    <Container
      sx={{
        mx: [4, "15%"],
        my: [4, 4],
        maxWidth: "100%",
        width: "auto",
      }}
    >
      <Box mb={5}>
        <Header />
      </Box>
      <Switch>
        <Route exact path="/">
          <Main />
        </Route>
      </Switch>
      <ToastContainer
        style={{ background: "var(--theme-ui-colors-background)" }}
        toastClassName="toast-body"
        bodyClassName="toast-body"
      />
    </Container>
  );
};

export default App;
