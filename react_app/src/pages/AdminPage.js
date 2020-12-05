import React, { useState } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

function AdminPage() {
  const [file, setFile] = useState(null);
  const handleFileSelected = (e) => {
    const files = Array.from(e.target.files);
    console.log('files:', files);
    setFile(files[0]);
  };
  const uploadJson = () => {
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

    fetch('/admin/import', {
      method: 'POST',
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
      })
      .catch((error) => {
        console.error(error);
      });
  };
  return (
    <div className="mb-3">
      <Form.File id="formcheck-api-regular">
        <Form.File.Label>Import Json</Form.File.Label>
        <Form.File.Input onChange={handleFileSelected} />
        <Button onClick={() => uploadJson()}>upload</Button>
      </Form.File>
    </div>
  );
}

export default AdminPage;
