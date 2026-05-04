/**
 * Server component that syncs the Clerk user to the database on every
 * page load. Rendered inside the RootLayout alongside the client Header.
 */
import { checkUser } from "@/lib/checkUser";

export default async function HeaderUserSync() {
  await checkUser();
  return null; // renders nothing — side-effect only
}
