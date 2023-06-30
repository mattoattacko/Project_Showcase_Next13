// get our user from our database via GraphQL
//also checks if we are in production or not
import { getUserQuery, createUserQuery } from '@/graphql';
import { GraphQLClient } from 'graphql-request';

//checks if we are in production
const isProduction = process.env.NODE_ENV === 'production';

//address comes from running 'npx grafbase@0.24 dev'
const apiUrl = isProduction ? process.env.NEXT_PUBLIC_GRAFBASE_API_URL || '' : 'http://127.0.0.1:4000/graphql';

const apiKey = isProduction ? process.env.NEXT_PUBLIC_GRAFEBASE_API_KEY || '' : 'letmein';

//ensure server URL is correct
const serverUrl = isProduction ? process.env.NEXT_PUBLIC_SERVER_URL : 'http://localhost:3000';

const client = new GraphQLClient(apiUrl);

const makeGraphQLRequest = async (query: string, variables = {}) => {
  try {
    return await client.request(query, variables);
  } catch (error) {
    throw error;
  }
}

//this query and the variable get passed to 'makeGraphQLRequest', which then makes a client request to our api URL which is connected to either our local graph base environment, or to our production graph base environment.
//we return a user with all the things we defined in '/graphql/index.ts'
export const getUser = (email: string) => {

  client.setHeader('x-api-key', apiKey)
  return makeGraphQLRequest(getUserQuery, { email })
}

//the input is equal to what we want to pass to 'makeGraphQLRequest' which is the query and the variables defined in '/graphql/index.ts'
export const createUser = (email: string, name: string, avatarUrl: string) => {
  client.setHeader('x-api-key', apiKey)

  const variables = {
    input: {
      email,
      name,
      avatarUrl
    }
  }

  return makeGraphQLRequest(createUserQuery, variables)
}