import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { ProfileView } from "@/components/profile/profile-view";
import { redirect } from "next/navigation";

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);

  // Redirect if no session exists
  if (!session) {
    redirect("/api/auth/signin");
  }

  // Redirect if session exists but no user email
  if (!session.user?.email) {
    redirect("/api/auth/signin");
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user) {
    redirect("/onboarding");
  }

  return (
    <div className="max-w-4xl mx-auto">
      <ProfileView user={user} />
    </div>
  );
}