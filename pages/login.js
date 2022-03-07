import React from 'react'
import {getProviders, signIn} from 'next-auth/react'

function login({providers}) {
  return (
    <div className='flex flex-col items-center bg-black min-h-screen w-full justify-center'>
        <p className='text-white italic pb-4 w-80 text-center text-sm'>This app requires Spotify Premium and an open Spotify Player on your device as this works as a web dashboard to control your desktop player</p>
        <img src="https://links.papareact.com/9xl" alt="spotify-log" className='w-52 mb-5' />
        

        {Object.values(providers).map((provider) => (
          <div key={provider.name}>
            <button className='bg-[#18D860] text-white p-5 rounded-full'
            onClick={() => signIn(provider.id, {callbackUrl: '/'})}
            >Login with {provider.name}</button>
          </div>
        ))}
    </div>
  )
}

export default login

export async function getServerSideProps() {
  const providers = await getProviders()

  return {
    props: {
      providers
    }
  }
}