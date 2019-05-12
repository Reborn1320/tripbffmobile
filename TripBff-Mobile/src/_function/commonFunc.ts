
export function getAddressFromLocation (locationJson) {
    let address = "";

    if (locationJson.address) {
        let houseNumber = locationJson.address.house_number,
            road = locationJson.address.road,
            suburb = locationJson.address.suburb,
            county = locationJson.address.county,
            city = locationJson.address.city,
            country = locationJson.address.country;

        if (houseNumber) address = houseNumber
        if (road) address = address ? address + ', ' + road : road;
        if (suburb) address = address ? address + ', ' + suburb : suburb;
        if (county) address = address ? address + ', ' + county : county;
        if (city)  address = address ? address + ', ' + city : city;
        if (country) address = address ? address + ', ' + country : country;         
    }
    else
        address = locationJson.display_name;

    return address;
}