import React, { useState, useEffect } from 'react';
import { Container } from 'react-bootstrap';

import { MDBDataTableV5, MDBInput } from 'mdbreact';
import FilterBar from '../components/FilterBar';

import { Button } from '@material-ui/core';
import '../style/SummaryPage.css';

function SummaryPage() {
  const [posts, setPosts] = useState([]);
  const [fetchUrl, setFetchUrl] = useState('/posts');
  const [checked, setChecked] = useState([]);
  const deleteList = [];

  const getPosts = async () => {
    let posts = [];
    try {
      posts = await fetch(fetchUrl).then((res) => res.json());
      for (let i = 0; i < posts.length; i++) {
        // add a checkbox for each post
        let check_id = 'checkbox_'.concat(posts[i]._id);
        posts[i].check = (
          <MDBInput
            label=" "
            type="checkbox"
            id={check_id}
            onClick={() => toggleCheckbox(posts[i]._id)}
          />
        );

        // turn the title to a hyper link
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

  let colums = [
    {
      field: 'check',
    },
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

  // colums.shift();
  const table = {
    columns: colums,
    rows: posts,
  };

  const toggleCheckbox = (id) => {
    console.log(id);

    if (deleteList.includes(id)) {
      const index = deleteList.indexOf(id);
      if (index > -1) {
        deleteList.splice(index, 1);
      }
    } else {
      deleteList.push(id);
    }
    console.log(deleteList);
    setChecked(deleteList);
  };

  const deletePosts = async () => {
    try {
      let result = await fetch('/admin/delete', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          deleteList: checked,
        }),
      }).then((res) => res.json());
      if (result.success) {
        // getPosts again

        // clear the ids in the deleteList
        setChecked([]);
        window.location.href = '/';
      } else {
        alert('Backend failed to delete the records');
      }
    } catch (err) {
      alert(`Failed to call [DELETE]. Please check console to see error log.`);
      console.log(err);
    }
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
        <Button
          variant="contained"
          color="secondary"
          onClick={() => deletePosts(deleteList)}
        >
          Delete
        </Button>
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
