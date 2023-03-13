import {
  Container,
  Card,
  Button,
  Row,
  Col
} from 'react-bootstrap';
import { useMutation, useQuery } from '@apollo/client';
import { REMOVE_BOOK } from '../utils/mutations';
import { GET_ME } from '../utils/queries';

import Auth from '../utils/auth';
import { removeBookId } from '../utils/localStorage';
import { Navigate } from 'react-router-dom';

const SavedBooks = () => {
  const { loading, error, data } = useQuery(GET_ME);
  // Fall back to empty object in case there is no user data returned from query
  const userData = data?.me || {};
  const userDataLength = userData?.savedBooks?.length;
  const [removeBook] = useMutation(REMOVE_BOOK, {
    update(cache, { data: { removeBook } }) {
      try {
        // read the user's data from the cache
        const { me } = cache.readQuery({ query: GET_ME });
        // remove the book from the user's savedBooks array
        cache.writeQuery({
          query: GET_ME,
          data: {
            me: {
              ...me,
              savedBooks: me.savedBooks.filter((book) => book.bookId !== removeBook.bookId)
            }
          }
        });
        // update the cache to reflect the new state
        cache.writeQuery({ 
          query: GET_ME, 
          data: { me: { ...me, savedBooks: [...me.savedBooks, removeBook] } } 
        });
      } catch (e) {
        console.error(e);
      }
    }
  });

    if (error) {
      return <div>Error: {error.message}</div>;
    }

    if (Auth.loggedIn()) {
      return <Navigate to="/saved" />;
    }

    if (!loading && userData?.username && userData.savedBooks.length === 0) {
      return <h4>You have no saved books!</h4>;
    }

    if (loading) {
      return <div>Loading...</div>;
    }

    if (!userData?.username) {
      return (
        <h4>
          You need to be logged in to see this. Use the navigation links above to
          sign up or log in!
        </h4>
      );
    }

      
  // create function that accepts the book's mongo _id value as param and deletes the book from the database
  const handleDeleteBook = async (bookId) => {
    const token = Auth.loggedIn() ? Auth.getToken() : null;

    if (!token) {
      return false;
    }

    try {
      const { data } = await removeBook({
        variables: { bookId }
      });

      if (error) {
        throw new Error('something went wrong!');
      }

      // upon success, remove book's id from localStorage
      removeBookId(bookId);
    } catch (err) {
      console.error(err);
    }
  };

  // if data isn't here yet, say so
  if (!userDataLength) {
    return <h2>LOADING...</h2>;
  }

  return (
    <>
      <div fluid className="text-light bg-dark p-5">
        <Container>
          <h1>Viewing saved books!</h1>
        </Container>
      </div>
      <Container>
        <h2 className='pt-5'>
          {userData.savedBooks.length
            ? `Viewing ${userData.savedBooks.length} saved ${userData.savedBooks.length === 1 ? 'book' : 'books'}:`
            : 'You have no saved books!'}
        </h2>
        <Row>
          {userData.savedBooks.map((book) => {
            return (
              <Col key={book.bookId} md="4">
                <Card border='dark'>
                  {book.image ? <Card.Img src={book.image} alt={`The cover for ${book.title}`} variant='top' /> : null}
                  <Card.Body>
                    <Card.Title>{book.title}</Card.Title>
                    <p className='small'>Authors: {book.authors}</p>
                    <Card.Text>{book.description}</Card.Text>
                    <Button className='btn-block btn-danger' onClick={() => handleDeleteBook(book.bookId)}>
                      Delete this Book!
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            );
          })}
        </Row>
      </Container>
    </>
  );
};

export default SavedBooks;
