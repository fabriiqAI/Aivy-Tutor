import { Sidebar } from "@/components/layout/sidebar";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import AuthProvider from "@/components/providers/session-provider";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  
  if (!session) {
    redirect("/api/auth/signin");
  }

  return (
    <AuthProvider>
      <div className="min-h-screen bg-background">
        <Sidebar />
        <main className="md:pl-64">
          <div className="container mx-auto px-4 py-8">
            {children}
          </div>
        </main>
      </div>
    </AuthProvider>
  );
}