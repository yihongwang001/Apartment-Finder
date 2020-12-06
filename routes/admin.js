var express = require('express');
var router = express.Router();
var fs = require('fs');
const connectDB = require('../database/db');

// this function will read a given file and parse the information
// it returns a list of posts that can be added to the database later
const generateNewPosts = () => {
  const jsonString = fs.readFileSync(__dirname + '/sample.json', 'utf8');
  const posts = JSON.parse(jsonString);
  let parsedPosts = [];

  for (let i = 0; i < posts.length; i++) {
    const post = posts[i];

    const imageList = post['images'];
    if (imageList.length !== 0) {
      for (let i = 0; i < imageList.length; i++) {
        // modify _50x50c.jpg to _1200x900.jpg
        imageList[i] = imageList[i].replace('_50x50c', '_1200x900');
      }
    }
    const housing = post['housing']; // "/ 3br - 2000ft"
    let br = null;
    let squareft = null;
    if (housing != null) {
      br = housing.substring(2, housing.indexOf('-') - 1);
      sft = housing.substring(housing.indexOf('-') + 2);
    }

    let resulthood = post['result-hood'];
    resulthood = resulthood.substring(2, resulthood.length - 1);

    const postItem = {
      title: post['result-title'],
      mapAddress: post['mapaddress'],
      price: post['result-price'],
      region: resulthood,
      date: post['postinginfo'].match(/\d{4}\-\d{2}\-\d{2} \d{2}:\d{2}/),
      contentHTML: post['postingbody'],
      images: imageList,
      bedroom: br,
      area: squareft,
    };
    parsedPosts.push(postItem);
  }
  return parsedPosts;
};

router.post('/import', async (req, res) => {
  req.pipe(req.busboy);
  req.busboy.on('file', function (filefield, file, filename) {
    console.log('Uploading: ' + filename);
    const fstream = fs.createWriteStream(__dirname + '/sample.json');
    file.pipe(fstream);

    fstream.on('close', async () => {
      console.log('file stream ended');
      const newPosts = generateNewPosts();
      if (newPosts.length !== 0) {
        const myDB = await connectDB();
        let returned = await myDB.addPosts(newPosts);
        if (returned.result.ok === 1) {
          res.json(returned.ops);
        } else {
          res.json({});
        }
      } else {
        console.log('Error parsing JSON string!');
      }
    });
  });
});

module.exports = router;
