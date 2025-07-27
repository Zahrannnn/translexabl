type Messages = {
  app: {
    title: string;
    description: string;
  };
  navigation: {
    home: string;
    about: string;
    pricing: string;
    blogs: string;
    dashboard: string;
    profile: string;
    login: string;
    register: string;
    logout: string;
  };
  home: {
    hero: {
      title: string;
      subtitle: string;
      cta: string;
    };
    features: {
      title: string;
      subtitle: string;
    };
    useCases: {
      title: string;
      subtitle: string;
    };
  };
  common: {
    loading: string;
    error: string;
    save: string;
    cancel: string;
    submit: string;
    language: string;
  };
};

declare interface IntlMessages extends Messages {} 