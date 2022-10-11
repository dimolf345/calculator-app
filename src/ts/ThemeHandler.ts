type Theme = typeof ThemeHandler.prototype.availableThemes[number];

class ThemeHandler {
  //1. retrieves the preferred setting from local storage or from user agent prefers color scheme
  //2. set the theme accordingly
  //3. save selected theme to localStorage
  readonly availableThemes = ["dark", "light", "contrast"] as const;

  private currentTheme;
  private currentDocument: HTMLHtmlElement;

  constructor(document: HTMLHtmlElement) {
    this.currentTheme =
      this.getSavedThemeSetting || this.getPreferredColorScheme;
    this.currentDocument = document;
  }

  set theme(newTheme: Theme) {
    this.currentTheme = newTheme;
    this.currentDocument.dataset.theme = newTheme;
    this.saveThemeSetting(newTheme);
  }

  get theme(): Theme {
    return this.currentTheme;
  }

  //Retrieves the user agent setting for preferred color scheme
  private getPreferredColorScheme(): "dark" | "light" {
    if (
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme:dark)").matches
    )
      return "dark";
    return "light";
  }

  private saveThemeSetting(newTheme: Theme) {
    window.localStorage.setItem("theme", newTheme);
  }

  private getSavedThemeSetting(): Theme | null {
    const savedTheme = window.localStorage.getItem("theme") as Theme;
    return savedTheme;
  }
}

export default ThemeHandler;
