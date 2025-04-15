"use strict";
// import bcrypt from 'bcrypt'
// import passport from 'passport'
// import { Strategy as GoogleStrategy } from 'passport-google-oauth20'
// import prisma from '../utils/prisma'
// import quicker from '../utils/quicker'
// passport.use(
//   new GoogleStrategy(
//     {
//       clientID: process.env.GOOGLE_CLIENT_ID!,
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
//       callbackURL: `/api/v1/auth/google/callback`,
//     },
//     async (_accessToken, _refreshToken, profile, done) => {
//       try {
//         let user = await prisma.user.findUnique({
//           where: { email: profile._json.email },
//         })
//         if (!user) {
//           const hashedPassword = await bcrypt.hash(profile.id, 10)
//           user = await prisma.user.create({
//             data: {
//               firstName: profile.displayName!,
//               email: profile._json.email!,
//               role: 'USER',
//               password: hashedPassword,
//               googleId: profile.id,
//             },
//           })
//         }
//         const accessToken = quicker.generateAccessToken({
//           id: user.id,
//           email: user.email,
//           role: user.role,
//         })
//         const refreshToken = quicker.generateAccessToken({
//           id: user.id,
//           email: user.email,
//           role: user.role,
//         })
//         return done(null, {
//           user,
//           accessToken,
//           refreshToken,
//           provider: 'google',
//         })
//       } catch (error) {
//         return done(error)
//       }
//     },
//   ),
// )
