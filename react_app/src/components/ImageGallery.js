import ImageGallery from 'react-image-gallery';
import 'react-image-gallery/styles/css/image-gallery.css';

const Gallery = (props) => {
  return <ImageGallery items={props.items} />;
};

export default Gallery;
