import React from 'react';
import { ApolloProvider } from '@apollo/client';
import { ThemeProvider } from 'theme-ui';
import { swiss } from '@theme-ui/presets';
import { client } from './client';


const newTheme = {
  ...swiss,
  sizes: { container: 1200}
};


export const wrapRootElement = ({ element }) => (

  <ApolloProvider client={client}>
    <ThemeProvider theme={newTheme}>
      {element}
    </ThemeProvider>
  </ApolloProvider>
);

