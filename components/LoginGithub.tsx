'use client';

import { signIn } from 'next-auth/react';
import { ImGithub } from 'react-icons/im';

export default function LoginGithub() {
  return (
    <button
      className='bg-[#24292E] py-[2%] px-[4%] h-[65px] text-[20px] my-[20px] mx-[10px] flex justify-center items-center'
      onClick={() => {
        signIn('github');
      }}
    >
      <ImGithub size={25} />
      <p className='ml-3 pt-1'>Продолжить через GitHub</p>
    </button>
  );
}
