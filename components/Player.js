import { useSession } from 'next-auth/react'
import React, { useCallback, useEffect, useState } from 'react'
import { useRecoilState } from 'recoil'
import { currentTrackIdState, isPlayingState } from '../atoms/songAtom'
import useSpotify from '../hooks/useSpotify'
import useSongInfo from '../hooks/useSongInfo'
import { debounce } from 'lodash';
import { 
    RewindIcon,
    SwitchHorizontalIcon,
    FastForwardIcon,
    PauseIcon,
    PlayIcon,
    ReplyIcon,
    VolumeUpIcon
 } from '@heroicons/react/solid'
import { 
    HeartIcon,
    VolumeUpIcon as VolumeDownIcon,
 } from '@heroicons/react/outline'


const Player = () => {
    const spotifyAPI = useSpotify()
    const { data: session, status} = useSession()
    const [currentTrackId, setCurrentTrackId] = useRecoilState(currentTrackIdState)
    const [isPlaying, setIsPlaying] = useRecoilState(isPlayingState)
    const [volume, setVolume] = useState(50)
    const songInfo = useSongInfo()
    

    const fetchCurrentSong = () => {
        if(!songInfo) {
            spotifyAPI.getMyCurrentPlayingTrack().then((data) => {
                setCurrentTrackId(data.body?.item?.id)

                spotifyAPI.getMyCurrentPlaybackState().then((data) => {
                    setIsPlaying(data.body?.is_playing)
                })

            })
        }
    }

    const handlePlayPause = () => {
        spotifyAPI.getMyCurrentPlaybackState().then((data) => {
            if (data.body.is_playing) {
                spotifyAPI.pause()
                setIsPlaying(false)
            } else {
                spotifyAPI.play()
                setIsPlaying(true)
            }
        })
    }

    const debouncedAdjustVolume = useCallback(
        debounce((volume) => {
            spotifyAPI.setVolume(volume).catch((err) => {});
        }, 500), [])

    useEffect(() => {
      if (spotifyAPI.getAccessToken() && !currentTrackId) {
          //fetch song info
          fetchCurrentSong()
          setVolume(50)
      }
    }, [currentTrackIdState, spotifyAPI, session])

    useEffect(() => {
        if (volume > 0 && volume < 100) {
            debouncedAdjustVolume(volume)
        }
    }, [volume])
    
    
    

  return (
    <div className='h-24 bg-gradient-to-b from-black to-gray-900 text-white grid grid-cols-3 text-xs
    md:text-base px-2 md:px-8'>
        {/*Left*/}
        <div className='flex items-center space-x-4'>
            <img className='hidden md:inline h-10 w-10' src={songInfo?.album.images?.[0]?.url} alt="" />
            <div>
                <h3>{songInfo?.name}</h3>
                <p>{songInfo?.artists?.[0]?.name}</p>
            </div>
        </div>

        {/*CENTER*/}
        <div className='flex items-center justify-evenly'>
            <SwitchHorizontalIcon className='button'/>
            <RewindIcon className='button' 
            //onClick={() => spotifyAPI.skipToPrevious()} -- API IS BROKEN
            />
            {isPlaying ? (
                <PauseIcon onClick={handlePlayPause} className='button w-10 h-10'/>
            ):(
                <PlayIcon onClick={handlePlayPause} className='button w-10 h-10'/>
            )}

            <FastForwardIcon className='button' 
            //onClick={() => spotifyAPI.skipToNext()} -- API IS BROKEN
            />
            <ReplyIcon className='button' />
        </div>

        {/*RIGHT*/}
        <div className='flex items-center space-x-3 md:space-x-4 justify-end pr-5'>
            <VolumeDownIcon className='button' onClick={() => volume > 0 && setVolume(volume - 10) }/>
            <input className='w-14 md:w-28' type="range" value={volume} min={0} max={100} 
            onChange={(e) => setVolume(Number(e.target.value))}
            />
            <VolumeUpIcon className='button' onClick={() => volume < 100 && setVolume(volume + 10) } />
        </div>
    </div>
  )
}

export default Player