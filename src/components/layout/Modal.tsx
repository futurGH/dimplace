import { useNavigation } from "@react-navigation/native";
import { CardStyleInterpolators, type StackNavigationOptions } from "@react-navigation/stack";
import type { ReactNode } from "react";
import { Pressable, StyleSheet, type ViewStyle } from "react-native";
import type { SvgProps } from "react-native-svg";
import { ChevronDownIcon } from "../../assets/icons/chevron-down";
import { useColorTheme } from "../../style/ColorThemeProvider";
import type { ColorTheme } from "../../style/colorThemes";
import { Container } from "./Container";

export type ModalProps = { back?: string; props?: unknown; children: ReactNode | Array<ReactNode> };
export function Modal({ back, props, children }: ModalProps) {
	const navigation = useNavigation();
	const { Colors } = useColorTheme();
	const styles = createStyles(Colors);
	return (
		<Container style={styles.container}>
			<CloseModal
				onPress={() => {
					if (back) navigation.navigate(...[back, props] as never);
					else navigation.goBack();
				}}
				styles={styles}
			/>
			{children}
		</Container>
	);
}

function CloseModal(
	{ onPress, styles }: { onPress: () => void; styles: { closeContainer: ViewStyle; closeIcon: SvgProps } },
) {
	return (
		<Pressable style={styles.closeContainer} onPress={onPress}>
			<ChevronDownIcon {...styles.closeIcon} />
		</Pressable>
	);
}

const createStyles = (Colors: ColorTheme) =>
	StyleSheet.create({
		container: { borderTopLeftRadius: 24, borderTopRightRadius: 24, overflow: "hidden" },
		closeContainer: { width: "100%", height: 36, justifyContent: "center", alignItems: "center" },
		closeIcon: { width: 32, height: 32, fill: Colors.TextPrimary },
	});

export const modalOptions: StackNavigationOptions = {
	gestureEnabled: true,
	presentation: "transparentModal",
	headerMode: "float",
	cardStyleInterpolator: CardStyleInterpolators.forModalPresentationIOS,
};
