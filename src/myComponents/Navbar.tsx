import { useState } from 'react';
import { AiOutlineMenu, AiOutlineSearch, AiOutlineClose } from 'react-icons/ai';
import { VscMortarBoard } from 'react-icons/vsc';
import { BsPerson } from 'react-icons/bs';
import Link  from 'next/link';

const Navbar = () => {
  const [sideNav, setSideNav] = useState(false);

  return (
    <div className='max-w-[1520] mx-auto flex justify-between items-center p-4 sticky top-0 bg-white shadow-kid z-10 border-b-2 border-kid-cream'>
      <div className='flex items-center space-x-4'>
        <div onClick={() => setSideNav(!sideNav)} className='cursor-pointer kid-bounce'>
          <AiOutlineMenu size={25} className="text-kid-blue hover:text-kid-purple transition-colors" />
        </div>
        <Link href="/" className="kid-bounce">
          <h1 className='text-kid-3xl font-kid font-bold'>
            <span className='text-kid-pink'>KID</span>
            <span className='text-kid-purple'>vocate</span>
          </h1>
        </Link>
      </div>
      <div className='bg-kid-cream rounded-kid flex items-center px-4 w-[200px] sm:w-[400px] lg:w-[500px] space-x-2 border-2 border-kid-blue/20 focus-within:border-kid-blue transition-colors'>
        <AiOutlineSearch size={25} className="text-kid-blue" />
        <input 
          className='bg-transparent p-3 w-full focus:outline-none text-kid-base font-kid placeholder:text-kid-blue/60' 
          type='text' 
          placeholder='Search for fun stuff...' 
        />
      </div>
      <div className="flex items-center space-x-4">
        <Link href='/games'>
          <button className='bg-gradient-to-r from-kid-green to-kid-teal text-white hidden md:flex items-center py-3 px-6 rounded-kid font-kid font-bold text-kid-base shadow-kid hover:shadow-kid-lg transition-all duration-300 kid-button'>
            Play Now
            <VscMortarBoard size={20} className='ml-2' />
          </button>
        </Link>
        <Link href="/">
          <button className='bg-gradient-to-r from-kid-blue to-kid-purple text-white hidden md:flex items-center py-3 px-6 rounded-kid font-kid font-bold text-kid-base shadow-kid hover:shadow-kid-lg transition-all duration-300 kid-button'>
            Login
            <BsPerson size={20} className="ml-2" />
          </button>
        </Link>
      </div>
      {sideNav ? (
        <div className='bg-black/60 fixed w-full h-screen z-10 top-0 left-0' onClick={() => setSideNav(!sideNav)}></div>
      ) : (
        ""
      )}
      <div className={sideNav
        ? 'fixed top-0 left-0 w-[300px] h-screen bg-white z-10 duration-200 shadow-kid-xl border-r-2 border-kid-cream'
        : 'fixed top-0 left-[-100%] w-[300px] h-screen bg-white z-10 duration-200 shadow-kid-xl border-r-2 border-kid-cream'
      }
      >
        <AiOutlineClose onClick={() => setSideNav(!sideNav)} size={25} className='absolute right-4 top-4 cursor-pointer text-kid-blue hover:text-kid-purple transition-colors' />
        <h2 className='text-kid-2xl p-6 font-kid font-bold'>
          <span className='text-kid-purple'>KID</span>
          <span className='text-kid-pink'>vocate</span>
        </h2>
        <nav>
          <ul className='flex flex-col p-4 space-y-2'>
            <li className='text-kid-lg py-3 flex items-center hover:bg-kid-cream rounded-kid px-3 transition-colors'>
              <BsPerson size={25} className="mr-4 text-white bg-gradient-to-r from-kid-blue to-kid-purple rounded-full p-1" />
              <Link href="/" className="cursor-pointer font-kid font-bold text-kid-blue hover:text-kid-purple transition-colors">Home</Link>
            </li>
            <li className='text-kid-lg py-3 flex items-center hover:bg-kid-cream rounded-kid px-3 transition-colors'>
              <BsPerson size={25} className="mr-4 text-white bg-gradient-to-r from-kid-green to-kid-teal rounded-full p-1" />
              <Link href="/games" className="cursor-pointer font-kid font-bold text-kid-green hover:text-kid-teal transition-colors">Play Games</Link>
            </li>
            <li className='text-kid-lg py-3 flex items-center hover:bg-kid-cream rounded-kid px-3 transition-colors'>
              <BsPerson size={25} className="mr-4 text-white bg-gradient-to-r from-kid-pink to-kid-purple rounded-full p-1" />
              <Link href="/courses" className="cursor-pointer font-kid font-bold text-kid-pink hover:text-kid-purple transition-colors">Courses</Link>
            </li>
            <li className='text-kid-lg py-3 flex items-center hover:bg-kid-cream rounded-kid px-3 transition-colors'>
              <BsPerson size={25} className="mr-4 text-white bg-gradient-to-r from-kid-yellow to-kid-orange rounded-full p-1" />
              <Link href="/personal" className="cursor-pointer font-kid font-bold text-kid-orange hover:text-kid-yellow transition-colors">Discuss</Link>
            </li>
            <li className='text-kid-lg py-3 flex items-center hover:bg-kid-cream rounded-kid px-3 transition-colors'>
              <BsPerson size={25} className="mr-4 text-white bg-gradient-to-r from-kid-teal to-kid-blue rounded-full p-1" />
              <Link href="/Contact" className="cursor-pointer font-kid font-bold text-kid-teal hover:text-kid-blue transition-colors">Contact us</Link>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  )
}

export default Navbar;
