import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { ProfileView } from "@/components/profile/profile-view";
import { redirect } from "next/navigation";

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);

  // Combined session check
  if (!session || !session.user?.email) {
    redirect("/login");
  }

  // Enhanced user query with specific field selection
  const user = await prisma.user.findUnique({
    where: { 
      email: session.user.email 
    },
    select: {
      id: true,
      email: true,
      name: true,
      onboarded: true
    }
  });

  // Check if user exists in database
  if (!user) {
    redirect("/onboarding");
  }

  // Check if user has completed onboarding
  if (!user.onboarded) {
    redirect("/onboarding");
  }

  return (
    <div className="max-w-4xl mx-auto">
      <ProfileView user={user} />
    </div>
  );
}