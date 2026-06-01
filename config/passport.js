const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL,
    proxy: true
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      console.log('Google OAuth callback triggered for profile:', profile.id, profile.emails?.[0]?.value);
      
      // 1. Search by googleId
      let user = await User.findOne({ googleId: profile.id });
      if (user) {
        console.log('Found existing user by googleId:', user.email);
        user.lastLogin = new Date();
        if (profile.photos && profile.photos.length > 0) {
          user.avatar = profile.photos[0].value;
        }
        await user.save();
        return done(null, user);
      }

      // 2. If not found by googleId, search by email
      const email = profile.emails?.[0]?.value;
      if (email) {
        user = await User.findOne({ email });
        if (user) {
          console.log('Found existing user by email, linking Google account:', email);
          user.googleId = profile.id;
          user.provider = 'google';
          if (profile.photos && profile.photos.length > 0) {
            user.avatar = profile.photos[0].value;
          }
          user.lastLogin = new Date();
          await user.save();
          return done(null, user);
        }
      }

      // 3. Otherwise create a new account
      console.log('Creating new user from Google profile:', email);
      user = new User({
        firstName: profile.name?.givenName || 'Google',
        lastName: profile.name?.familyName || 'User',
        email: email,
        googleId: profile.id,
        provider: 'google',
        avatar: profile.photos?.[0]?.value,
        lastLogin: new Date()
      });

      await user.save();
      return done(null, user);
    } catch (error) {
      console.error('Error in Google Strategy callback:', error);
      return done(error, null);
    }
  }
));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});
