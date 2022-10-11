import ThemeHandler from "./ThemeHandler";

const htmlDocument = document.querySelector("html") as HTMLHtmlElement;

const appTheme = new ThemeHandler(htmlDocument);

appTheme.theme = "light";
