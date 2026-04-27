import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';

const secretKey = process.env.JWT_SECRET || 'fallback_secret_for_development';
const key = new TextEncoder().encode(secretKey);

export default async function DashboardRoot() {
  const cookieStore = await cookies();
  const token = cookieStore.get('auth_token')?.value;

  if (!token) {
    redirect('/login');
  }

  try {
    const { payload } = await jwtVerify(token, key, { algorithms: ['HS256'] });
    const role = payload.role as string;

    if (role === 'SUPER_ADMIN') {
      redirect('/dashboard/admin');
    } else if (role === 'VENDOR') {
      redirect('/dashboard/vendor');
    } else {
      // Customers don't have a dashboard in this architecture yet, redirect to home or profile
      redirect('/products'); 
    }
  } catch (error) {
    redirect('/login');
  }
}
