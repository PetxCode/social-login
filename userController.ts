import passport from "passport";
import { Strategy } from "passport-google-oauth20";
import userModel from "./userModel";

const GOOGLE_CLIENT_ID =
  "672291155509-ornlhf2609fcu4107nkn8d74s2s9un8r.apps.googleusercontent.com";
const GOOGLE_CLIENT_SECRET = "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";

passport.use(
  new Strategy(
    {
      clientID: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      callbackURL: "/auth/google/callback",
      scope: ["email", "profile"],
    },
    async function (
      accessToken: any,
      refreshToken: any,
      profile: any,
      cb: any,
    ) {
      console.log(profile);
      console.log(profile._json.email);

      const user = await userModel.findOne({ email: profile._json.email });

      if (user) {
        return cb(null, user);
      } else {
        const newUser = await userModel.create({ email: profile._json.email });
        return cb(null, newUser);
      }
    },
  ),
);

passport.serializeUser((user, done) => {
  return done(null, user);
});

passport.deserializeUser((user, done) => {
  return done(null, user!);
});
