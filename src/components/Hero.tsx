import React from 'react'

function Hero() {
  return (
    <div className="bg-gray-800 text-white h-80 hero">
        <div className="h-full mx-auto max-w-7xl p-6 flex flex-col justify-center">
            <h1 className="text-4xl md:text-5xl font-bold">Welcome to BookTracker</h1>
            <p className="text-lg">Keep track of your reading progress</p>
        </div>
    </div>
  )
}

export default Hero