'use client';
import { useEffect, useState } from 'react';
import RepositoryBlock, { RepositoryInfo } from '@/components/RepositoryBlock';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import ActionButton from '@/components/ActionButton';

export default function Dashboard() {
  useSession({
    required: true,
    onUnauthenticated() {
      redirect('/auth');
    },
  });

  // Строка поиска
  const [searchInputValue, setInputValue] = useState('');

  // Блок с репозиториями
  const [repositories, submitSearch] = useState(<Repositories searchInput={searchInputValue} />);

  return (
    <div className='flex flex-col justify-center gap-4 w-5/6'>
      <div>
        <h1 className='font-bold text-[48px] text-center'>Доступные репозитории</h1>
      </div>
      <div className='w-full h-[50px] flex justify-center gap-4'>
        <input
          className='w-[40%] font-bold px-3 bg-[#8B8B8B]'
          type='text'
          value={searchInputValue}
          onChange={(event) => setInputValue(event.target.value)}
        />
        <ActionButton
          text='Поиск'
          action={async (_) => submitSearch(<Repositories searchInput={searchInputValue} />)}
        />
      </div>
      {repositories}
    </div>
  );
}

function Repositories({ searchInput }: { searchInput: string }) {
  const [isLoading, setIsLoading] = useState(true);
  const [repos, setRepos] = useState<RepositoryInfo[]>([]);

  useEffect(() => {
    setIsLoading(true);
    const fetchRepos = async () => {
      //TODO: почему-то запрос летит дважды
      const response = await fetch(`/api/repos/github?search=${searchInput}`);
      const data = (await response.json()).repositories;
      setRepos(data);
      setIsLoading(false);
    };

    fetchRepos();
  }, [searchInput]);

  return isLoading ? (
    <p className='text-3xl w-full flex justify-center'>Загрузка...</p>
  ) : repos.length ? (
    repos.map((repo) => <RepositoryBlock key={repo.name} repository={repo} />)
  ) : (
    <p className='w-full flex justify-center text-3xl'>Нет доступных репозиториев</p>
  );
}
