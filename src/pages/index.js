import React from "react"
import { useQuery, useMutation } from "@apollo/client";
import { Heading, Button, Flex, Container, Label, Input, Box, Link, Text, Grid } from "theme-ui";
import gql from "graphql-tag";

  
const BookMarksQuery = gql`{
  bookmark{
    id
    url
    desc
  }
}`

const AddBookMarkMutation = gql`
  mutation addBookmark($url: String!, $desc: String!){
    addBookmark(url: $url, desc: $desc){
     url 
    }
}
`
const REMOVE_URL = gql`
 mutation removeUrl($id: ID!){
    removeUrl(id: $id){    
     url
     desc 
    }
}
`


export default function Home() {
  const { loading, error, data } = useQuery(BookMarksQuery)
  const [addBookmark] = useMutation(AddBookMarkMutation)
  const [removeUrl] = useMutation(REMOVE_URL);  
  let textfield;
  let desc;

  const addBookmarkSubmit = (e) => {
    e.preventDefault()
    addBookmark({
      variables: {
        url: textfield.value,
        desc: desc.value
      },
      refetchQueries: [{ query: BookMarksQuery }],
    })
  }


  const removeMarks =(id)=>{
    removeUrl({
     variables: {
        id: id
     },
      refetchQueries: [{ query: REMOVE_URL }], 
    })
  }
  
  return (
    <Container>
      <Heading as="h1">Book Marking App</Heading>
      <Box as='form'>
        <Label htmlFor='URL' sx={{ fontSize: 3, fontWeight: 'bold' }}>Enter URL</Label>
        <Input type="text" placeholder="URL" ref={node => textfield = node} />
        <Label htmlFor='DESC' sx={{ fontSize: 3, fontWeight: 'bold' }}>Enter Description</Label>
        <Input type="text" placeholder="Description" ref={node => desc = node} />
        <Flex p={1}>
          <Button onClick={addBookmarkSubmit}>Add BookMark</Button>
        </Flex>
      </Box>

      <Box p={4} bg='highlight'>
        <Grid width={[128, null, 192]}>
          {loading ? <div>Loading...</div> : null}
          {error ? <div>{error.message}</div> : null}
          {!loading && !error && (
            data.bookmark.map(book => (
              <Flex key={book.id} sx={{ flexDirection: "column" }}>
                <Box>
                  <Link href={book.url}>{book.url}</Link>
                </Box>
                <Box>
                  <Text sx={{ fontSize: 1, fontWeight: 'bold', }}>
                    {book.desc}
                 </Text>
                </Box>
                <Box>
                  <Button ml='auto' onClick={()=>removeMarks(book.id)} >Delete</Button>
                </Box>
              </Flex>
            ))

          )}

        </Grid>
      </Box>     
    </Container >

  )
}
