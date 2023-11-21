var express = require("express");
var router = express.Router();
var { User, ClaimDetails } = require("../models/user");
var Accommodation = require("../models/accomdation");
var ClaimDetail = require("../models/claim-details");
const Jobs = require("../models/jobs");
const Admin= require("../models/admin");
const Faq= require("../models/faq");
const passport = require("passport");

const GoogleStrategy = require("passport-google-oauth").OAuth2Strategy;
const GOOGLE_CLIENT_ID =
  "78676936473-bmt00r0e0tmdgelq3dnb2j3auqcq5qup.apps.googleusercontent.com";
const GOOGLE_CLIENT_SECRET = "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";
let userProfile;
passport.use(
  new GoogleStrategy(
    {
      clientID: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:3000/auth/google/callback",
    },
    function (accessToken, refreshToken, profile, done) {
      userProfile = profile;
      return done(null, userProfile);
    }
  )
);

router.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/error" }),
  function (req, res) {
    // Successful authentication, redirect success.
    res.redirect("/profile");
  }
);





router.get("/agent", function (req, res) {
  if(req.session.userLoggedIn){
	User.find({}).then(function(data){
		if(!data){
			res.redirect('/');
		}else{
			//console.log("found");
			res.render('data.ejs', {data});
		}
	});
  }else{
    res.redirect('/adminlogin');
  }
});


router.get("/adminlogout", function (req, res, next) {
  req.session.userLoggedIn = false;
   res.redirect('/adminlogin');
});

router.get("/adminlogin", function (req, res, next) {
   res.render("adminlogin.ejs")
});

router.get("/faq", function (req, res, next) {
  Faq.find().then((data)=>{
    res.render('faq.ejs',{data});
    });
});

router.post("/faq", function (req, res, next) {
  
  const question = req.body.question;
  const answer=" "

  const newFAQ = new Faq({ quest: question, ans:answer });  

  newFAQ.save().then(() => {
    Faq.find().then((data)=>{
    
        res.render('faq.ejs',{data:data,error: "Query received and it will be answered in the user posted questions section"});
      });
    
     
    }).catch((err) => {
      console.error('Error saving question to MongoDB:', err);
      res.status(500).send('Internal Server Error');
  });



});



router.get('/adminfaqs', (req, res) => {
  if(req.session.userLoggedIn){
  Faq.find()
    .then(faqs => res.render('adminfaq.ejs', { faqs }))
    .catch(err => res.status(500).send('Internal Server Error'));
  }else{
    res.redirect('/adminlogin')
  }
});

router.post('/edit-faq', (req, res) => {
  const id = req.body.selectedFAQ;
  const updatedAns = req.body.updatedAns;

  Faq.findByIdAndUpdate(id, { ans: updatedAns }, { new: true })
    .then(updatedFAQ => res.redirect('/adminfaqs'))
    .catch(err => res.status(500).send('Internal Server Error'));
});

router.post('/delete-faq/:id', (req, res) => {
  const id = req.params.id;

  Faq.findByIdAndRemove(id)
    .then(() => res.redirect('/adminfaqs'))
    .catch(err => res.status(500).send('Internal Server Error'));
});




router.post('/adminlogin', (req, res) => {
  var user = req.body.username;
  var pass = req.body.password;
  Admin.find().then((response)=>{
    Admin.findOne({username : user, password : pass}).then((admin) => { 
      if(admin) {
          req.session.userLoggedIn = true;
          console.log('See this',req.session.userLoggedIn)
          res.redirect("/agent");
      }
      else {
          res.render('adminlogin', {error: "Sorry Login Failed. Please Try Again!"});
      }
  }).catch((err) => { 
      console.log(`Error: ${err}`);
  });  
  })
  
});

router.get('/logout', (req, res) => {
  req.session.username = '';
  req.session.userLoggedIn = false;
  res.render('login', {error : "Succesfully Logged Out!"});
});


router.get("/", function (req, res, next) {
  return res.render("home.ejs");
});

router.get('/success', (req, res) => res.send(userProfile));
router.get('/error', (req, res) => res.send("error logging in"));

passport.serializeUser(function(user, cb) {
  cb(null, user);
});

passport.deserializeUser(function(obj, cb) {
  cb(null, obj);
});

router.get("/reg", function (req, res, next) {
  return res.render("index.ejs");
});


