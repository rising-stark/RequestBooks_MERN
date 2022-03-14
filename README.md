1. clone this repository
2. install nodejs version = 16.14.0
3. cd to backend and run on terminal "npm i"
4. cd to frontend and run on terminal "npm i"
5. go to https://account.mongodb.com/account/login and create an account there with default options. It will take some time to create a cluster
6. Once the cluster is ready on the mongodb dashboard, go to "Database Access" tab under security. Click on "Add new database user". Enter a username and a password and remember these credentials for later use. Then select "Add User".
7. on the mongodb dashboard, go to "Network Access" tab under security. Click on "Add IP Address" and then select "Allow access from anywhere" and click confirm.
8. go to backend and create a ".env" file and put in the following credentials: replacing the <CREDENTAILS_WITH_YOURS>
```
DB_URI=mongodb+srv://<YOUR_USERNAME_HERE>:<YOUR_PASSWORD_HERE>@cluster0.jltdk.mongodb.net/bookStore?retryWrites=true&w=majority
SECRET_KEY=<ANY_RANDOM_BUT_LONG_STRING_WITHOUT_SPACES_HERE>
PORT=5000
EMAIL=<YOUR_EMAIL_HERE_WITHOUT_@gmail.com i.e., if the email is myemail@gmail.com then just myemail>
PASSWORD=<YOUR_EMAIL_PASSWORD>
```

9. To use the email service, go to this link. Find the "Turn off less secure access link" and go to that link. And turn off the less secure app access for that gmail account.
  https://support.google.com/accounts/answer/6010255?hl=en#zippy=%2Cif-less-secure-app-access-is-on-for-your-account
10. Then just go to `http://localhost:3001` for frontend and `http://localhost:5000` for backend API.
11. We will need an admin account for our application to run so for that. Run the app once and register an account. Then
on mongodb dashboard, go to "Database" tab under Deployment and click Browse Collections. There go to table "users" under the "bookStore" schema. There change the field "usertype" for the document from "user" to "admin" and click on update
