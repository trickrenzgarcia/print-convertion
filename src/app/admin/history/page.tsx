import HistoryComponent from '@/components/HistoryComponent';

export default function HistoryPage() {
  return (
    <div className='p-6'>
      <h1 className='text-3xl'>Print History</h1>
      <div className='w-full py-10 md:px-20'>
        <HistoryComponent />
      </div>
    </div>
  )
}
