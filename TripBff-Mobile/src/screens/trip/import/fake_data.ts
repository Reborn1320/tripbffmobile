const singleItem =    {
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
        { url: "asd" },
    ]
};

const ImportImageScreenData = [];
for (let idx = 0; idx < 10; idx++) {
    ImportImageScreenData.push(singleItem);
}

export default ImportImageScreenData;