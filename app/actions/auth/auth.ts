import { supabaseAdmin } from '@/lib/supabase-admin';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';

export default async function auth(profile:any){
    console.log(profile); 
    //check if user already exists
    const { data:existingUser, error:selectError} = await supabaseAdmin
        .from('users')
        .select('email')
        .eq('email',profile.email)
        .single();

    if(selectError && selectError.code !== 'PGRST116'){
        console.error('DB Select error:', selectError);
        return { error: 'Database error', status: 500};
    }

    if(existingUser){
      return {status: 'ok',user:existingUser};
    }

    const dep:string = profile.email.split('@')[1].split('.')[0];
    const match = profile.email.match(/_?b(\d+)@/);
    let year = match ? parseInt(match[1], 10) + 2000 : null;

    // Insert Entry into tabble
    const {data:newUser,error:insertError} = await supabaseAdmin
        .from('users')
        .insert({
            email:profile.email,
            name:profile.name,
            picture:profile.picture,
            branch:dep,
            year:year,
            created_at:new Date().toISOString(),
        })
        .select('uid,name,email,picture,created_at,branch,year,created_at')
        .single();

    if (insertError) {
      console.error('Insert error:', insertError);
      return {
        error: 'Failed to create user',
        status: 500
      };
    }
    const token = jwt.sign(
      { userId: newUser.uid, email: newUser.email,name: newUser.name },
      process.env.JWT_SECRET!,
      { expiresIn: '7d' }
    );

    const cookieStore = await cookies();
    cookieStore.set('token', token, {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7 // 7 days
    });
    return {status: 'ok',user:newUser};
}