import { FlatList } from "react-native";
import { Text } from "native-base";
import ImportImage from "./ImportImage";

function ImportImageList(props) {

    function renderItem(item) {
        <ListItem noIndent
        >
            <ImportImage></ImportImage>
        </ListItem>
    }

    return (
        <FlatList
            data={repos}
            renderItem={this.renderItem}
            keyExtractor={(item, index) => String(index)}
        >
        </FlatList>
    );
}

export default ImportImageList;