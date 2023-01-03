import { createContext, useContext } from "react";
import { useStoreActions, useStoreState } from "../store/store";
import { ColorTheme, ColorThemeName, ColorThemes } from "./colorThemes";

const ThemeContext = createContext<
	{
		Colors: ColorTheme;
		colorThemeName: ColorThemeName;
		setColors: (themeName: ColorThemeName) => void;
	}
>({ Colors: ColorThemes.Sapphire, colorThemeName: "Sapphire", setColors: () => {} });
export function ColorThemeProvider({ children }: { children: React.ReactNode }) {
	const colorTheme = useStoreState((state) => state.settings.colorTheme);
	const settingsActions = useStoreActions((actions) => actions.settings);
	const Colors = ColorThemes[colorTheme.value];
	return (
		<ThemeContext.Provider
			value={{
				Colors,
				colorThemeName: colorTheme.value,
				setColors: (themeName) => {
					settingsActions.set(["colorTheme", themeName]);
				},
			}}
		>
			<ThemeContext.Consumer>{() => children}</ThemeContext.Consumer>
		</ThemeContext.Provider>
	);
}

export function useColorTheme() {
	return useContext(ThemeContext);
}
