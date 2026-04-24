import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { LoginScreen } from "@/components/LoginScreen";
import { MainPage } from "@/components/MainPage";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "enContact — Inbox" },
      {
        name: "description",
        content:
          "enContact: gerencie suas contas e mensagens em uma interface moderna inspirada no Office 365.",
      },
      { property: "og:title", content: "enContact — Inbox" },
      {
        property: "og:description",
        content: "Gerencie contas e mensagens em uma interface moderna e responsiva.",
      },
    ],
  }),
  component: IndexPage,
});

function IndexPage() {
  const { isAuthenticated } = useAuth();
  const [, force] = useState(0);

  if (!isAuthenticated) {
    return <LoginScreen onSuccess={() => force((n) => n + 1)} />;
  }
  return <MainPage />;
}
