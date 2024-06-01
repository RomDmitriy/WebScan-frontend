import LoginGithub from '@/components/LoginGithub';

export default function Auth() {
  //TODO: сделать переадресацию на Dashboard
  return (
    <div className='window flex justify-center flex-col h-fit'>
      <p className='text-center font-bold text-[46px]'>Войти в аккаунт</p>
      <LoginGithub />
    </div>
  );
}
