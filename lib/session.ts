//here we keep all the data about the currently logged in user. 
import { getServerSession } from "next-auth/next";
import { NextAuthOptions, User } from "next-auth";
import { AdapterUser } from "next-auth/adapters";
import GoogleProvider from 'next-auth/providers/google';
import jsonwebtoken from 'jsonwebtoken';
import { JWT } from 'next-auth/jwt';
import { SessionInterface, UserProfile } from "@/common.types";
import { createUser, getUser } from "./actions";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!, //the ! means it could be undefined
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    })
  ],
  jwt: {
    encode: ({ secret, token }) => {
      const encodedToken = jsonwebtoken.sign({
        ...token,
        iss: 'grafbase',
        exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24, // 1 day
      }, secret)

      return encodedToken;
    },
    decode: async ({ secret, token }) => {
      const decodedToken = jsonwebtoken.verify(token!, secret) as JWT;

      return decodedToken;
    }
  },
  theme: {
    colorScheme: 'light',
    logo: '/logo.png',
  },
  callbacks: {
    async session({ session }) {

      const email = session?.user?.email as string;

      try {
        const data = await getUser(email) as { user?: UserProfile }

        //our newSession is = to an object where we spread the original session, we tap into the User portion of it, we spread everything from the session user but then we spread everything from data.user. This is how we merge the two users.
        const newSession = {
          ...session,
          user: {
            ...session.user,
            ...data.user
          }
        }

        return newSession;
      } catch (error) {
        console.log('error getting user data', error);
        return session; //return a session even if its empty
      }      
    },
    // the | means we are making a distinction between google users and users from our database
    async signIn({ user }: { user: AdapterUser | User }) {
      try {
        //get user if they exist
        const userExists = await getUser(user?.email as string) as { user?: UserProfile }
        //if they don't exist, create them
        if (!userExists.user) {
          await createUser(
            user.name as string,
            user.email as string,
            user.image as string
          )
        }

        //return true if they exist or were created
        return true;
      } catch (error) {
        console.log(error);
        return false;
      }      
    }
  }
}

export async function getCurrentUser() {
  const session = await getServerSession(authOptions) as SessionInterface;

  return session;
}

//what we are trying to do is connect the user's Google account with our database.
//to do that we need to populate the session in 'callbacks' to merge the two users