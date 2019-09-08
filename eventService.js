import axios from "axios";
import * as serviceHelpers from "./serviceHelpers";

const url = `${serviceHelpers.API_HOST_PREFIX}/api/events`;

let insert = payload => {
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

let update = payload => {
  const config = {
    method: "PUT",
    url: `${url}/${payload.id}`,
    data: payload,
    withCredentials: true,
    crossdomain: true,
    headers: { "Content-Type": "application/json" }
  };

  return axios(config)
    .then(serviceHelpers.onGlobalSuccess)
    .catch(serviceHelpers.onGlobalError);
};

let get = (pageIndex, pageSize) => {
  const config = {
    method: "GET",
    url: `${url}?pageIndex=${pageIndex}&pageSize=${pageSize}`,
    withCredentials: true,
    crossdomain: true
  };

  return axios(config)
    .then(serviceHelpers.onGlobalSuccess)
    .catch(serviceHelpers.onGlobalError);
};

let getById = id => {
  const config = {
    method: "GET",
    url: `${url}/${id}`,
    withCredentials: true,
    crossdomain: true
  };

  return axios(config)
    .then(serviceHelpers.onGlobalSuccess)
    .catch(serviceHelpers.onGlobalError);
};

let getByCurrent = (pageIndex, pageSize) => {
  const config = {
    method: "GET",
    url: `${url}?pageIndex=${pageIndex}&pageSize${pageSize}`,
    withCredentials: true,
    crossdomain: true
  };

  return axios(config)
    .then(serviceHelpers.onGlobalSuccess)
    .catch(serviceHelpers.onGlobalError);
};

let deleteById = id => {
  const config = {
    method: "DELETE",
    url: `${url}/${id}`,
    withCredentials: true,
    crossdomain: true,
    headers: { "Content-Type": "application/json" }
  };

  return axios(config)
    .then(serviceHelpers.onGlobalSuccess)
    .catch(serviceHelpers.onGlobalError);
};

let getTypes = () => {
  const config = {
    method: "GET",
    url: `${url}/type`,
    withCredentials: true,
    crossdomain: true
  };

  return axios(config)
    .then(serviceHelpers.onGlobalSuccess)
    .catch(serviceHelpers.onGlobalError);
};

let getStatus = () => {
  const config = {
    method: "GET",
    url: `${url}/status`,
    withCredentials: true,
    crossdomain: true
  };

  return axios(config)
    .then(serviceHelpers.onGlobalSuccess)
    .catch(serviceHelpers.onGlobalError);
};

export {
  insert,
  update,
  get,
  getById,
  getByCurrent,
  deleteById,
  getTypes,
  getStatus
};
