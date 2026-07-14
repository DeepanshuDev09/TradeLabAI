import React from 'react'
import { Link } from 'react-router'
import img from "./image/homeImg.png";

const ContentHome = () => {
  return (
    <div className='h-screen mx-auto max-w-[1300px] text-center py-15 px-8'>
        <p className='p-5 text-teal-400 text-[13px] font-semibold tracking-[0.14em] uppercase mb-4'>WHY US ?</p>
        <h1 className='font-bold text-4xl text-amber-400 '>Analyse - Backtest - Trade. <br/> <span className='text-white'>All From One Platform</span></h1>
        <p className='text-gray-400 max-w-2/3 mx-auto p-5 '>Experience seamless trading strategy backtest with our unified platform. Access indicators, win-rate , profit, and one-click execution all in one place.</p>
        <div className='py-7'>
        <Link className='text-xs text-gray-400 font-bold py-1.5 px-4 rounded-full border border-gray-400 mr-2'>Strategy</Link>
        <Link className='text-xs text-gray-400 font-bold py-1.5 px-4 rounded-full border border-gray-400 mr-2'>Custom Setting</Link>
        <Link className='text-xs text-gray-400 font-bold py-1.5 px-4 rounded-full border border-gray-400'>Backtest</Link>
        </div>
        <div className='border border-gray-400 rounded-2xl p-6'>
        <img className='' src={img} />
        </div>
    </div>
  )
}

export default ContentHome