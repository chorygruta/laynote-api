# laynote-api
A GraphQL server for a note-taking app called Laynote.

### Deployed API URL to the GraphQL Server
http://laynote-staging-api.us-west-1.elasticbeanstalk.com/graphql-api

### Recommended GraphQL Client
[Altair GraphQL Client](https://altair.sirmuel.design/) or 
[Apollo Playground](http://laynote-staging-api.us-west-1.elasticbeanstalk.com/graphql-api)

### Things to know
  - User model has one-to-many relationship with Category and Note models.
  - Category model has one-to-many relationship with the Note Model.
  - A categoryId is not required to create a Note record.
  - Dataloader is used to avoid the n+1 problem.

### Languages/technologies
  - Node.js
  - Apollo Server
### Database
  - MySQL
  
### ORM
  - Sequelize
  
### Functionalities
  #### Required
  - Mutation to sign up as a user using email/password, which will return a JWT
  - Mutation to log in as a user, which will return a JWT
  - Mutation to create a note for the logged in user
  - Mutation to update a note for the logged in user
  - Mutation to delete a note
  - Query to retrieve a list of the logged in user’s notes
  - Query to retrieve an individual note
  
 #### Additional
  - Mutation to create a note category
  - Mutation to update a note category
  - Mutation to delete a note category
  - Query to retrieve all categories
  - Query to retreive one category
  


## Build Setup

``` bash
# install dependencies
$ npm install

# serve with hot reload at localhost:3000
$ npm run serve

```
