import { useState } from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import RenderHtml, {
	type CustomRendererProps,
	defaultSystemFonts,
	type TBlock,
	type TDefaultRenderer,
	TNodeChildrenRenderer,
} from "react-native-render-html";
import { LinkIcon } from "../../../assets/icons/link";
import { UserProfileIcon } from "../../../assets/icons/user-profile";
import { Colors, Typography } from "../../../styles";
import { formatDate } from "../../../util/formatDate";
import { Card } from "../../elements/Card";

export interface FeedArticleCardProps {
	message: string;
}
export interface FeedAssignmentCardProps {
	name: string;
	instructions: string;
	dueDate: string;
}
export type AnnouncementCardProps = (FeedArticleCardProps | FeedAssignmentCardProps) & {
	id: string;
	author: { displayName: string; imageUrl: string };
	publishedDate: string;
	attachmentLinks: Array<{ id: string; type: string; name: string; href: string }>;
	commentsCount: string;
	onPress?: () => void;
};
export function AnnouncementCard(props: AnnouncementCardProps) {
	const { id, author, publishedDate: _publishedDate, attachmentLinks, commentsCount } = props;

	const body = "message" in props ? props.message : props.instructions;

	const publishedDate = new Date(_publishedDate);
	const formattedDate = formatDate(isNaN(publishedDate.getTime()) ? new Date() : publishedDate);

	const authorIcon = author.imageUrl.includes("Framework.UserProfileBadge")
		? <UserProfileIcon style={styles.authorIcon} fill={Colors.Inactive} />
		: (
			<Image
				style={[styles.authorIcon, styles.authorImageIcon]}
				source={{ uri: author.imageUrl }}
			/>
		);

	const attachments = attachmentLinks?.length
		? (
			<View style={styles.attachments}>
				<LinkIcon style={styles.attachmentsIcon} />
				<Text style={styles.attachmentsText}>
					{attachmentLinks.length} attachment{attachmentLinks.length > 1 ? "s" : ""}
				</Text>
			</View>
		)
		: null;

	const [cardWidth, setCardWidth] = useState(0);
	const [footerColor, setFooterColor] = useState<string>(Colors.Card);
	return (
		<Card
			key={id}
			content={
				<View
					style={styles.content}
					onLayout={(event) => setCardWidth(event.nativeEvent.layout.width)}
				>
					<View style={styles.author}>
						{authorIcon}
						<View style={styles.authorText}>
							<Text style={styles.authorName}>{author.displayName}</Text>
							<Text style={styles.authorDate}>{formattedDate}</Text>
						</View>
					</View>
					<View style={styles.body}>
						{"name" in props
							? <Text style={styles.bodyTitle}>{props.name}</Text>
							: null}
						{cardWidth
							? (
								<RenderHtml
									source={{
										html: body.startsWith("<") ? body : `<p>${body}</p>`,
									}}
									contentWidth={cardWidth - 32}
									tagsStyles={{
										p: { marginVertical: 0, ...styles.bodyText },
										a: {
											color: Colors.Active,
											textDecorationColor: Colors.Active,
										},
										li: styles.bodyText,
										ul: styles.bodyText,
										ol: styles.bodyText,
										span: styles.bodyText,
									}}
									systemFonts={[
										"WorkRegular",
										"WorkMedium",
										...defaultSystemFonts,
									]}
									renderers={{
										// https://github.com/meliorence/react-native-render-html/issues/94
										p: (
											{ TDefaultRenderer, ...props }: CustomRendererProps<
												TBlock
											>,
										) => {
											const tchildrenAreText = props.tnode.children.every((
												t,
											) => t.type === "text" || t.type === "phrasing");
											const children = (
												<TNodeChildrenRenderer tnode={props.tnode} />
											);
											return (
												<TDefaultRenderer {...props}>
													{tchildrenAreText
														? <Text numberOfLines={4}>{children}</Text>
														: children}
												</TDefaultRenderer>
											);
										},
									}}
									enableExperimentalGhostLinesPrevention={true}
									enableExperimentalBRCollapsing={true}
									enableExperimentalMarginCollapsing={true}
								/>
							)
							: null}
						{"dueDate" in props
							? <Text style={styles.bodyFootnote}>{props.dueDate}</Text>
							: null}
						{attachments}
					</View>
				</View>
			}
			footer={
				<Pressable
					style={[styles.footer, { backgroundColor: footerColor }]}
					onPressIn={() => setFooterColor(Colors.Button)}
					onPressOut={() => setFooterColor(Colors.Card)}
					onPress={props.onPress}
				>
					<Text style={styles.footerText}>
						{commentsCount ? `${commentsCount} comments` : "Add a comment"}
					</Text>
				</Pressable>
			}
			onPress={props.onPress}
		/>
	);
}

const styles = StyleSheet.create({
	content: {
		width: "100%",
		flex: 1,
		justifyContent: "center",
		paddingHorizontal: 16,
		paddingVertical: 24,
	},
	author: {
		width: "100%",
		flex: 1,
		flexDirection: "row",
		justifyContent: "flex-start",
		alignItems: "center",
	},
	authorIcon: { width: 32, height: 32 },
	authorImageIcon: { borderRadius: 32, overflow: "hidden" },
	authorText: { flex: 1, marginLeft: 12 },
	authorName: { ...Typography.Callout, color: Colors.TextPrimary },
	authorDate: { ...Typography.Footnote, color: Colors.TextLabel },
	body: { width: "100%", marginTop: 16 },
	bodyTitle: { ...Typography.ListHeading, color: Colors.TextPrimary, marginBottom: 8 },
	bodyText: { ...Typography.Body, color: Colors.TextPrimary },
	bodyFootnote: { ...Typography.Footnote, color: Colors.TextLabel },
	attachments: { width: "100%", flex: 1, flexDirection: "row", marginTop: 16 },
	attachmentsIcon: { width: 18, height: 18, fill: Colors.TextSecondary },
	attachmentsText: { ...Typography.Label, color: Colors.TextSecondary, marginLeft: 2 },
	footer: {
		width: "100%",
		borderTopWidth: 1,
		borderTopColor: Colors.Border,
		paddingHorizontal: 16,
		paddingVertical: 12,
	},
	footerText: { ...Typography.Label, color: Colors.TextLabel },
});
