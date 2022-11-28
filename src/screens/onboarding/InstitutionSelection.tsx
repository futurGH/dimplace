import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import Fuse from "fuse.js";
import { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
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
import { buildAuthUrl } from "./AuthWebView";

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

	useEffect(() => {
		getInstitutionList(filter).then((data) => {
			const listToDisplay = apiInstitutionListToDisplay(data);
			fuse.setCollection(listToDisplay);
			setInstitutionList(fuse.search(filter).map((result) => result.item));
		});
	}, [filter]);
	return (
		<HeaderlessContainer>
			{loadingWebView
				? (
					<View style={styles.spinnerContainer}>
						<ActivityIndicator />
					</View>
				)
				: (
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
							if (!item.label) return;
							setLoadingWebView(true);
							getInstitutionInfo(item.label).then((info) => {
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
				)}
		</HeaderlessContainer>
	);
}

const styles = StyleSheet.create({
	spinnerContainer: {
		flex: 1,
		width: "100%",
		height: "100%",
		justifyContent: "center",
		alignItems: "center",
	},
});
