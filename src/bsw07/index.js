import * as axios from "axios";

const post = async (url, method, param) => {
  try {
    let res = await axios({
      method: 'post',
      url: url,
      data: {
        jsonrpc: "2.0",
        method: method,
        params: param,
        id: Math.floor(Math.random() * Math.floor(65535))
      }
    });
    console.log(res);
    if (res.data.error) {
      throw new Error(res.data.error.message);
    }
    return res.data.result;
  } catch (e) {
    console.log(e);
    return Promise.reject(e);
  }
};

export const setup = async (url) => post(url, "bsw07_setup", []);
export const encrypt = async (url, file, policy, publicKey) => post(url, "bsw07_encrypt", [file, policy, publicKey]);
export const keygen = async (url, attributes, masterKey) => post(url, "bsw07_keygen", [attributes, masterKey]);
export const delegate = async (url, attributes, privateKey) => post(url, "bsw07_delegate", [attributes, privateKey]);
export const decrypt = async (url, ciphertext, privateKey) => post(url, "bsw07_decrypt", [ciphertext, privateKey]);
