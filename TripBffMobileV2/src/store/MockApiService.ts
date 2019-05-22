import { IApiService, ApiServiceArguments } from "./ApisAsAService";
import _ from "lodash";

export var mockLoginApiService: IApiService = {
  get: (url: string, args?: ApiServiceArguments) => login(),
  post: (url: string, args?: ApiServiceArguments) => login(),
  delete: (url: string, args?: ApiServiceArguments) => login(),
  patch: (url: string, args?: ApiServiceArguments) => login(),
}

export var mockTripApiService: IApiService = {
  get: (url: string, args?: ApiServiceArguments) => tripGetMock(url, args),
  post: (url: string, args?: ApiServiceArguments) => new Promise(() => true),
  delete: (url: string, args?: ApiServiceArguments) => tripDeleteMock(args),
  patch: (url: string, args?: ApiServiceArguments) => new Promise(() => true),
}

function login() {
  return new Promise((resolve, reject) => {
    resolve({ data: user });
  });
}

function tripGetMock(url:string, args: ApiServiceArguments) {
  return new Promise((resolve, reject) => {
    console.log("mock get", url);

    var splits = url.split('/');
    if (url === "trips") {
      resolve({ data: trips })
    }

    if (splits.length === 3 && splits[0] === "trips" && splits[2] === "locations") {
      const tripId = splits[1];
      const trip = _.find(trips, { tripId: tripId });
      resolve({data: trip });
    }

    reject(1);
  });
}

function tripDeleteMock(args: ApiServiceArguments) {
  return new Promise((resolve, reject) => {

    // if (args.url === `trips/${tripId}/locations/${locationId}`) {
    //   return resolve(1);
    // }

    return reject("no mocking data");
  });
}

