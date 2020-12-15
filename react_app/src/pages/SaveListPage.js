import React, { useState, useEffect } from "react";

import { MDBDataTableV5 } from "mdbreact";

import { Container } from "@material-ui/core";
import "../style/SaveListPage.css";

function SavelistPage() {
  const [posts, setPosts] = useState([]);

  const getSavedPosts = async () => {
    let savedPosts = [];
    try {
      savedPosts = await fetch("/savelist/user").then((res) => res.json());
      console.log(`${savedPosts.length} posts returned in the response.`);
    } catch (err) {
      console.log("error occurs ", err);
    }
    if (savedPosts.length !== 0) {
      for (let i = 0; i < savedPosts.length; i++) {
        // turn the title to a hyper link
        let url = "/posts/details/".concat(savedPosts[i]._id);
        savedPosts[i].title = (
          <a
            className="titleURL indigo-text"
            href={url}
            target="_blank"
            rel="noreferrer"
          >
            {savedPosts[i].title}
          </a>
        );
        if (savedPosts[i].area === 0) savedPosts[i].area = "";
      }
    }
    setPosts(savedPosts);
  };

  useEffect(() => {
    getSavedPosts();
  }, []); // Only run the first time

  let colums = [
    {
      label: "Title",
      field: "title",
      sort: "asc",
      width: 180,
    },
    {
      label: "Region",
      field: "region",
      width: 80,
    },
    {
      label: "Price($)",
      field: "price",
      sort: "asc",
      width: 40,
    },
    {
      label: "Bedroom",
      field: "bedroom",
      sort: "asc",
      width: 40,
    },
    {
      label: "Area(sqft)",
      field: "area",
      sort: "asc",
      width: 40,
    },
    {
      label: "Post Time",
      field: "date",
      sort: "desc",
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
