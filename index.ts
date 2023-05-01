import express, { Application, NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import passport from "passport";
import "./userController";
import cookie from "cookie-session";
import userModel from "./userModel";

const app: Application = express();

app
  .use(express.json())

  .use(
    cookie({
      name: "session",
      keys: ["key1", "key2"],
      maxAge: 24 * 60 * 60 * 1000,
    }),
  )
  .use((req: Request, res: Response, next: NextFunction) => {
    if (req.session && !req.session.regenerate) {
      req.session.regenerate = (cb: any) => {
        return cb();
      };
      if (req.session && !req.session.save) {
        req.session.save = (cb: any) => {
          return cb();
        };
      }
      next();
    }
  })

  .use(passport.initialize())
  .use(passport.session())

  .get("/", (req: Request, res: Response) => {
    res.status(200).json({
      message: "Heeloooo",
    });
  })

  .get("/view", async (req: Request, res: Response) => {
    const user = await userModel.find();
    res.status(200).json({
      message: "Heeloooo",
      data: user,
    });
  })
  .get("/success", (req: Request, res: Response) => {
    const user: any = req.user;
    console.log(user);
    res.status(200).json({
      message: `Auth Successful ${user.email}`,
    });
  })
  .get("/failure", (req: Request, res: Response) => {
    res.status(200).json({
      message: "Something went wrong",
    });
  })

  .get(
    "/api/auth/google/",
    passport.authenticate("google", { scope: ["email", "profile"] }),
  );

app.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    successRedirect: "/success",
    failureRedirect: "/failure",
  }),
);

mongoose
  .connect("mongodb+srv://PeterPan:PeterPan@codelab.eqkgv.mongodb.net/socialDB")
  .then(() => {
    app.listen(7655, () => {
      console.log("server is running");
    });
  });
