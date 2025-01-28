import CardData from '@/components/CardData';
import { auth } from '@/drizzle/auth';


export default async function Admin() {
  const session = await auth();
  
  return (
    <div className='p-6'>
      <h1 className='text-3xl'>Hello, {session?.user.username}!</h1>
      <h2 className='mt-10 mb-4 text-lg'>Overview</h2>
      <div className='grid grid-cols-2 gap-4 w-fit'>
        <CardData title='Total Converted' data='' />
        <CardData title='Total Converted' data=''/>
      </div>
    </div>
  )
}
