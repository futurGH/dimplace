import { Text } from "react-native";
import type { MixedStyleDeclaration, RenderHTMLProps } from "react-native-render-html";
import RenderHtml, {
	CustomRendererProps,
	defaultSystemFonts,
	TBlock,
	TNodeChildrenRenderer,
} from "react-native-render-html";
import { useColorTheme } from "../../style/ColorThemeProvider";
import type { ColorTheme } from "../../style/colorThemes";
import { Typography } from "../../style/typography";

interface HtmlProps extends Partial<RenderHTMLProps> {
	width: number;
	body: string;
	bodyStyle?: MixedStyleDeclaration;
	numberOfLines?: number;
}
export function Html({ width, body, bodyStyle = {}, numberOfLines, ...props }: HtmlProps) {
	const { Colors } = useColorTheme();
	const defaultBodyStyle = createStyles(Colors);
	bodyStyle = { ...defaultBodyStyle, ...bodyStyle };
	return width
		? (
			<RenderHtml
				source={{ html: body.startsWith("<") ? body : `<p>${body.trim()}</p>` }}
				contentWidth={width - 32}
				baseStyle={bodyStyle}
				systemFonts={["WorkRegular", "WorkMedium", ...defaultSystemFonts]}
				enableExperimentalGhostLinesPrevention={true}
				enableExperimentalBRCollapsing={true}
				enableExperimentalMarginCollapsing={true}
				enableCSSInlineProcessing={false}
				{...props}
				tagsStyles={{
					p: { marginVertical: 0, ...bodyStyle },
					a: { color: Colors.Active, textDecorationColor: Colors.Active },
					li: bodyStyle,
					ul: bodyStyle,
					ol: bodyStyle,
					span: bodyStyle,
					...props.tagsStyles,
				}}
				renderers={{
					// https://github.com/meliorence/react-native-render-html/issues/94
					p: ({ TDefaultRenderer, ...props }: CustomRendererProps<TBlock>) => {
						const tchildrenAreText = props.tnode.children.every((t) =>
							t.type === "text" || t.type === "phrasing"
						);
						const children = <TNodeChildrenRenderer tnode={props.tnode} />;
						return (
							<TDefaultRenderer {...props}>
								{tchildrenAreText
									? <Text numberOfLines={numberOfLines}>{children}</Text>
									: children}
							</TDefaultRenderer>
						);
					},
					...props.renderers,
				}}
			/>
		)
		: null;
}

const createStyles = (Colors: ColorTheme) => ({ ...Typography.Body, color: Colors.TextPrimary });

export function stripTags(html: string) {
	return html.replace(/<br\s*\/?>/g, "\n").replace(
		/<([\w\-/]+)( +[\w\-]+(=(('[^']*')|("[^"]*")))?)* *>/g,
		"",
	);
}
