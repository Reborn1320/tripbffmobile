import { cloneDeep } from 'lodash';
import { StoreData} from './Interfaces';
const singleItem: StoreData.LocationVM = {
    location: {
        long: 0,
        lat: 0,
        address: "Ho Chi Minh city"
    },
    images: [
        { url: "asd" },
        { url: "asd" },
        { url: "asd" },
        { url: "asd" },
        { url: "asd" },
    ]
};

const ImportImageScreenData = new Array<StoreData.LocationVM>();
for (let idx = 0; idx < 5; idx++) {
    ImportImageScreenData.push(cloneDeep(singleItem));
}

export default ImportImageScreenData;