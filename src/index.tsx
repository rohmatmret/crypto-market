import * as React from "react";
import { render } from "react-dom";
import { ChakraProvider, ColorModeScript } from "@chakra-ui/react";
import reportWebVitals from './reportWebVitals';
import theme from "./theme"
import App from "./App";

const rootElement = document.getElementById("root");
render(
  <ChakraProvider>
     <ColorModeScript initialColorMode={theme.config.initialColorMode} />
    <App />
  </ChakraProvider>,
  rootElement
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
