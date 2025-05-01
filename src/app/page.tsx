import { Translator } from "@/components/translator";
import { Toaster } from "@/components/ui/toaster";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-background">
       <div className="w-full max-w-2xl">
        <h1 className="text-4xl font-bold text-center mb-8 text-primary">TranslatePal</h1>
        <Translator />
      </div>
      <Toaster />
    </main>
  );
}
