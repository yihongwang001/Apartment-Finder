import React from "react";
import { Container, Form } from "react-bootstrap";
import FavoriteBorderIcon from "@material-ui/icons/FavoriteBorder";
import SendRoundedIcon from "@material-ui/icons/SendRounded";
import { Button } from "@material-ui/core";

import "../style/SaveSection.css";
import getUser from "../utils/userUtil";

const SaveSection = (props) => {
  const handleCommentChange = (event) => {
    props.setComment(event.target.value);
  };
  const savePostToList = async () => {
    if (!getUser().loggedIn) {
      alert("You need to login first!");
      return;
    }
    let result = await fetch("/savelist", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        postId: props.postId,
        comment: props.comment,
      }),
    }).then((res) => res.json());
    if (result.ok === 1) {
      alert("Comment updated successfully.");
      window.location.reload();
    } else {
      alert("Backend failed to save comment.");
    }
  };

  const deleteFromWatchlist = async () => {
    let result = await fetch("/savelist", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        postId: props.postId,
      }),
    }).then((res) => res.json());
    if (result.ok === 1) {
      alert("Successfully removed from your watchlist.");
      window.location.reload();
    } else {
      alert("Backend failed to remove it.");
    }
  };

  let button;
  if (props.saved) {
    button = (
      <div>
        <Button
          variant="outlined"
          color="default"
          size="small"
          style={{ width: "100%", marginBottom: 10 }}
          onClick={savePostToList}
        >
          <SendRoundedIcon />
          Update comment
        </Button>
        <Button
          variant="outlined"
          color="default"
          size="small"
          style={{ width: "100%" }}
          onClick={deleteFromWatchlist}
        >
          Remove From Watchlist
        </Button>
      </div>
    );
  } else {
    button = (
      <Button
        variant="outlined"
        color="default"
        size="small"
        style={{ width: "100%" }}
        onClick={savePostToList}
      >
        <FavoriteBorderIcon mr={2} />
        Save to Watchlist
      </Button>
    );
  }
  return (
    <Container>
      <div className="message">
        Add this apartment/house <br />
        to your wishlist?
      </div>
      <Form className="commentSection">
        <Form.Group controlId="CommentArea">
          <Form.Label>Input your comments... </Form.Label>
          <Form.Control
            as="textarea"
            rows={5}
            value={props.comment}
            onChange={handleCommentChange}
          />
        </Form.Group>
      </Form>
      {button}
    </Container>
  );
};

export default SaveSection;
