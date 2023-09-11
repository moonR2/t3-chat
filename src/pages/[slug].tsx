import Head from "next/head";
import { createServerSideHelpers } from "@trpc/react-query/server";
import { prisma } from "~/server/db";
import superjson from "superjson";
import { appRouter } from "~/server/api/root";
import { PageLayout } from "~/components/ui/layout";

import { api } from "~/utils/api";
import { type GetStaticPropsContext, type NextPage } from "next";
import Image from "next/image";

const Profile: NextPage<{ username: string }> = ({ username }) => {
  const { data } = api.profile.getUserByUsername.useQuery({
    username: username,
  });

  if (!data) return <div>Something went wrong</div>;

  return (
    <>
      <Head>
        <title>Profile</title>
      </Head>
      <PageLayout>
        <div className="relative h-48 bg-slate-700">
          <Image
            src={data.imageUrl}
            alt="Profile Image"
            height={128}
            width={128}
            className="border-3 absolute bottom-0 left-0 -mb-[64px] ml-4 rounded-full border-black"
          />
          <div>{data.username}</div>
        </div>
      </PageLayout>
    </>
  );
};

export const getStaticProps = async (
  context: GetStaticPropsContext<{ slug: string }>,
) => {
  const helpers = createServerSideHelpers({
    router: appRouter,
    ctx: { prisma: prisma, userId: null },
    transformer: superjson, // optional - adds superjson serialization
  });

  const username = context.params?.slug;

  if (typeof username !== "string") {
    throw new Error("slug is not a string");
  }

  const safeUsername = username.replace("@", "");

  await helpers.profile.getUserByUsername.prefetch({ username: safeUsername });

  return {
    props: {
      trpcState: helpers.dehydrate(),
      username: safeUsername,
    },
  };
};

export const getStaticPaths = () => {
  return {
    paths: [],
    fallback: "blocking",
  };
};

export default Profile;
