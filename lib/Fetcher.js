import useSWR from "swr";
import axios from "axios";

const Fetcher = (url) => axios.get(url).then((res) => res.data);

export const useGetClients = () => {
  const { data, error } = useSWR(`${process.env.NEXT_PUBLIC_API_URL}/clients`, Fetcher);
  return {
    data,
    isLoading: !error && !data,
    isError: error,
  };
};

export const useGetClient = (id) => {
  const { data, error } = useSWR(`${process.env.NEXT_PUBLIC_API_URL}/clients/${id}`, Fetcher);
  return {
    data,
    isLoading: !error && !data,
    isError: error,
  };
};
