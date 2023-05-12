import axios from "axios";

export default (error: any) => {
  if (error === null) throw new Error("Unrecoverable error!! Error is null!");
  if (axios.isAxiosError(error)) {
    //here we have a type guard check, error inside this if will be treated as AxiosError
    const response = error?.response;
    const request = error?.request;

    if (error.code === "ERR_NETWORK") {
      console.log("connection problems..");
    } else if (error.code === "ERR_CANCELED") {
      console.log("connection canceled..");
    }
    if (response) {
      //The request was made and the server responded with a status code that falls out of the range of 2xx the http status code mentioned above
      const statusCode = response?.status;
      if (statusCode === 404) {
        console.log(
          "The requested resource does not exist or has been deleted"
        );
      } else if (statusCode === 401) {
        console.log("Please login to access this resource");
      }
    } else if (request) {
      //The request was made but no response was received, `error.request` is an instance of XMLHttpRequest in the browser and an instance of http.ClientRequest in Node.js
    }
    throw error;
  }

  //Something happened in setting up the request and triggered an Error
  console.log(error.message);
};
