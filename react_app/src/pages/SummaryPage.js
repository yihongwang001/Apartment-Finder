import React, { useState, useEffect } from 'react';
import { Container } from 'react-bootstrap';

import { MDBDataTableV5 } from 'mdbreact';

import '../style/SummaryPage.css';

function SummaryPage() {
  const [posts, setPosts] = useState([]);

  const getPosts = async () => {
    let posts = [];
    try {
      posts = await fetch('/posts').then((res) => res.json());
      for (let i = 0; i < posts.length; i++) {
        let url = '/posts/details/'.concat(posts[i]._id);
        posts[i].title = (
          <a
            className="titleURL indigo-text"
            href={url}
            target="_blank"
            rel="noreferrer"
          >
            {posts[i].title}
          </a>
        );
      }
      console.log(`${posts.length} posts returned in the response.`);
    } catch (err) {
      console.log('error occurs ', err);
    }
    setPosts(posts);
  };

  useEffect(() => {
    getPosts();
  }, []); // Only run the first time

  const table = {
    columns: [
      {
        label: 'Title',
        field: 'title',
        sort: 'asc',
        width: 150,
      },
      {
        label: 'Region',
        field: 'region',
        width: 100,
      },
      {
        label: 'Price',
        field: 'price',
        sort: 'asc',
        width: 50,
      },
      {
        label: 'Bedroom',
        field: 'bedroom',
        sort: 'asc',
        width: 50,
      },
      {
        label: 'Area',
        field: 'area',
        sort: 'asc',
        width: 50,
      },
      {
        label: 'Post time',
        field: 'date',
        sort: 'desc',
        width: 100,
      },
    ],
    rows: posts,
  };

  return (
    <Container>
      <div>
        <h1>This is the posting summary page</h1>
        <MDBDataTableV5
          className="summaryTable"
          hover
          striped
          bordered
          small
          info={false}
          data={table}
        />
      </div>
    </Container>
  );
}

export default SummaryPage;