router.post("/reg", function (req, res, next) {

  var personInfo = req.body;

  if (
    !personInfo.email ||
    !personInfo.username ||
    !personInfo.password ||
    !personInfo.passwordConf
  ) {
    res.send();
  } else {
    if (personInfo.password == personInfo.passwordConf) {
      User.findOne({ email: personInfo.email }, function (err, data) {
        if (!data) {
          var c;
          User.findOne({}, function (err, data) {
            if (data) {
              console.log("if");
              c = data.unique_id + 1;
            } else {
              c = 1;
            }

            var newPerson = new User({
              unique_id: c,
              email: personInfo.email,
              username: personInfo.username,
              password: personInfo.password,
              passwordConf: personInfo.passwordConf,
            });

            newPerson.save(function (err, Person) {
              if (err) console.log(err);
              else console.log("Success");
            });
          })
            .sort({ _id: -1 })
            .limit(1);
          res.send({ Success: "You are regestered,You can login now." });
        } else {
          res.send({ Success: "Email is already used." });
        }
      });
    } else {
      res.send({ Success: "password is not matched" });
    }
  }
});

router.get("/login", function (req, res, next) {
  return res.render("login.ejs");
});

router.get("/insurance", function (req, res, next) {
  return res.render("insurance.ejs");
});

router.get("/newpage", function (req, res, next) {
  return res.render("newpage.ejs");
});

router.post("/login", function (req, res, next) {
  //console.log(req.body);
  User.findOne({ email: req.body.email }, function (err, data) {
    if (data) {
      console.log(req.body.password);
      console.log(data.password);
      if (data.password == req.body.password) {
        //console.log("Done Login");
        req.session.userId = data.unique_id;
        //console.log(req.session.userId);
        res.send({ Success: "Success!" });
      } else {
        res.send({ Success: "Wrong password!" });
      }
    } else {
      res.send({ Success: "This Email Is not regestered!" });
    }
  });
});

router.get("/profile", function (req, res, next) {
  console.log("profile");

  User.findOne({ unique_id: req.session.userId }, function (err, data) {
  
    if (!data) {
      res.redirect("/");
    } else {
      //console.log("found");
      return res.render("home.ejs", { name: data.username, email: data.email });
    }
  });
});

router.get("/logout", function (req, res, next) {
  console.log("logout");
  if (req.session) {
    // delete session object
    req.session.destroy(function (err) {
      if (err) {
        return next(err);
      } else {
        return res.redirect("/login");
      }
    });
  }
});

router.get("/forgetpass", function (req, res, next) {
  res.render("forget.ejs");
});

router.get("/parttime", function (req, res, next) {
  User.findOne({ unique_id: req.session.userId }, function (err, data) {
    c
    if (!data) {
      res.redirect("/");
    } else {
      ClaimDetails.findOne(
        { _id: "654b663bb6315e0d9c8b9937" },
        function (err, data) {
          console.log(data);
          console.log(err);
          res.render("newpage.ejs", {data, content: "op"});
        }
      );
    }
  });
});

router.get("/home", function (req, res, next) {
  User.findOne({ unique_id: req.session.userId }, function (err, data) {
    
   
    if (!data) {
      res.redirect("/");
    } else {
      //console.log("found");
      return res.render("home.ejs");
    }
  });
});

router.post("/forgetpass", function (req, res, next) {
  //console.log('req.body');
  //console.log(req.body);
  User.findOne({ email: req.body.email }, function (err, data) {
    
    if (!data) {
      res.send({ Success: "This Email Is not regestered!" });
    } else {
      // res.send({"Success":"Success!"});
      if (req.body.password == req.body.passwordConf) {
        data.password = req.body.password;
        data.passwordConf = req.body.passwordConf;

        data.save(function (err, Person) {
          if (err) console.log(err);
          else console.log("Success");
          res.send({ Success: "Password changed!" });
        });
      } else {
        res.send({
          Success: "Password does not matched! Both Password should be same.",
        });
      }
    }
  });
});



router.get("/accommodation", function (req, res, next) {
  res.render("accommodation.ejs");
});

router.get("/get_total_accommodation", async function (req, res, next) {
  try {
    const data = await Accommodation.find({});
    res.json({ data });
  } catch (error) {
    console.error("Error fetching accommodation data:", error);
    res.json({ message: "Unable to load data" });
  }
});

router.get("/get_total_claims", async function (req, res, next) {
  try {
    const data = await ClaimDetail.find({});
    
    res.json({ data });
  } catch (error) {
    console.error("Error fetching ClaimDetails data:", error);
    res.json({ message: "Unable to load data" });
  }
});

router.get("/get_total_jobs", async function (req, res, next) {
  try {
    const data = await Jobs.find({});
    
    res.json({ data });
  } catch (error) {
    console.error("Error fetching Jobs data:", error);
    res.json({ message: "Unable to load data" });
  }
});
module.exports = router;
