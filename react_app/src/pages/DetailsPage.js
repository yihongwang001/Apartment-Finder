import React, { useState, useEffect } from "react";
import { useParams } from "react-router";
import { Container, Row, Col, Badge } from "react-bootstrap";
import Gallery from "../components/ImageGallery";
import SaveSection from "../components/SaveSection";
import NotFoundPage from "./NotFoundPage";
import "../style/DetailsPage.css";

function DetailsPage() {
  const { id } = useParams();
  const [post, setPost] = useState({});
  const [imagesList, setImageList] = useState([]);
  const [show404, setShow404] = useState(false);
  const [comment, setComment] = useState("");
  const [saved, setSaved] = useState(false);

  const initPage = async () => {
    let currentPost;
    let list = [];
    try {
      let url = "/posts/details/".concat(id);
      currentPost = await fetch(url).then((res) => res.json());
      if (currentPost.length > 0) {
        setPost(currentPost[0]);
        if (currentPost[0].comment) {
          setComment(currentPost[0].comment);
          setSaved(true);
        }
        const images = currentPost[0].images;
        for (let i = 0; i < images.length; i++) {
          list.push({
            original: images[i],
            thumbnail: images[i].replace("_600x450", "_50x50c"),
          });
        }
        setImageList(list);
      } else {
        setShow404(true);
      }
    } catch (err) {
      setShow404(true);
      console.log("error occurs ", err);
    }
  };

  useEffect(() => {
    initPage();
  }, []);

  return (
    <div>
      <Container>
        {show404 && <NotFoundPage />}
        {!show404 && (
          <Row className="mainContent">
            <Col lg={9}>
              <h4 className="postTitle">{post.title}</h4>
              <div>
                {post.date}{" "}
                <span className="float-right">${post.price} /month</span>
              </div>
              <div className="moreInfo">
                <span className="address">Address: {post.mapAddress}</span>
                <Badge variant="primary" pill className="tags">
                  {post.region}
                </Badge>
                <Badge pill variant="secondary" className="tags">
                  {post.bedroom}
                </Badge>
                <Badge pill variant="secondary" className="tags">
                  {post.area}ft
                </Badge>
              </div>
              <Gallery items={imagesList}></Gallery>
              <hr />
              <div dangerouslySetInnerHTML={{ __html: post.contentHTML }} />
            </Col>
            <Col lg={3}>
              <SaveSection
                postId={id}
                comment={comment}
                saved={saved}
                setComment={setComment}
              />
            </Col>
          </Row>
        )}
      </Container>
    </div>
  );
}

export default DetailsPage;
