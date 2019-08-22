# GraphQL Server Example

This example shows how to implement a **GraphQL server with Node.js** based on Prisma & [graphql-yoga](https://github.com/prisma/graphql-yoga).

## How to use

### 1. Download example & install dependencies

Clone the repository:

```
git clone git@github.com:prisma/prisma-examples.git
```

Install Node dependencies:

```
cd prisma-examples/node/graphql
npm install
```

### 2. Install the Prisma CLI

To run the example, you need the Prisma CLI. Please install it via NPM or [using another method](https://www.prisma.io/docs/prisma-cli-and-configuration/using-the-prisma-cli-alx4/#installation):

```
npm install -g prisma
```

### 3. Set up database & deploy Prisma datamodel

For this example, you'll use a free _demo database_ (AWS Aurora) hosted in Prisma Cloud. To set up your database, run:

```
prisma deploy
```

Then, follow these steps in the interactive CLI wizard:

1. Select **Demo server**
1. **Authenticate** with Prisma Cloud in your browser (if necessary)
1. Back in your terminal, **confirm all suggested values**

<details>
 <summary>Alternative: Run Prisma locally via Docker</summary>

1. Ensure you have Docker installed on your machine. If not, you can get it from [here](https://store.docker.com/search?offering=community&type=edition).
1. Create `docker-compose.yml` for MySQL (see [here](https://www.prisma.io/docs/prisma-server/database-connector-POSTGRES-jgfr/) for Postgres):
    ```yml
    version: '3'
    services:
      prisma:
        image: prismagraphql/prisma:1.34
        restart: always
        ports:
        - "4466:4466"
        environment:
          PRISMA_CONFIG: |
            port: 4466
            databases:
              default:
                connector: mysql
                host: mysql
                port: 3306
                user: root
                password: prisma
                migrations: true
      mysql:
        image: mysql:5.7
        restart: always
        environment:
          MYSQL_ROOT_PASSWORD: prisma
        volumes:
          - mysql:/var/lib/mysql
    volumes:
      mysql:
    ```
1. Run `docker-compose up -d`
1. Set the `endpoint` in `prisma.yml` to `http://localhost:4466`
1. Run `prisma deploy`

</details>

You can now use [Prisma Admin](https://www.prisma.io/docs/prisma-admin/overview-el3e/) to view and edit your data by appending `/_admin` to your Prisma endpoint.

### 4. Start the GraphQL server

Launch your GraphQL server with this command:

```
npm run start
```

Navigate to [http://localhost:4000](http://localhost:4000) in your browser to explore the API of your GraphQL server in a [GraphQL Playground](https://github.com/prisma/graphql-playground).

### 5. Using the GraphQL API

The schema that specifies the API operations of your GraphQL server is defined in [`./src/schema.graphql`](./src/schema.graphql). Below are a number of operations that you can send to the API using the GraphQL Playground.

Feel free to adjust any operation by adding or removing fields. The GraphQL Playground helps you with its auto-completion and query validation features.

#### Retrieve all published posts and their authors

```graphql
query {
  feed {
    id
    title
    content
    published
    author {
      id
      name
      email
    }
  }
}
```

<Details><Summary><strong>See more API operations</strong></Summary>

#### Create a new user

```graphql
mutation {
  signupUser(
    name: "Sarah"
    email: "sarah@prisma.io"
  ) {
    id
  }
}
```

#### Create a new draft

```graphql
mutation {
  createDraft(
    title: "Join the Prisma Slack"
    content: "https://slack.prisma.io"
    authorEmail: "alice@prisma.io"
  ) {
    id
    published
  }
}
```

#### Publish an existing draft

```graphql
mutation {
  publish(id: "__POST_ID__") {
    id
    published
  }
}
```

> **Note**: You need to replace the `__POST_ID__`-placeholder with an actual `id` from a `Post` item. You can find one e.g. using the `filterPosts`-query.

#### Search for posts with a specific title or content

```graphql
{
  filterPosts(searchString: "graphql") {
    id
    title
    content
    published 
    author {
      id
      name
      email
    }
  }
}
```

#### Retrieve a single post

```graphql
{
  post(id: "__POST_ID__") {
    id
    title
    content
    published
    author {
      id
      name
      email
    }
  }
}
```

> **Note**: You need to replace the `__POST_ID__`-placeholder with an actual `id` from a `Post` item. You can find one e.g. using the `filterPosts`-query.

#### Delete a post

```graphql
mutation {
  deletePost(id: "__POST_ID__") {
    id
  }
}
```

> **Note**: You need to replace the `__POST_ID__`-placeholder with an actual `id` from a `Post` item. You can find one e.g. using the `filterPosts`-query.

</Details>

### 6. Evolving the example

If you want to change the GraphQL API, you need to adjust the GraphQL schema in [`./src/schema.graphql`](./src/schema.graphql) and the respective resolver functions.

<Details><Summary><strong>Adding an operation without updating the datamodel</strong></Summary>

To add new operation that can be based on the current [datamodel](./prisma/datamodel.prisma), you first need to add the operation to the GraphQL schema's `Query` or `Mutation` type and then add the corresponding resolver function. 

For example, to add a new mutation that updates a user's name, you can extend the `Mutation` type as follows:

```diff
type Mutation {
  signupUser(email: String!, name: String): User!
  createDraft(title: String!, content: String, authorEmail: String!): Post!
  deletePost(id: ID!): Post
  publish(id: ID!): Post
+ updateUserName(id: ID!, newName: String!): User
}
```

Then add the new resolver to the `resolvers` object in [`./src/index.js`](./src/index.js):

```diff
const resolvers = {
  // ... 
  Mutation: {
    // ...
+   updateUserName(parent, { id, newName }, context) {
+     return context.prisma.updateUser({
+       where: {
+         id
+       },
+       data: {
+         name: newName
+       }
+     })
+   }
  }
}
```

You can now send the following mutation to your GraphQL API:

```graphql
mutation {
  updateUserName(
    id: "__USER_ID__" 
    newName: "John")
  ) {
    id
    name
  }
}
```

</Details>

<Details><Summary><strong>Adding an operation and updating the datamodel</strong></Summary>

Some new API features can't be covered with the existing datamodel. For example, you might want to add _comment_ feature to the API, so that users can leave comments on posts.

For that, you first need to adjust the Prisma datamodel in [`./prisma/datamodel.prisma`](./prisma/datamodel.prisma):

```diff
type User {
  id: ID! @id
  email: String! @unique
  name: String
  posts: [Post!]!
+ comments: [Comment!]!
}

type Post {
  id: ID! @id
  createdAt: DateTime!
  updatedAt: DateTime!
  published: Boolean! @default(value: "false")
  title: String!
  content: String
  author: User!
+ comments: [Comment!]!
}

+ type Comment {
+   id: ID! @id
+   text: String!
+   writtenBy: User!
+   post: Post!
+ }
```

After having updated the datamodel, you need to deploy the changes:

```
prisma deploy
```

Note that this also invokes `prisma generate` (because of the `post-deploy` hook in [`prisma.yml`](./prisma/prisma.yml)) which regenerates the Prisma client in [`./src/generated/prisma-client`](./src/generated/prisma-client).

To now enable users to add comments to posts, you need to add the `Comment` type as well as the corresponding operation to the GraphQL schema in [`./src/schema.graphql`](./src/schema.graphql):

```diff
type Query {
  # ... as before
}

type Mutation {
  signupUser(email: String!, name: String): User!
  createDraft(title: String!, content: String, authorEmail: String!): Post!
  deletePost(id: ID!): Post
  publish(id: ID!): Post
  updateUserName(id: ID!, newName: String!): User
+ writeComment(text: String!, postId: ID!, userId!: ID!): Comment
}

type User {
  id: ID!
  email: String!
  name: String
  posts: [Post!]!
+ comments: [Comment!]!
}

type Post {
  id: ID!
  createdAt: DateTime!
  updatedAt: DateTime!
  published: Boolean!
  title: String!
  content: String
  author: User!
+ comments: [Comment!]!
}

+ type Comment {
+   id: ID!
+   text: String!
+   writtenBy: User!
+   post: Post!
+ }
```

Next, you need to implement the resolver for the new operation in [`./src/index.js`](./src/index.js):

```diff
const resolvers = {
  // ... 
  Mutation: {
    // ...
+   writeComment(parent, { postId, userId}, context) {
+     return context.prisma.createComment({
+       text,
+       post: {
+         connect: { id: postId }
+       },
+       writtenBy: {
+         connect: { id: userId }
+       }
+     })
+   }
  }
}
```

Finally, because `Comment` has a relation to `Post` and `User`, you need to update the type resolvers as well so that the relation can be properly resolved (learn more about why this is necessary in [this](https://www.prisma.io/blog/graphql-server-basics-the-schema-ac5e2950214e/) blog article):

```diff
const resolvers = {
  // ... 
  User: {
    // ...
+   comments: ({ id }, args, context) {
+     return context.prisma.user({ id }).comments()
+   }
  },
  Post: {
    // ...
+   comments: ({ id }, args, context) {
+     return context.prisma.post({ id }).comments()
+   }
  },
+ Comment: {
+   writtenBy: ({ id }, args, context) {
+     return context.prisma.comment({ id }).writtenBy()
+   },
+   post: ({ id }, args, context) {
+     return context.prisma.comment({ id }).post()
+   },
+ }
}
```

You can now send the following mutation to your GraphQL API:

```graphql
mutation {
  writeComment(
    userId: "__USER_ID__" 
    postId: "__POST_ID__" 
    text: "I like turtles 🐢"
  ) {
    id
    name
  }
}
```

</Details>

## Next steps

- [Use Prisma with an existing database](https://www.prisma.io/docs/-a003/)
- [Explore the Prisma client API](https://www.prisma.io/client/client-javascript)
- [Learn more about the GraphQL schema](https://www.prisma.io/blog/graphql-server-basics-the-schema-ac5e2950214e/)

## The idea behind the example

The Prisma client is used as a replacement for a traditional ORM in this example. It bridges the gap between your GraphQL resolvers and your database by providing a powerful CRUD API for the types that are defined in your Prisma datamodel.