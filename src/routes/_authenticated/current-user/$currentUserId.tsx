import { useQuery } from '@tanstack/react-query'
import { createFileRoute, redirect } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'


const MyServerFn = createServerFn()
  .validator(
    z.object({
      userId: z.string(),
    })
  )
  .handler(async (params) => {
    // await new Promise((resolve) => setTimeout(resolve, 3000))
    const userId = params.data.userId

    const { db } = await import('~/lib/server/db')
    const data = await db.query.user.findFirst({
      where: (users, { eq }) => eq(users.id, userId),
    })
    return {
      message: data?.name,
    }
  })

export const Route = createFileRoute('/_authenticated/current-user/$currentUserId')({
  component: RouteComponent,
  beforeLoad: async ({ context }) => {
    if (!context.user) {
      throw redirect({ to: "/login" });
    }
  }
  // loader: async({params}) => {
  //   const res = await MyServerFn( {data: {userId: params.currentUserId}})
  //   console.log(res.message)
  //   console.dir(params.currentUserId)
  //   return {
  //     message: res.message,
  //   }
  // },
})

function User({ userId }: { userId: string }) {
  const { isLoading, isSuccess, data: loaderData } = useQuery({
    queryKey: ['user', userId],
    queryFn: async () => {
      const res = await MyServerFn({ data: { userId } })
      return res
    }
  })
  return <h1 className='text-xl font-bold '>

    your name is :  <pre className='text-cyan-300 text-lg p-4 bg-accent w-2xl mx-auto'> {isLoading ? 'Loading...' : loaderData?.message}  </pre>
    Success :  <pre className='text-green-300 text-lg p-4 bg-accent max-w-30 mx-auto'> {isSuccess ? "Ok" : '?'} </pre>

  </h1>
}

function RouteComponent() {
  const { currentUserId } = Route.useParams()

  //   const data = Route.useLoaderData()

  // const {data: loaderData}  = useSuspenseQuery( { queryKey: ['user', currentUserId],
  //   queryFn: async() => {
  //     const res = await MyServerFn( {data: {userId: currentUserId}})
  //     return res
  //   }
  //  })

  return <div className=' text-center  content-center  h-screen'>Hello "!

    <pre className='text-xl font-black '>
      id: <p className='text-amber-400'>{currentUserId}</p>
    </pre>

    <User userId={currentUserId} />

  </div>
}


//"X1mYaqFMAuguZEOf77gCAOErgczJiPsc"