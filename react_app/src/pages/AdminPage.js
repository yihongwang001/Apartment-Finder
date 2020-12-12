import React, { useState } from 'react';
import { Button } from '@material-ui/core';
import { Container, Row, Col, Form } from 'react-bootstrap';

import '../style/AdminPage.css';

function AdminPage() {
  const [file, setFile] = useState(null);
  const handleFileSelected = (e) => {
    const files = Array.from(e.target.files);
    console.log('files:', files);
    setFile(files[0]);
  };
  const uploadJson = async () => {
    if (!file) {
      alert('Please select a file first!');
      return;
    }
    if (!file.name.endsWith('.json')) {
      alert('Please upload a Json file!');
      return;
    }
    const formData = new FormData();
    formData.append('data', file);

    let data = await fetch('/admin/import', {
      method: 'POST',
      body: formData,
    })
      .then((response) => response.json())
      .catch((error) => {
        console.error(error);
      });

    alert(`${Object.keys(data).length} records imported`);
  };

  return (
    <Container className="adminPage">
      <h1>Welcome, Administrator</h1>
      <p className="instruction">
        Instructions:
        <br />
        <strong>Add posts</strong> - Choose a json file and upload here
        <br />
        <strong>Delete posts</strong> - Go to delete in the{' '}
        <a href="/"> home page </a>
      </p>

      <Row className="updateField">
        <Col className="uploadButton">
          <Form.File>
            <Form.File.Input onChange={handleFileSelected} />
          </Form.File>
        </Col>

        <Col>
          <Button
            variant="outlined"
            color="primary"
            size="small"
            onClick={() => uploadJson()}
          >
            upload
          </Button>
        </Col>
      </Row>
    </Container>
  );
}

export default AdminPage;
