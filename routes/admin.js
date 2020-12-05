var express = require('express');
var router = express.Router();
var fs = require('fs');

const readFile = () => {
  fs.readFile(__dirname + '/sample.json', 'utf8', (err, jsonString) => {
    if (err) {
      console.log('Error happens when reading source file', err);
      return;
    }
    try {
      const posts = JSON.parse(jsonString);

      for (let i = 0; i < posts.length; i++) {
        const post = posts[i];
        const images = post['images'];
        // modify _50x50c.jpg to _1200x900.jpg
        if (images.length !== 0) {
          for (let i = 0; i < images.length; i++) {
            images[i] = images[i].replace('_50x50c', '_1200x900');
          }
        }

        const title = post['result-title'];
        const price = post['result-price'];
        const price2 = post['price'];

        const housing = post['housing']; // "/ 3br - 2000ft"
        let bedroom = null;
        let area = null;
        if (housing != null) {
          bedroom = housing.substring(2, housing.indexOf('-') - 1);
          area = housing.substring(housing.indexOf('-') + 2);
        }

        const tags = post['result-hood'];
        const mapAddress = post['mapaddress'];
        const dateHTML = post['postinginfo'];
        // "<p id=\"display-date\" class=\"postinginfo reveal\">\n
        // Posted\n                    <time class=\"date timeago\" datetime=\"2020-10-23T13:20:59-0700\">\n
        // 2020-10-23 13:20\n                    </time>\n            </p>"
        const contentHTML = post['postingbody'];
        console.log('=====================================================');
        console.log(i);
        console.log(images);
        console.log(title);
        console.log(price);
        console.log(price2);
        console.log(bedroom);
        console.log(area);
        console.log(mapAddress);
        console.log(dateHTML);
        console.log(contentHTML);
        console.log(tags);
      }
    } catch (err) {
      console.log('Error happens when parsing JSON string:', err);
    }
  });
};

router.post('/import', function (req, res, next) {
  console.log('lalala');
  var fstream;
  req.pipe(req.busboy);
  req.busboy.on('file', function (fieldname, file, filename) {
    console.log('Uploading: ' + filename);
    console.log(file.read(10));
    fstream = fs.createWriteStream(__dirname + '/sample.json');
    file.pipe(fstream);
    fstream.on('close', function () {
      console.log('end');
      readFile();
    });
  });
});

module.exports = router;
