# ComfySloth - Demo mini-scale ecommerce website (Backend). 
### Documentation (Swagger)
  For API documentation, Please run this application and hit this route from any browser. 
http://localhost:9000/api-docs
 > It's not fully completed yet. 
### Features
* Authentication and Authorization. 
* Products Management. 
* Payment. 
* Password Reset. 
* Little bit application Security. 
* Swagger API Documentation 
### Requirements 
* Node v14+ 
* npm 
### Step 1: Clone the repo 
``` 
git clone https://github.com/sajjad960/ComfySloth_Nodejs-Express_MongoDB_Backend.git
cd ComfySloth_Nodejs-Express_MongoDB_Backend
``` 
### Step 1: Create config.env
```
NODE_ENV=development/production
PORT=9000

LOCAL_DATABASE=mongodb://localhost:27017/comfy_sloth

JWT_SECRET=comfysloth-own-kktrw-kktrw
JWT_EXPIRES_IN=10d

EMAIL_USERNAME_APP=your gmail address
EMAIL_PASSWORD_APP=your gmail app password

# Production host address
HOST_ADDRESS=Your Host Address (https://comfysloth.test.com)
LOCAL_HOST_ADDRESS=http://localhost:3000

# stripe
STRIPE_SECRET_KEY=your stripe secret key
```

### Step 3: Start the server 
install packages: run this command 
``` 
npm i 
``` 
Start this application: <br />
Note: I am working on production and deployment command, I will add it as soon as possible.😊 
``` 
npm start
```
### Generate dummy data
For generate dummy data 
 ``` 
 node data/import-data.js 
 ```
