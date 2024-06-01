import { repo_status } from '@prisma/client';
import ActionButton from './ActionButton';
import Link from 'next/link';

export interface Severity {
  low: number;
  moderate: number;
  high: number;
}

export interface RepositoryInfo {
  id: string;
  name: string;
  description: string;
  status: repo_status;
  severity: Severity;
}

export default function RepositoryBlock({ repository }: { repository: RepositoryInfo }) {
  if (repository.status === repo_status.Scanned) {
    return (
      <Link href={`/dashboard/repo/${repository.id}`}>
        <RepositoryBlockInternal repository={repository} />
      </Link>
    );
  }

  return <RepositoryBlockInternal repository={repository} />;
}

function RepositoryBlockInternal({ repository }: { repository: RepositoryInfo }) {
  return (
    <div className='h-[200px] w-full flex flex-row'>
      <div className='h-[200px] w-3/4 bg-block_background flex flex-col justify-center pl-8'>
        <div className='text-4xl'>{repository.name}</div>
        <div className='text-xl'>{repository.description}</div>
      </div>
      <div className='h-[200px] w-1/4 bg-block_background_light'>
        <StatusInfoBlock status={repository.status} severities={repository.severity} />
      </div>
    </div>
  );
}

//TODO: функционал кнопке Скана
function StatusInfoBlock({ status, severities }: { status: repo_status; severities: Severity }): JSX.Element {
  switch (status) {
    case repo_status.NotScanned:
      return (
        <div className='h-full flex flex-col justify-center gap-4'>
          <p className='w-full text-center text-2xl'>Сканирование не проводилось</p>
          <div className='w-full flex justify-center'>
            <ActionButton text='Сканировать' />
          </div>
        </div>
      );
    case repo_status.Scanning:
      return <p className='w-full h-full flex justify-center items-center text-2xl'>Сканирование в процессе</p>;
    case repo_status.Scanned:
      return (
        <div className='h-full items-center flex flex-col justify-center'>
          <p className='text-2xl'>Уязвимости</p>
          <div className='w-full flex flex-row justify-center text-2xl mt-5 gap-[6%] flex-wrap'>
            <div className='flex flex-col items-center'>
              <p>Низкий</p>
              <p>{severities.low}</p>
            </div>
            <div className='flex flex-col items-center'>
              <p>Средний</p>
              <p>{severities.moderate}</p>
            </div>
            <div className='flex flex-col items-center'>
              <p>Высокий</p>
              <p>{severities.high}</p>
            </div>
          </div>
        </div>
      );
    default:
      return <></>;
  }
}
