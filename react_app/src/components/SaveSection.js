import React, { useState } from 'react';
import { Container, Form } from 'react-bootstrap';
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';
import FavoriteIcon from '@material-ui/icons/Favorite';
import SendRoundedIcon from '@material-ui/icons/SendRounded';
import { Button } from '@material-ui/core';

import '../style/SaveSection.css';

const SaveSection = () => {
  //   const [saved, setSaved] = useState(false);

  //   const handleClickIcon = () => {
  //     setSaved(!saved);
  //   };
  return (
    <Container>
      <div className="message">
        Add this apartment/house <br />
        to your wishlist?
      </div>
      <div className="saveIcon">
        <FavoriteBorderIcon /> Save
        <FavoriteIcon /> Unsave
      </div>
      <Form className="commentSection">
        <Form.Group controlId="CommentArea">
          <Form.Label>Input your comments... </Form.Label>
          <Form.Control
            as="textarea"
            rows={5}
            defaultValue="comment get from database"
          />
        </Form.Group>
        <Button
          variant="outlined"
          color="default"
          size="small"
          style={{ width: '100%' }}
        >
          <SendRoundedIcon />
          &nbsp;Update
        </Button>
      </Form>
    </Container>
  );
};

export default SaveSection;
