import { useSession, signIn } from 'next-auth/react'
import React, { useEffect } from 'react'
import spotifyAPI from '../lib/spotify';

const useSpotify = () => {
    const {data: session, status} = useSession();

    useEffect(() => {
        if (session) {
            if (session.error === 'RefreshAccessTokenError') {
                signIn();
            }

            spotifyAPI.setAccessToken(session.user.accessToken)
        }
    }, [session])
  return spotifyAPI;
}

export default useSpotify