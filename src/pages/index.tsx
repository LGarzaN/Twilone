import { SignIn, SignInButton, SignOutButton, useUser } from "@clerk/nextjs";
import Head from "next/head";
import Link from "next/link";
import { Input } from "postcss";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import Image from "next/image";

import { api } from "~/utils/api";
import type { RouterOutputs } from "~/utils/api";
import { LoadingPage, LoadingSpinner } from "~/components/loading";

dayjs.extend(relativeTime);

const CreatePostWizard = () => {
  const { user } = useUser();

  console.log(user)

  if (!user) return null;

  return <div className="flex gap-3 w-full">
      <Image 
      src = {user.imageUrl} 
      alt="Profile Image" 
      className="w-14 h-14 rounded-full"
      width={56}
      height={56}
      />

      <input placeholder="Type Something" className="bg-transparent px-2 grow outline-none"/>

  </div>
}

type PostWithUser = RouterOutputs["post"]["getAll"][number];
const PostView = (props: PostWithUser) => {
  const { post, author } = props;
  return(
    <div key={post.id} className="p-4 border-b border-slate-400 flex flex-row items-center gap-4">
      <div>
        <Image src={author.profilePicture} alt="Profile Image" className="w-14 h-14 rounded-full" width={56} height={56}/>
      </div>
      <div className="flex flex-col">
        <div>
          <span className="text-sm text-slate-100">@{author.username}</span> 
          <span className="text-sm text-slate-400">{"  ·  "}</span> 
          <span className="text-sm text-slate-400">{dayjs(post.createdAt).fromNow()}</span>
        </div>
        <div>
          {post.content} 
        </div>
      </div>
    </div>
  )
}

const Feed = () => {
  const { data, isLoading: postsLoading } = api.post.getAll.useQuery();

  if (postsLoading) return <LoadingPage />;

  if (!data) return <div>no data</div>

  return(
    <div className="flex flex-col">
            {[...data]?.map((fullPost) => (
              <PostView {...fullPost} key={fullPost.post.id}/>
            ))}
          </div>
  )

}

export default function Home() {
  const { data, isLoading: postsLoading } = api.post.getAll.useQuery();

  const {user, isLoaded: userLoaded, isSignedIn} = useUser();

  if (!userLoaded) return <div />;

  if (!data) return <div>no data</div>

  return (
    <>
      <Head>
        <title>Create T3 App</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex justify-center h-screen">
        <div className=" w-full md:max-w-2xl border-x border-slate-400">
          <div className="border-b border-slate-400 p-4">
            {!isSignedIn && <div className="flex justify-center"><SignInButton /></div>}
            {isSignedIn && <CreatePostWizard />}
          </div>
          <Feed />
        </div>
      </main>
    </>
  );
}
