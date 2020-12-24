import axios from "axios";

export default axios.create({
  baseURL: "https://xpva3oo1qh.execute-api.us-east-1.amazonaws.com/v1",
  headers: {
    "Content-Type": "application/json"
  }
});
