const { ApolloServer, gql } = require('apollo-server-lambda');
const faunadb = require('faunadb'),
  q = faunadb.query;

const typeDefs = gql`
   
  type Query {
    bookmark: [Bookmark!]
  }
  type Bookmark {
    id: ID!
    url: String!
    desc: String!
  }
  type Mutation {
    addBookmark(url: String!, desc: String!) : Bookmark
    removeUrl(id:ID!) :Bookmark
  }
`




const resolvers = {
  Query: {
    bookmark: async (root, args, context) => {
      try {
        var client = new faunadb.Client({ secret: "fnAD8uTQKSACBeVZaZ2dW4nfLfMOG-Tp0XFhhKjJ" });
        var result = await client.query(
          q.Map(
            q.Paginate(q.Match(q.Index("url"))),
            q.Lambda(x => q.Get(x))
          )
        )
        console.log(result)
        return result.data.map(d => {
          return {
            id: d.ts,
            url: d.data.url,
            desc: d.data.desc,
          }
        })

      }

      catch (err) {
        console.log('err', err);
      }
    }
  },
  Mutation: {
    addBookmark: async (_, { url, desc }) => {
      try {
        var client = new faunadb.Client({ secret: "fnAD8uTQKSACBeVZaZ2dW4nfLfMOG-Tp0XFhhKjJ" });
        var result = await client.query(
          q.Create(
            q.Collection('links'),
            {
              data: {
                url,
                desc
              }
            },
          )

        );
        console.log("Document Created and Inserted in Container: " + result.ref.id);
        return result.ref.data

      }
      catch (error) {
        return error.toString()
      }

    },
    removeUrl: async (_, { id }) => {
      
      try {
        var client = new faunadb.Client({ secret: "fnAD8uTQKSACBeVZaZ2dW4nfLfMOG-Tp0XFhhKjJ" });
        var result = await client.query(
          q.Delete(q.Ref(q.Collection('links'), id))
        );
        console.log("Document deleted in Container of Database: " + result.ref.id);            
        

      } catch (error) {
        return error.toString()
      }
    }
  }
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
  playground: true,
  introspection: true
})

exports.handler = server.createHandler({
  cors: {
    origin: "*",
    credentials: true,
  },
});



