import { withAuth } from 'next-auth/middleware';

export default withAuth({
  pages: {
    signIn: '/login',
  },
});

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/clients/:path*',
    '/questionnaires/:path*',
    '/applications/:path*',
    '/settings/:path*',
  ],
}; 