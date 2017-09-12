/*jslint esversion: 6, browser: true*/
const bCrypt = require('bcrypt-nodejs');
const LocalStrategy = require('passport-local').Strategy;
// const db = require('./models');

module.exports = (passport, donor) => {
  // Initialize the passport-local strategy and the donor model, which will be passed as arguments
  let Donor = donor;
  console.log(Donor);

  // Defines custom strategy with instance of the LocalStrategy
  passport.use('local-signup', new LocalStrategy({
      usernameField: 'username',
      passwordField: 'password',
      passReqToCallback: true // allows us to pass back the entire request to the callback
    }, (req, username, password, done) => {
      // Add hashed password generating function inside callback function.
      let generateHash = password => {
        return bCrypt.hashSync(password, bCrypt.genSaltSync(8), null);
      };
      // Check to see if donor already exists, if not add as new donor
      Donor.findOne({
        where: {
          username: username
        }
      }).then( donor => {
        if (donor) {
          return done(null, false, {
            message: 'This email address is already taken'
          });
        } else {
          let hashPassword = generateHash(password);
          let data = {
            nameFirst: req.body.nameFirst,
            nameLast: req.body.nameLast,
            gender: req.body.gender,
            locationStreet: req.body.locationStreet,
            locationCity: req.body.locationCity,
            StateAbbrev: req.body.StateAbbrev,
            locationZip: req.body.locationZip,
            email: req.body.email,
            phone: req.body.phone,
            username: username,
            password: hashPassword
          };
          console.log(data);

          Donor.create(data).then( (newDonor, created) => {
            if (!newDonor) {
              return done(null, false);
            }
            if (newDonor) {
              return done(null, newDonor);
            }
          });
        }
      });
    }
  ));
};