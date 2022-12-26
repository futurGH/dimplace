import { Text } from "react-native";
import type { MixedStyleDeclaration, RenderHTMLProps } from "react-native-render-html";
import RenderHtml, {
	CustomRendererProps,
	defaultSystemFonts,
	TBlock,
	TNodeChildrenRenderer,
} from "react-native-render-html";
import { Colors, Typography } from "../../styles";

interface HtmlProps extends Partial<RenderHTMLProps> {
	width: number;
	body: string;
	bodyStyle?: MixedStyleDeclaration;
	numberOfLines?: number;
}
const defaultBodyStyle: MixedStyleDeclaration = { ...Typography.Body, color: Colors.TextPrimary };
export function Html({ width, body, bodyStyle = {}, numberOfLines = 4, ...props }: HtmlProps) {
	bodyStyle = { ...defaultBodyStyle, ...bodyStyle };
	return width
		? (
			<RenderHtml
				source={{ html: body.startsWith("<") ? body : `<p>${body.trim()}</p>` }}
				contentWidth={width - 32}
				tagsStyles={{
					p: { marginVertical: 0, ...bodyStyle },
					a: { color: Colors.Active, textDecorationColor: Colors.Active },
					li: bodyStyle,
					ul: bodyStyle,
					ol: bodyStyle,
					span: bodyStyle,
				}}
				systemFonts={["WorkRegular", "WorkMedium", ...defaultSystemFonts]}
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
				}}
				enableExperimentalGhostLinesPrevention={true}
				enableExperimentalBRCollapsing={true}
				enableExperimentalMarginCollapsing={true}
				{...props}
			/>
		)
		: null;
}
