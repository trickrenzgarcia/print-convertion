import HistoryComponent from '@/components/HistoryComponent';
import { auth } from '@/drizzle/auth';
import { redirect } from 'next/navigation';

export default async function HistoryPage() {

  const session = await auth()
  
    if (!session) {
      redirect('/login')
    }

  return (
    <div className='p-6'>
      <h1 className='text-3xl'>Print History</h1>
      <div className='w-full py-10 md:px-20'>
        <HistoryComponent />
      </div>
    </div>
  )
}
