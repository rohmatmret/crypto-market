import {
  Badge,
  Button,
  Flex,
  Image,
  Spinner,
  Stack,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { QueryClient, QueryClientProvider, useQuery } from "react-query";
import { dehydrate } from "react-query/hydration";

type Price = {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  price_change_percentage_24h: number;
  total_volume: number;
  market_cap: number;
};


const getMarket = async (page = 1) => {
  const URL = `https://api.coingecko.com/api/v3/coins/markets?vs_currency=idr&per_page=10&page=${page}`;
  const response = await fetch(URL);
  if (!response.ok) {
    throw new Error("Fetching Error");
  }
  return await response.json();
};

const formatNumber = (num: number) => {
  let formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'IDR',
  });

  return formatter.format(num)
};

const Percentage = ({ percent }: { percent: number }) => {
  const formatPercent = Intl.NumberFormat("en-US", {
    style: "percent",
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  }).format(percent / 100);

  let color = "black";
  if (percent > 0) {
    color = "green.500";
  } else if (percent < 0) {
    color = "red.500";
  }

  return <Text color={color}>{formatPercent}</Text>;
};


// SSR with Hydrate
export async function getStaticProps() {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery(["market", 1], () => getMarket());

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  };
}


function Card(){
  const [page, setPage] = useState(1);
  const nextPage = () => {
    setPage((prev) => prev + 1);
  };
  const previousPage = () => {
    setPage((prev) => prev - 1);
  };
  const { data, isError, isLoading, isFetching, isSuccess } = useQuery(
    ["market", page],
    () => getMarket(page),
    {
      staleTime: 3000, // ms
      refetchInterval: 3000,
      // initialData: initialPrice,
    }
  );
  return (
    <>
      {isFetching && (
        <Spinner color="blue.500" position="fixed" top={10} right={10} />
      )}
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>Instrument</Th>
            <Th>Last Price</Th>
            <Th>24h % Change</Th>
            <Th isNumeric>Total Volume</Th>
            <Th isNumeric>Market Cap</Th>
          </Tr>
        </Thead>
        <Tbody>
          {isLoading && <Text>Loading...</Text>}
          {isError && <Text>There was an error processing your request</Text>}
          {isSuccess &&
            data?.map((price: Price) => (
              <Tr>
                <Td>
                  <Flex alignItems="center">
                    <Image
                      key={price.id}
                      src={price.image}
                      boxSize="24px"
                      ignoreFallback={true}
                    />

                    <Text pl={2} fontWeight="bold" textTransform="capitalize">
                      {price.id}
                    </Text>
                    <Badge ml={3}>{price.symbol}</Badge>
                  </Flex>
                </Td>
                <Td>{formatNumber(price.current_price)}</Td>
                <Td>
                  <Percentage percent={price.price_change_percentage_24h} />
                </Td>
                <Td isNumeric>{formatNumber(price.total_volume)}</Td>
                <Td isNumeric>{formatNumber(price.market_cap)}</Td>
              </Tr>
            ))}
        </Tbody>
      </Table>
      <Stack padding={5} spacing={4} direction="row" align="center">
        <Button
          colorScheme="blue"
          variant="outline"
          size="lg"
          onClick={previousPage}
          disabled={page === 1 ? true : false}
        >
          Previous
        </Button>
        <Text>{page}</Text>
        <Button
          colorScheme="blue"
          variant="outline"
          size="lg"
          onClick={nextPage}
        >
          Next
        </Button>
      </Stack>
    </>
  );
}

const queryClient = new QueryClient()
const Home = ()=> {
  return (
    <QueryClientProvider client={queryClient}>
      <Card />
    </QueryClientProvider>
  )
}

export default Home;