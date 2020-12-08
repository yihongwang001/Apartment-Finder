import { Container } from 'react-bootstrap';
import ImageGallery from 'react-image-gallery';
import 'react-image-gallery/styles/css/image-gallery.css';

const Gallery = (props) => {
  return (
    <Container>
      <ImageGallery items={props.items} />
    </Container>
  );
};

export default Gallery;
