import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import Fuse from "fuse.js";
import { useState } from "react";
import { ActivityIndicator } from "react-native";
import {
	getInstitutionInfo,
	getInstitutionList,
	type InstitutionList,
} from "../../api/institutions";
import { Input } from "../../components/elements/Input";
import { List, type ListItemProps } from "../../components/elements/List";
import { HeaderlessContainer } from "../../components/layout/HeaderlessContainer";
import type { StackParamList } from "../../components/layout/NavigationWrapper";
import { useStoreActions, useStoreState } from "../../store/store";
import { useDebounce } from "../../util/useDebounce";
import { buildAuthUrl } from "./AuthWebView";

const DEMO_TITLE = "__DEMO__DO_NOT_USE__";

const fuse = new Fuse<ListItemProps>([], { keys: ["title", "subtitle"] });

const apiInstitutionListToDisplay = (list: InstitutionList): Array<ListItemProps> => {
	return list.map((institution, i) => ({
		key: institution.name + i,
		title: institution.name,
		label: institution.links.lms || "Link not found",
	}));
};

export function InstitutionSelection(
	{ navigation }: NativeStackScreenProps<StackParamList, "InstitutionSelection">,
) {
	const [filter, setFilter] = useState("");
	const [loadingWebView, setLoadingWebView] = useState(false);
	const [institutionList, setInstitutionList] = useState<Array<ListItemProps>>([]);

	const config = useStoreState((state) => state.config);
	const configActions = useStoreActions((actions) => actions.config);

	useDebounce(
		() => {
			getInstitutionList(filter).then((data) => {
				if (filter.startsWith("__")) {
					data.push({ name: DEMO_TITLE, links: { lms: "For App Store review only" } });
				}
				const listToDisplay = apiInstitutionListToDisplay(data);
				fuse.setCollection(listToDisplay);
				setInstitutionList(fuse.search(filter).map((result) => result.item));
			});
		},
		[filter],
		150,
	);

	if (loadingWebView) {
		return (
			<HeaderlessContainer
				style={{ justifyContent: "center", alignItems: "center", height: "100%" }}
			>
				<ActivityIndicator />
			</HeaderlessContainer>
		);
	}
	return (
		<HeaderlessContainer>
			<List
				ListHeaderComponent={
					<Input
						value={filter}
						onChangeText={setFilter}
						placeholder="Who provides your learning?"
						autoCapitalize="none"
						clearButtonMode="always"
						containerStyle={{ marginBottom: 12 }}
					/>
				}
				data={institutionList}
				onItemPress={(item) => {
					if (item.title === DEMO_TITLE) {
						configActions.__SET_DEMO__(true);
						navigation.navigate("Home");
					}
					if (!item.label) return;
					setLoadingWebView(true);
					getInstitutionInfo(`${item.label}`).then((info) => {
						if (!info?.tenantId) return;
						configActions.setTenantId(info.tenantId);
						navigation.navigate("AuthWebView", {
							source: buildAuthUrl({
								tenantId: info.tenantId,
								clientId: config.clientId,
							}),
						});
					});
				}}
			/>
		</HeaderlessContainer>
	);
}
