import { IApiService, ApiServiceArguments } from "./ApisAsAService";

export var loginApiService: IApiService = {
  get: (args: ApiServiceArguments) => new Promise(() => true),
  post: (args: ApiServiceArguments) => new Promise(() => true),
  delete: (args: ApiServiceArguments) => new Promise(() => true),
}

export var tripApiService: IApiService = {
  get: (args: ApiServiceArguments) => tripGetMock(args),
  post: (args: ApiServiceArguments) => new Promise(() => true),
  delete: (args: ApiServiceArguments) => tripDeleteMock(args),
}

function tripGetMock(args: ApiServiceArguments) {
  return new Promise((resolve, reject) => {

    if (args.url === "") {
      resolve()
    }
  });
}

function tripDeleteMock(args: ApiServiceArguments) {
  return new Promise((resolve, reject) => {

    if (args.url === `trips/${tripId}/locations/${locationId}`) {
      return resolve(1);
    }
    
    return reject("no mocking data");
  });
}
