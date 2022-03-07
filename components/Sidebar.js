import React, { useEffect, useState } from 'react'
import {
    HomeIcon,
    SearchIcon,
    LibraryIcon,
    PlusCircleIcon,
    RssIcon
} from '@heroicons/react/outline'
import {
    HeartIcon,
} from '@heroicons/react/solid'

import {signOut, useSession} from 'next-auth/react'
import useSpotify from '../hooks/useSpotify'
import { useRecoilState } from 'recoil'
import {playlistIdState} from '../atoms/playlistAtom'





function Sidebar() {

    const {data: session, status} = useSession()
    const [playlists, setPlaylists] = useState([])
    const spotifyAPI = useSpotify()
    const [playlistId, setPlaylistId] = useRecoilState(playlistIdState)

    console.log(playlistId)
    useEffect(() => {
      if (spotifyAPI.getAccessToken()) {
          spotifyAPI.getUserPlaylists().then((data) => {
              setPlaylists(data.body.items)
          })
      }
    }, [session, spotifyAPI])

  return (
    
    <div className='text-gray-500 p-5 text-xs border-r 
    border-gray-900 overflow-y-scroll h-screen scrollbar-hide
    lg:text-sm sm:max-w-[12rem] lg:max-w-[15rem] hidden md:inline-flex pb-36'
    >
        <div className='space-y-4'>
            <button className='flex items-center space-x-2 hover:text-white'>
                <HomeIcon className='h-5 w-5'/>
                <p>Home</p>
            </button>
            <button className='flex items-center space-x-2 hover:text-white'>
                <SearchIcon className='h-5 w-5'/>
                <p>Search</p>
            </button>
            <button className='flex items-center space-x-2 hover:text-white'>
                <LibraryIcon className='h-5 w-5'/>
                <p>Your Library</p>
            </button>
            <hr className='border-t-[0.1px]'/>

            <button className='flex items-center space-x-2 hover:text-white'>
                <PlusCircleIcon className='h-5 w-5'/>
                <p>Create Playlist</p>
            </button>
            <button className='flex items-center space-x-2 hover:text-white'>
                <HeartIcon className='h-5 w-5 text-red-500'/>
                <p>Liked Songs</p>
            </button>
            <button className='flex items-center space-x-2 hover:text-white'>
                <RssIcon className='h-5 w-5 text-green-500'/>
                <p>Your Episodes</p>
            </button>
            <hr className='border-t-[0.1px]'/>

            {/* Playlists */}
            {playlists.map((playlist) => (
                <p onClick={() => setPlaylistId(playlist.id)} className='cursor-pointer hover:text-white' key={playlist.id}>{playlist.name}</p>
            )
            )}
            
        </div>
    </div>
  )
}

export default Sidebar