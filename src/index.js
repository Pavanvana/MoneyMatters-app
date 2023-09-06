import React from 'react'
import {BrowserRouter} from 'react-router-dom'
import ReactDOM from 'react-dom'
import App from './App'
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';
import { offsetLimitPagination } from "@apollo/client/utilities";


const client = new ApolloClient({
  uri: 'https://spacex-production.up.railway.app/',
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          launches: offsetLimitPagination()
        },
      },
    },
  })
})

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <ApolloProvider client={client}>
        <App />
      </ApolloProvider>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root'),
)