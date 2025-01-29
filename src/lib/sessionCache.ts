// it is used to cache the session for useing in multiple components (server components) (async components)
// just call 
// import { getCachedSession } from "@/lib/sessionCache";
// const session = await getCachedSession();

import { Session } from "next-auth";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

let sessionCache: Session | null = null;

export const getCachedSession = async (): Promise<Session | null> => {
  if (!sessionCache) {
    sessionCache = await getServerSession(authOptions);
  }
  return sessionCache;
};