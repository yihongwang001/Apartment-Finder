import React, { useState, useEffect } from "react";
import { MDBDataTableV5, MDBInput } from "mdbreact";
import { Button, Container } from "@material-ui/core";
import WhatshotIcon from "@material-ui/icons/Whatshot";
import FilterBar from "../components/FilterBar";
import getUser from "../utils/userUtil";

import "../style/SummaryPage.css";

function SummaryPage() {
  const [posts, setPosts] = useState([]);
  const [fetchUrl, setFetchUrl] = useState("/posts");
  const [checked, setChecked] = useState([]);
  const deleteList = [];

  const getPosts = async () => {
    let posts = [];
    let checkboxStyle = { marginTop: "-0.4rem" };
    try {
      posts = await fetch(fetchUrl).then((res) => res.json());
      for (let i = 0; i < posts.length; i++) {
        // add a checkbox for each post
        posts[i].check = (
          <MDBInput
            label=" "
            type="checkbox"
            className="deleteCheckbox"
            style={checkboxStyle}
            onClick={() => toggleCheckbox(posts[i]._id)}
          />
        );
        // turn the title to a hyper link
        let url = "/posting/details/".concat(posts[i]._id);
        posts[i].title = (
          <a
            className="titleURL indigo-text"
            href={url}
            target="_blank"
            rel="noreferrer"
          >
            {posts[i].title}
            {posts[i].isHot === true && <WhatshotIcon className="hotIcon" />}
          </a>
        );
        if (posts[i].area === 0) posts[i].area = "";
      }
      console.log(`${posts.length} posts returned in the response.`);
    } catch (err) {
      console.log("error occurs ", err);
    }
    setPosts(posts);
  };

  const toggleCheckbox = (id) => {
    if (deleteList.includes(id)) {
      const index = deleteList.indexOf(id);
      if (index > -1) {
        deleteList.splice(index, 1);
      }
    } else {
      deleteList.push(id);
    }
    setChecked(deleteList);
  };

  useEffect(() => {
    getPosts();
  }, [fetchUrl]);

  let colums = [
    {
      field: "check",
    },
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
  const loginInfo = getUser();
  // if it's not the admin, delete the first checkbox column
  if (loginInfo.adminAccess !== true) {
    colums.shift();
  }

  const table = {
    columns: colums,
    rows: posts,
  };

  const deletePosts = async () => {
    try {
      let result = await fetch("/admin/delete", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          deleteList: checked,
        }),
      }).then((res) => res.json());
      if (result.success) {
        setChecked([]);
        window.location.href = "/";
      } else {
        alert("Backend failed to delete the records");
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
        {loginInfo.adminAccess === true && (
          <Button
            variant="contained"
            color="secondary"
            onClick={() => deletePosts(deleteList)}
          >
            Delete
          </Button>
        )}
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
