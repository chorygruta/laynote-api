module.exports = `
  type User {
    id: ID
    unique_id: ID
    email_address: String
    last_login: String
    createdAt: String
    updatedAt: String  
  }

  input SignupInput {
    email_address: String!
    password: String!
  }

  input LoginInput {
    email_address: String!
    password: String!
  }

  type AuthPayload {
    userId: ID
    token: String
    message: String
  }

  input UpdateUserInput {
    email_address: String
  }

  type UpdateUserPayload {
    old_user: User,
    updated_user: User,
    message: String 
  }

  type Query {
    me: User
  }

  type Mutation {
    signup(body: SignupInput!): AuthPayload
    login(body: LoginInput!): AuthPayload
    updateUser(id: ID!, body: UpdateUserInput!): UpdateUserPayload
  }
`;
