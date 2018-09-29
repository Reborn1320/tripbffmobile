import { cloneDeep } from 'lodash';
import { LocationVM } from './Interfaces';
const singleItem: LocationVM =    {
    location: {
        long: 0,
        lat: 0,
        address: "Ho Chi Minh city"
    },
    images: [
        { url: "asd", isSelected: true },
        { url: "asd", isSelected: true },
        { url: "asd", isSelected: true },
        { url: "asd", isSelected: true },
        { url: "asd", isSelected: true },
    ]
};

const ImportImageScreenData = new Array<LocationVM>();
for (let idx = 0; idx < 5; idx++) {
    ImportImageScreenData.push(cloneDeep(singleItem));
}

export default ImportImageScreenData;