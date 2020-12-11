import React, { useState, useEffect } from 'react';

import { MDBDataTableV5 } from 'mdbreact';

import { Container } from '@material-ui/core';
import '../style/SaveListPage.css';

function SavelistPage() {
  const [posts, setPosts] = useState([]);

  const getSavedPosts = async () => {
    let savedPosts = [];
    let originalPosts = [];
    try {
      savedPosts = await fetch('/savelist/user').then((res) => res.json());
      for (let i = 0; i < savedPosts.length; i++) {
        // the returned savedPost only contains postId,userId and comment
        // we need to get each post's info using '/posts/details/:id'
        let fetchurl = '/posts/details/'.concat(savedPosts[i].postId);
        let postObj = await fetch(fetchurl).then((res) => res.json());
        originalPosts.push(postObj[0]);
      }
      console.log(`${savedPosts.length} posts returned in the response.`);
    } catch (err) {
      console.log('error occurs ', err);
    }

    if (originalPosts.length !== 0) {
      for (let j = 0; j < originalPosts.length; j++) {
        // turn the title to a hyper link
        let url = '/posts/details/'.concat(originalPosts[j]._id);
        originalPosts[j].title = (
          <a
            className="titleURL indigo-text"
            href={url}
            target="_blank"
            rel="noreferrer"
          >
            {originalPosts[j].title}
          </a>
        );
        if (originalPosts[j].area === 0) originalPosts[j].area = '';
      }
    }
    setPosts(originalPosts);
  };

  useEffect(() => {
    getSavedPosts();
  }, []); // Only run the first time

  let colums = [
    {
      label: 'Title',
      field: 'title',
      sort: 'asc',
      width: 180,
    },
    {
      label: 'Region',
      field: 'region',
      width: 80,
    },
    {
      label: 'Price($)',
      field: 'price',
      sort: 'asc',
      width: 40,
    },
    {
      label: 'Bedroom',
      field: 'bedroom',
      sort: 'asc',
      width: 40,
    },
    {
      label: 'Area(sqft)',
      field: 'area',
      sort: 'asc',
      width: 40,
    },
    {
      label: 'Post Time',
      field: 'date',
      sort: 'desc',
      width: 100,
    },
  ];

  const table = {
    columns: colums,
    rows: posts,
  };

  return (
    <Container>
      <div>
        <h1>Your save list</h1>
        <MDBDataTableV5
          className="summaryTable"
          hover
          striped
          bordered
          small
          entriesOptions={[10, 20, 50]}
          entries={10}
          data={table}
        />
      </div>
    </Container>
  );
}

export default SavelistPage;
