import gql from 'graphql-tag';
import { ApolloClient, HttpLink, InMemoryCache } from 'apollo-boost';
import { getAccessToken, isLoggedIn } from './auth';

const ENDPOINT_URL = 'http://localhost:9000/graphql';

const client = new ApolloClient({
  link: new HttpLink({ uri: ENDPOINT_URL }),
  cache: new InMemoryCache(),
});

async function graphqlRequest(query, variables = {}) {
  const request = {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ query, variables }),
  };
  if (isLoggedIn()) {
    request.headers['authorization'] = `Bearer ${getAccessToken()}`;
  }
  const response = await fetch(ENDPOINT_URL, request);
  const responseBody = await response.json();
  if (responseBody.errors) {
    const message = responseBody.errors
      .map((error) => error.message)
      .join('\n');
    throw new Error(message);
  }
  return responseBody.data;
}

export async function createJob(input) {
  const mutation = gql`
    mutation CreateJob($input: CreateJobInput) {
      job: createJob(input: $input) {
        id
        title
        company {
          id
          name
        }
      }
    }
  `;
  const { data } = await client.mutate({ mutation, variables: { input } });
  return data.job;
}

export async function loadCompany(id) {
  const query = gql`
    query CompanyQuery($id: ID!) {
      company(id: $id) {
        id
        name
        description
        jobs {
          id
          title
        }
      }
    }
  `;
  const { data } = await client.query({ query, variables: { id } });
  return data.company;
}

export async function loadJob(id) {
  const query = gql`
    query JobQuery($id: ID!) {
      job(id: $id) {
        id
        title
        company {
          id
          name
        }
        description
      }
    }
  `;
  const { data } = await client.query({ query, variables: { id } });
  return data.job;
}

export async function loadJobs() {
  const query = gql`
    {
      jobs {
        id
        title
        company {
          id
          name
        }
      }
    }
  `;
  const { data } = await client.query({ query });
  return data.jobs;
}
