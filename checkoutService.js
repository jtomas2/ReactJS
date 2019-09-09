import axios from "axios";
import * as serviceHelpers from "./serviceHelpers";

const url = `${serviceHelpers.API_HOST_PREFIX}/api/checkoutorder`;

let create = payload => {
  const config = {
    method: "POST",
    url: `${url}`,
    data: payload,
    withCredentials: true,
    crossdomain: true,
    headers: { "Content-Type": "application/json" }
  };

  return axios(config)
    .then(serviceHelpers.onGlobalSuccess)
    .catch(serviceHelpers.onGlobalError);
};

let cancel = () => {
  const config = {
    method: "Delete",
    url: `${url}/void`,
    withCredentials: true,
    crossdomain: true,
    headers: { "Content-Type": "application/json" }
  };

  return axios(config)
    .then(serviceHelpers.onGlobalSuccess)
    .catch(serviceHelpers.onGlobalError);
}

export { create, cancel };
