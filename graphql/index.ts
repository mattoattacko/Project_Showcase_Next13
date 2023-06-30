// created at 1:17 into video
// we need to query for a user and verify by email
// we also need to specify what we want returned.
export const getUserQuery = `
  query GetUser($email: String!) {
    user(by: { email: $email }) {
      id
      email
      name
      avatarUrl
      description
      githubUrl
      linkedinUrl
    }
  }
`


//covered at 1:23
export const createUserQuery = `
  mutation CreateUser($input: UserCreateInput!) {
    userCreate(input: $input) {
      user {
        id
        name
        email
        avatarUrl
        description
        githubUrl
        linkedinUrl        
      }
    }
  }
`