const user = {
  "user": {
    "id": "5c31b164f723ed2ab4b2ea78",
    "email": "bbb"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImJiYiIsImlkIjoiNWMzMWIxNjRmNzIzZWQyYWI0YjJlYTc4IiwiZXhwIjoxNTU1NTU4Mjg1LjE3MSwiaWF0IjoxNTUwMzc0Mjg1fQ.RrsAjLNFFxXRr7OzKmpamgZjFXcIAqM-x8KMo0TMuFs"
}

const trips = [
  {
    "tripId": "af726e00-1187-11e9-bdfe-910d6a0731bf",
    "name": "Sss",
    "fromDate": "2018-12-31T17:00:00.000Z",
    "toDate": "2019-01-06T16:59:59.999Z",
    "locations": [
      {
        "locationId": "5bd9579e-6a3e-412d-ba93-982fa6bea963",
        "location": {
          "lat": 10.789094924926758,
          "long": 106.64060974121094
        },
        "fromTime": "2019-01-02T22:58:36.681Z",
        "toTime": "2019-01-02T22:59:02.700Z",
        "images": [
          {
            "imageId": "8b80d010-09ed-4b82-849f-e7832fd98d97",
            "url": "file:///storage/emulated/0/DCIM/Camera/20190103_055902.jpg"
          },
          {
            "imageId": "73d0c7e5-7915-4e09-9614-162fbddb8305",
            "url": "file:///storage/emulated/0/DCIM/Camera/20190103_055836.jpg"
          }
        ]
      },
      {
        "locationId": "c19f84ec-7b6e-4fbe-813c-4c0f5c0da4f0",
        "location": {
          "lat": 0,
          "long": 0
        },
        "fromTime": "2019-01-04T13:56:15.000Z",
        "toTime": "2019-01-04T13:57:54.000Z",
        "images": [
          {
            "imageId": "c66747c2-c42b-4572-ab8e-10ac825fd4b9",
            "url": "file:///storage/emulated/0/DCIM/Facebook/FB_IMG_1546610274128.jpg"
          },
          {
            "imageId": "44c6de7b-d1d8-4884-977b-e0b159a1192c",
            "url": "file:///storage/emulated/0/DCIM/Facebook/FB_IMG_1546610267118.jpg"
          },
          {
            "imageId": "d5a25e9f-51e1-477e-b204-e8d98df1eee6",
            "url": "file:///storage/emulated/0/DCIM/Facebook/FB_IMG_1546610175910.jpg"
          }
        ]
      },
      {
        "locationId": "2dbbb883-49a9-4994-a751-af05cbe50823",
        "location": {
          "lat": 10.783936500549316,
          "long": 106.665771484375
        },
        "fromTime": "2019-01-05T02:01:10.943Z",
        "toTime": "2019-01-05T02:01:10.943Z",
        "images": [
          {
            "imageId": "99d8bd90-750a-409f-a4be-4850ddc68cbd",
            "url": "file:///storage/emulated/0/DCIM/Camera/20190105_090110.jpg"
          }
        ]
      },
      {
        "locationId": "897b3ff0-2337-4080-a3c9-aa77a40994c3",
        "location": {
          "lat": 10.782386779785156,
          "long": 106.65877532958984,
          "address": "Vịnh Ninh Vân, Nha Trang"
        },
        "fromTime": "2019-01-05T10:17:31.279Z",
        "toTime": "2019-01-05T10:17:34.379Z",
        "images": [
          {
            "imageId": "4cbf985d-821b-46e4-8bc6-b494cc758fb1",
            "url": "file:///storage/emulated/0/DCIM/Camera/20190105_171734.jpg"
          },
          {
            "imageId": "deb131ea-8dae-4864-848b-c999c8bc92c5",
            "url": "file:///storage/emulated/0/DCIM/Camera/20190105_171731.jpg"
          }
        ]
      },
      {
        "locationId": "f9a7559e-91de-45fb-afaa-b152037f05c1",
        "location": {
          "lat": 10.77088737487793,
          "long": 106.67021179199219,
          "address": "Vinpearl Land, Nha Trang"
        },
        "fromTime": "2019-01-05T11:56:15.332Z",
        "toTime": "2019-01-05T11:56:15.332Z",
        "images": [
          {
            "imageId": "1a6cdf45-899d-40b2-a179-b469bafb56d7",
            "url": "file:///storage/emulated/0/DCIM/Camera/20190105_185615.jpg"
          }
        ]
      }
    ],
    "infographics": [
      {
        "infographicId": "fd4fbfb0-1187-11e9-8e2a-c387d360b125",
        "status": "CREATED"
      }
    ]
  },
  {
    "tripId": "4f1e83f0-1677-11e9-86ca-7d0339143615",
    "name": "Tyy",
    "fromDate": "2019-01-07T17:00:00.000Z",
    "toDate": "2019-01-12T16:59:59.999Z",
    "locations": [
      {
        "locationId": "3a98b9de-400e-4f9f-971f-612c80a5f636",
        "location": {
          "lat": 10.789093971252441,
          "long": 106.64029693603516
        },
        "fromTime": "2019-01-08T00:02:01.975Z",
        "toTime": "2019-01-08T00:02:01.975Z",
        "images": [
          {
            "imageId": "b170cf6a-0e04-4cff-ac91-c6aec4f596d7",
            "url": "file:///storage/emulated/0/DCIM/Camera/20190108_070201.jpg"
          }
        ]
      },
      {
        "locationId": "21139a7d-3364-40a0-8342-697ed5f5331f",
        "location": {
          "lat": 10.78900146484375,
          "long": 106.6402359008789
        },
        "fromTime": "2019-01-08T23:53:15.376Z",
        "toTime": "2019-01-08T23:53:15.376Z",
        "images": [
          {
            "imageId": "7da11b8b-fd96-44a0-b622-eb20a36ab77d",
            "url": "file:///storage/emulated/0/DCIM/Camera/20190109_065315.jpg"
          }
        ]
      },
      {
        "locationId": "7e57ef53-de17-4a83-8c98-b59ff8daf8eb",
        "location": {
          "lat": 10.80156421661377,
          "long": 106.64128112792969
        },
        "fromTime": "2019-01-09T10:14:22.392Z",
        "toTime": "2019-01-09T10:15:22.743Z",
        "images": [
          {
            "imageId": "8bc2ae76-50e6-427b-8bec-01638163a6eb",
            "url": "file:///storage/emulated/0/DCIM/Camera/20190109_171522.jpg"
          },
          {
            "imageId": "7d6f2c58-f425-4408-92aa-dc324509d5b8",
            "url": "file:///storage/emulated/0/DCIM/Camera/20190109_171519.jpg"
          },
          {
            "imageId": "4e70e14c-04f4-4779-8e18-8a3d926dcb54",
            "url": "file:///storage/emulated/0/DCIM/Camera/20190109_171517.jpg"
          },
          {
            "imageId": "279c1c0c-4dcf-4bdc-a4af-1a97ad808faf",
            "url": "file:///storage/emulated/0/DCIM/Camera/20190109_171505.jpg"
          },
          {
            "imageId": "9b018c9c-a810-4557-8e77-cc6f36a246cf",
            "url": "file:///storage/emulated/0/DCIM/Camera/20190109_171502.jpg"
          },
          {
            "imageId": "6dd30d2d-4d53-4187-9c1b-0fbd04eb4ed8",
            "url": "file:///storage/emulated/0/DCIM/Camera/20190109_171459.jpg"
          },
          {
            "imageId": "098e7dab-5846-47cf-a048-594ace501a81",
            "url": "file:///storage/emulated/0/DCIM/Camera/20190109_171445.jpg"
          },
          {
            "imageId": "b82b0bf9-bd7e-4ff5-97b3-9cd48a53e61c",
            "url": "file:///storage/emulated/0/DCIM/Camera/20190109_171442.jpg"
          },
          {
            "imageId": "62393d52-357a-4e7f-be92-7a2da5ff4154",
            "url": "file:///storage/emulated/0/DCIM/Camera/20190109_171437.jpg"
          },
          {
            "imageId": "657a78d3-04cb-4d1d-9b59-00144de65d56",
            "url": "file:///storage/emulated/0/DCIM/Camera/20190109_171435.jpg"
          },
          {
            "imageId": "08cd6a66-b06b-4f04-9e8a-9904b27e3979",
            "url": "file:///storage/emulated/0/DCIM/Camera/20190109_171422.jpg"
          }
        ]
      },
      {
        "locationId": "c65a3e6c-2579-49fa-9573-dc3c7384e622",
        "location": {
          "lat": 10.789003372192383,
          "long": 106.64024353027344
        },
        "fromTime": "2019-01-10T00:13:26.991Z",
        "toTime": "2019-01-10T00:13:26.991Z",
        "images": [
          {
            "imageId": "5c7c1847-3d1d-49ac-808e-5709a6ad9738",
            "url": "file:///storage/emulated/0/DCIM/Camera/20190110_071326.jpg"
          }
        ]
      },
      {
        "locationId": "70662978-1af1-459e-88a6-937919061900",
        "location": {
          "lat": 10.788999557495117,
          "long": 106.64025115966797
        },
        "fromTime": "2019-01-10T13:20:45.697Z",
        "toTime": "2019-01-10T13:20:45.697Z",
        "images": [
          {
            "imageId": "ec087558-b8d2-422e-9438-272964d72d27",
            "url": "file:///storage/emulated/0/DCIM/Camera/20190110_202045.jpg"
          }
        ]
      },
      {
        "locationId": "bb9d1ccf-1c68-48a6-8b19-51d7224a7561",
        "location": {
          "lat": 10.789018630981445,
          "long": 106.64026641845703
        },
        "fromTime": "2019-01-10T23:20:32.010Z",
        "toTime": "2019-01-10T23:56:36.071Z",
        "images": [
          {
            "imageId": "2594083e-f12c-464f-9ab6-c4ce616ca490",
            "url": "file:///storage/emulated/0/DCIM/Camera/20190111_065636.jpg"
          },
          {
            "imageId": "4da61e16-457b-4ebe-a182-6274132bf4e0",
            "url": "file:///storage/emulated/0/DCIM/Camera/20190111_062314.jpg"
          },
          {
            "imageId": "98b17c7f-71e5-4c49-9300-59cc37267377",
            "url": "file:///storage/emulated/0/DCIM/Camera/20190111_062312.jpg"
          },
          {
            "imageId": "d1649a89-8ba5-4480-b35b-cf97261c65fc",
            "url": "file:///storage/emulated/0/DCIM/Camera/20190111_062254.jpg"
          },
          {
            "imageId": "9e6f3fde-e6ac-49be-857a-a34a15cef1d4",
            "url": "file:///storage/emulated/0/DCIM/Camera/20190111_062032.jpg"
          }
        ]
      },
      {
        "locationId": "dcaeec22-6f3e-4860-bfe9-1bb2af4bbb69",
        "location": {
          "lat": 10.789791107177734,
          "long": 106.63973999023438,
          "address": "Vịnh Ninh Vân, Nha Trang"
        },
        "fromTime": "2019-01-11T13:47:02.844Z",
        "toTime": "2019-01-11T13:47:04.331Z",
        "images": [
          {
            "imageId": "19d72426-04a6-4be4-9cd0-8209d7210153",
            "url": "file:///storage/emulated/0/DCIM/Camera/20190111_204704.jpg"
          },
          {
            "imageId": "f7008999-55bd-454a-9779-2a3a5544e1d4",
            "url": "file:///storage/emulated/0/DCIM/Camera/20190111_204702.jpg"
          }
        ]
      },
      {
        "locationId": "808a6716-846b-4b08-8720-02464c0587f8",
        "location": {
          "lat": 10.80135440826416,
          "long": 106.68984985351562,
          "address": "Vinpearl Land, Nha Trang"
        },
        "fromTime": "2019-01-12T05:38:02.390Z",
        "toTime": "2019-01-12T05:38:02.390Z",
        "images": [
          {
            "imageId": "4b35dcbc-a7a2-4807-b8c1-92d8f920a68c",
            "url": "file:///storage/emulated/0/DCIM/Camera/20190112_123802.jpg"
          }
        ]
      }
    ],
    "infographics": [
      {
        "infographicId": "7329a860-1677-11e9-86ca-7d0339143615",
        "status": "CREATED"
      }
    ]
  }
]