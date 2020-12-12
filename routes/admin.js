const express = require('express');
const router = express.Router();
const fs = require('fs');
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
        // modify _50x50c.jpg to _600x450.jpg
        imageList[i] = imageList[i].replace('_50x50c', '_600x450');
      }
    }
    const housing = post['housing']; // "/ 3br - 2000ft"
    let br = null;
    let squareftInt = 0;
    if (housing !== null) {
      br = housing.substring(2, housing.indexOf('-') - 1);
      sft = housing.substring(housing.indexOf('-') + 2).replace(' ', '');
      if ((sft !== null) & (sft.length !== 0)) {
        squareftInt = parseInt(sft.replace(/\D/g, '')); // convert "749ft" to 749
      }
    }

    let resulthood = post['result-hood'];
    if (resulthood !== null) {
      resulthood = resulthood.substring(2, resulthood.length - 1);
    }

    let priceString = post['result-price']; // convert "$7,995" to 7995
    let priceInt = parseInt(priceString.replace('$', '').replace(',', ''));

    let dateString = post['postinginfo'];
    if (dateString !== null) {
      dateString = dateString.match(/\d{4}\-\d{2}\-\d{2} \d{2}:\d{2}/)[0];
    }

    const postItem = {
      title: post['result-title'],
      mapAddress: post['mapaddress'],
      price: priceInt,
      region: resulthood,
      date: dateString,
      contentHTML: post['postingbody'],
      images: imageList,
      bedroom: br,
      area: squareftInt,
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

router.delete('/delete', async (req, res) => {
  const myDB = await connectDB();
  const deleteList = req.body.deleteList;
  const dbResult = await myDB.deletePosts(deleteList);
  if (dbResult.result.ok === 1) {
    res.json({ success: true });
  } else {
    res.json({ success: false });
  }
});

module.exports = router;
