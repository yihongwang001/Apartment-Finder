import React, { useState, useEffect } from 'react';
import { Container } from 'react-bootstrap';

import { MDBDataTableV5 } from 'mdbreact';
import FilterBar from '../components/FilterBar';

import '../style/SummaryPage.css';

function SummaryPage() {
  const [posts, setPosts] = useState([]);
  const [fetchUrl, setFetchUrl] = useState('/posts');

  const getPosts = async () => {
    let posts = [];
    try {
      posts = await fetch(fetchUrl).then((res) => res.json());
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
        if (posts[i].area === 0) posts[i].area = '';
      }
      console.log(`${posts.length} posts returned in the response.`);
    } catch (err) {
      console.log('error occurs ', err);
    }
    setPosts(posts);
  };

  useEffect(() => {
    getPosts();
  }, [fetchUrl]); // Only run the first time

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
        label: 'Price($)',
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
        label: 'Area(sqft)',
        field: 'area',
        sort: 'asc',
        width: 50,
      },
      {
        label: 'Post Time',
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
        <div className="greetingHeader">
          <h1>Find your home today!</h1>
          <p>
            We provide the lastest posts from https://sfbay.craigslist.org/. You
            can find your ideal apartment here.
          </p>
        </div>
        <FilterBar updateFetchUrl={setFetchUrl} />
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

export default SummaryPage;
