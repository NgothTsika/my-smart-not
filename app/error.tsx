"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const Error = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background px-6 text-center">
      <Image
        src="/error.jpg"
        alt="Error illustration"
        width={300}
        height={300}
        className="mb-6"
      />

      <h1 className="text-3xl font-bold text-foreground mb-2">
        Oups ! Une erreur s'est produite.
      </h1>
      <p className="text-muted-foreground text-sm mb-6">
        Désolé, nous n'avons pas pu charger cette page. Essayez de revenir à
        l'accueil ou réessayez plus tard.
      </p>

      <Button asChild variant="default" size="lg">
        <Link href="/documents">Go back</Link>
      </Button>
    </div>
  );
};

export default Error;
