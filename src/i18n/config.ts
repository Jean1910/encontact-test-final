import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const resources = {
  pt: {
    translation: {
      app: {
        name: "enContact",
        tagline: "Sua caixa de mensagens, reinventada",
      },
      login: {
        title: "Entrar na sua conta",
        subtitle: "Use Admin / Admin para acessar a demonstração",
        username: "Usuário",
        password: "Senha",
        submit: "Entrar",
        signingIn: "Entrando...",
        error: "Credenciais inválidas. Tente Admin / Admin.",
        hint: "Dica: Admin / Admin",
        footer: "Teste prático enContact — Frontend",
      },
      header: {
        search: "Buscar mensagens",
        searchPlaceholder: "Buscar por nome ou assunto... (atalho: /)",
        toggleTheme: "Alternar tema",
        toggleLanguage: "Alterar idioma",
        profile: "Perfil",
        signedInAs: "Conectado como",
        logout: "Sair",
        settings: "Configurações",
      },
      sidebar: {
        accounts: "Contas",
        loading: "Carregando menus...",
        empty: "Nenhuma conta encontrada",
        moveHere: "Solte aqui para mover",
      },
      toolbar: {
        archive: "Arquivar",
        archiveSelected: "Arquivar ({{count}})",
        markRead: "Marcar como lida",
        markUnread: "Marcar como não lida",
        star: "Destacar",
        selectAll: "Selecionar tudo",
        clear: "Limpar seleção",
        sort: "Ordenar",
      },
      list: {
        loading: "Carregando mensagens...",
        empty: "Nenhuma mensagem por aqui",
        emptyHint: "Selecione um item no menu lateral ou tente outro filtro.",
        archived: "{{count}} mensagem arquivada",
        archived_other: "{{count}} mensagens arquivadas",
        results: "{{count}} resultado",
        results_other: "{{count}} resultados",
        unread: "Não lida",
        starred: "Destacada",
      },
      a11y: {
        selectItem: "Selecionar mensagem de {{name}}",
        toggleStar: "Alternar destaque",
        toggleRead: "Alternar lida/não lida",
        userInitials: "Iniciais do usuário {{initials}}",
      },
      languages: {
        pt: "Português",
        en: "English",
      },
      theme: {
        light: "Claro",
        dark: "Escuro",
      },
    },
  },
  en: {
    translation: {
      app: {
        name: "enContact",
        tagline: "Your inbox, reimagined",
      },
      login: {
        title: "Sign in to your account",
        subtitle: "Use Admin / Admin to access the demo",
        username: "Username",
        password: "Password",
        submit: "Sign in",
        signingIn: "Signing in...",
        error: "Invalid credentials. Try Admin / Admin.",
        hint: "Hint: Admin / Admin",
        footer: "enContact practical test — Frontend",
      },
      header: {
        search: "Search messages",
        searchPlaceholder: "Search by name or subject... (shortcut: /)",
        toggleTheme: "Toggle theme",
        toggleLanguage: "Change language",
        profile: "Profile",
        signedInAs: "Signed in as",
        logout: "Sign out",
        settings: "Settings",
      },
      sidebar: {
        accounts: "Accounts",
        loading: "Loading menus...",
        empty: "No accounts found",
        moveHere: "Drop here to move",
      },
      toolbar: {
        archive: "Archive",
        archiveSelected: "Archive ({{count}})",
        markRead: "Mark as read",
        markUnread: "Mark as unread",
        star: "Star",
        selectAll: "Select all",
        clear: "Clear selection",
        sort: "Sort",
      },
      list: {
        loading: "Loading messages...",
        empty: "Nothing to see here",
        emptyHint: "Pick a folder in the sidebar or try a different filter.",
        archived: "{{count}} message archived",
        archived_other: "{{count}} messages archived",
        results: "{{count}} result",
        results_other: "{{count}} results",
        unread: "Unread",
        starred: "Starred",
      },
      a11y: {
        selectItem: "Select message from {{name}}",
        toggleStar: "Toggle star",
        toggleRead: "Toggle read state",
        userInitials: "User initials {{initials}}",
      },
      languages: {
        pt: "Português",
        en: "English",
      },
      theme: {
        light: "Light",
        dark: "Dark",
      },
    },
  },
};

if (!i18n.isInitialized) {
  void i18n.use(initReactI18next).init({
    resources,
    lng:
      typeof window !== "undefined"
        ? localStorage.getItem("encontact.lang") || "pt"
        : "pt",
    fallbackLng: "pt",
    interpolation: { escapeValue: false },
  });
}

export default i18n;
