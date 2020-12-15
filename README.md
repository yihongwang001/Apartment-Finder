# Apartment-Finder

This is the Final Project for [CS5610 Web Development](https://johnguerra.co/classes/webDevelopment_fall_2020/)

## Author and Credits

- Author is Yeqing Huang
- Thanks to [Yilin Ma](https://martinma28.github.io/Yilin-Ma-personal-web-page/) for the user authetication part of this project. The code in LoginPage.js, RegisterPage.js and authConfig.js is written by Yilin from [Shipment System Project](https://github.com/MartinMa28/Shipment-System-Frontend)
- The html meta icon is made by [freepik](https://www.flaticon.com/authors/freepik).

## Project Features

- With a JSON file extracted from https://sfbay.craigslist.org/, the user can browse apartment rental posts and filter, search and sort these posts.
- To add a certain post to savelist or add an optional comment for this post, the visitor needs to register and log in. All the saved posts will then be shown on the Save List page.
- There is an administrator page. The users who are entitled to the admin access can import posts by uploading a JSON file or delete posts from the summary page.
- The top 5 most viewed posts in the last 72 hours will be marked with a hot icon. Only logged in users view history counts. If a user views the same post multiple times within 5 minutes, it will only be counted as one record.

## Instructions to Build:

You can find the [demo here](https://apt-finder-app.herokuapp.com/). To test administrator features:

1. Use admin account: Email: admin123@gmail.com, password: 12345
2. You can upload a template JSON file in Admin page. The file is located in database folder, called samplefile.json

Or you can run the project locally with the following steps:

1. Clone the repository.
2. Navigate to repository folder, run `npm install`to install backend dependencies.
3. Open a new window and go to frontend by `cd react_app/` then run `npm install`to install frontend dependencies.
4. Start backend and frontend servers:
   - backend in repository folder: `npm start`
   - frontend in react_app folder: `npm start`
5. Go to localhost:3000 in your web browser to visit the website

## Screenshots:

- Post Summary Page:
  ![Image of post summary preview](https://github.com/YeqingHuang/Apartment-Finder/blob/main/screenshots/post_summary_page.png)

- Post Details Page:
  ![Image of post details page](https://github.com/YeqingHuang/Apartment-Finder/blob/main/screenshots/post_details_page.png)

- Admin Deleting Post Preivew:
  ![Image of administer deleting post function](https://github.com/YeqingHuang/Apartment-Finder/blob/main/screenshots/admin_delete_page.png)

- Admin Batch Upload Preivew:
  ![Image of administer importing post function](https://github.com/YeqingHuang/Apartment-Finder/blob/main/screenshots/admin_upload_page.png)
