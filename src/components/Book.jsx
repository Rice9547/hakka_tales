import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Riple } from 'react-loading-indicators';
import { Row, Col } from 'react-bootstrap';

import MyButton from './MyButton';
import useStories from '../hooks/useStories';

function Book() {
  // get the book info from backend
  const { currentStory, fetchCurrentStory } = useStories();
  const [loading, setLoading] = useState(true);

  const { bookIndex } = useParams();

  useEffect(() => {
    const getStory = async () => {
      setLoading(true);
      await fetchCurrentStory(bookIndex);
      setLoading(false);
    };
    getStory();
  }, [bookIndex, fetchCurrentStory]);

  const navigate = useNavigate();

  // display the loading icon when data is not loaded
  if (loading) {
    return (
      <div className="d-flex flex-color align-items-center justify-content-center w-100 h-100">
        <Riple color="#32cd32" size="medium" text="" textColor="" />
      </div>
    );
  }

  const handleClick = () => {
    navigate(`/book/${bookIndex}/content`); // Navigate to the book page with the index
  };

  return (
    <Row>
      {/* left side */}
      <Col md={6} sm={12}>
        <div className="w-100 d-flex flex-column align-items-center justify-content-center border-end me-4 p-5">
          <div className="d-flex justify-content-center mb-3">
            <img
              src={currentStory.cover_image_url}
              alt="cover image"
              className="w-100"
            />
          </div>
          <h1>{currentStory.title}</h1>
        </div>
      </Col>

      {/* right side */}
      <Col md={6} sm={12}> 
        <div className="w-100 h-100 d-flex flex-column justify-content-between p-3">
          <div>
            <h2 className="my-5">故事簡介</h2>
            {/* <h4 className="mb-4">作者: {bookInfo.author}</h4> */}
            <p className="mt-3 text-break lh-lg fs-5">{currentStory.description}</p>
          </div>

          <div className="d-flex align-items-center justify-content-end gap-4 mb-3">
            <MyButton text="四縣腔" handleClick={handleClick} />
            <MyButton text="海陸腔" handleClick={handleClick} />
          </div>
        </div>
      </Col>
    </Row>

  );
}

export default Book;
