# Campgrounds

<p align="center">
  <img width="460" height="300" src="https://github.com/MilenaMar/Campgrounds/blob/main/public/images/logo.png" alt="logo">
  Campgrounds review website
</p>
  



## Description

Campgrounds is a Web Application that allows users to post information about Campsites, and also add reviews. 
Users also Have acces to a cluster map where they can see the campsites/campgrounds by location.  
![Image](https://github.com/MilenaMar/Campgrounds/blob/main/public/images/thumb.png)

## User Stories

User

- Signup: As a user I can sign up in the platform 
- Login: As a registered user I can login to the platform
- Create New campground: As an user I can create a new campground
- Edit campground: As an user I can edit the campground I create
- List of campgrounds: As a user I can see a cluster map with all campgrounds and see a list of campgrounds
- Add reviews: As a user I can add a review to the campgrounds
- Logout: As a user I can logout from the platform

## Directory tree structure

```
Campgrounds
├── LICENSE
├── README.md
├── app.js
├── cloudinary
│   └── index.js
├── controllers
│   ├── campgrounds.js
│   ├── reviews.js
│   └── users.js
├── middleware.js
├── models
│   ├── campground.js
│   ├── review.js
│   └── user.js
├── node_modules
├── package-lock.json
├── package.json
├── public
│   ├── images
│   │   ├── background.png
│   │   ├── favicon.ico
│   │   ├── logo.png
│   │   └── thumb.png
│   ├── scripts
│   │   ├── clustermap.js
│   │   ├── formValidation.js
│   │   └── mapshow.js
│   └── styles
│       ├── home.css
│       └── stars.css
├── routes
│   ├── campgrounds.js
│   ├── reviews.js
│   └── user.js
├── schemasMiddleware.js
├── seeds
│   ├── cities.js
│   ├── index.js
│   └── seedHelpers.js
├── utilities
│   ├── ExpressError.js
│   └── catchAsync.js
└── views
    ├── campgrounds
    │   ├── edit.ejs
    │   ├── index.ejs
    │   ├── new.ejs
    │   └── show.ejs
    ├── error.ejs
    ├── home.ejs
    ├── layout
    │   └── boilerplate.ejs
    ├── partials
    │   ├── flash.ejs
    │   ├── footer.ejs
    │   └── navbar.ejs
    └── users
        ├── login.ejs
        └── signup.ejs
```

## Models

##### User model - Using Passport-Local-Mongoose (Moongoose Plugin)

```
- username - String //required & unique
- email - String // required & unique
- password - String // required

```


###### Campground model

``` 
- ImageSchema:  url: String, filename:String

- title:String,
- price:Number,
- images:[ImageSchema],
- geometry:{
- type: {
     type:String,
     enum:['Point'],
     required:true
    },
- coordinates: {
    type:[Number],
    required:true
    },
- description:String,
- location:String,
- author:{
     type:Schema.Types.ObjectId,
     ref:'User'
    },
- reviews: [{
     type: Schema.Types.ObjectId,
     ref:'Review'
    }]
 
```

##### Review model 

```

- body: String,
- rating:Number, 
- author:{
        type:Schema.Types.ObjectId,
        ref:'User'
    }

```


##  Routes

```
- / - Homepage - (GET)
- /signup - (GET & POST) - Signup form user
- /login - (GET & POST) - Login form user
- /logout - (GET) - User Logout

- /campgrounds - (GET) see all the campgrounds
- /campgrounds/new - (GET & POSTT) - User can create a new campground
- /campgrounds/:id - (GET ) - User can see details for a single  campground
- /campgrounds/:id/edit - (GET ) - User can see the form to edit his own campground
- /campgrounds/:id - (PUT & DELETE) - User can  edit or delete his own campground

- /campgrounds/:id/reviews - (POST) - User can add reviews for a specific campground
- /campgrounds/:id/reviews/:reviewId -(DELETE) - User can delete his own review 

```

## Pages

- Home Page (public)
- Signup Page (public)
- Login Page (public)
- All campgrounds (public)
- Campground Details (public)
- New Campground (all logged users)
- Edit Campground (owner user)



## Links

###  Deployment
 
 https://campgroundsjoi.herokuapp.com/
