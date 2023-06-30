//all of this comes from NextAuth
import NextAuth from 'next-auth';
import { authOptions } from '@/lib/session';

const handler = NextAuth(authOptions);

//lets us make GET and POST requests using NextAuth
export { handler as GET, handler as POST };