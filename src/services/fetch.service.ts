import { error } from "../utils/errors";

const fetching = require("node-fetch");

export const fetchData = async (url: string, options: any = {}) => {
  try {
    const response = await fetching(url, options);
    return response.json();
  } catch (e) {
    if (e instanceof Error) {
      throw error(e.message);
    }
  }
};
