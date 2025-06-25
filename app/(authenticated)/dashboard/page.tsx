import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getUser();

  if (error || !data?.user) {
    redirect("/auth/login");
  }

  return (
    <div className="w-full grid grid-cols-2 gap-8">
      <Button asChild variant="secondary">
        <Link href="/targets" className="w-full h-40">
          Remote Viewing
        </Link>
      </Button>

      <Button asChild variant="secondary">
        <Link href="/events" className="w-full h-40">
          Tasking
        </Link>
      </Button>
    </div>
  );
}
