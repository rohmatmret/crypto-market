import {
  Badge,
  Button,
  Flex,
  Image,
  Spinner,
  Stack,
  Box,
  Text,
  useBreakpointValue,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { QueryClient, QueryClientProvider, useQuery } from "react-query";

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
  const formatter = new Intl.NumberFormat("en-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0, // Remove the fractional part
    maximumFractionDigits: 0, // Remove the fractional part
  });

  return formatter.format(num);
};

const Percentage = ({ percent }: { percent: number }) => {
  const formatPercent = Intl.NumberFormat("en-ID", {
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

function Card() {
  const [page, setPage] = useState(1);
  const nextPage = () => {
    setPage((prev) => prev + 1);
  };
  const previousPage = () => {
    setPage((prev) => prev - 1);
  };
  const { data, isError, isLoading, isFetching } = useQuery(
    ["market", page],
    () => getMarket(page),
    {
      staleTime: 5000,
      refetchInterval: 20000,
    }
  );

  const isMobile = useBreakpointValue({ base: true, md: false });

  return (
    <Box>
      {isFetching && (
        <Spinner color="blue.500" position="fixed" top={10} right={10} />
      )}
      {isLoading && <Text>Loading...</Text>}
      {isError && <Text>There was an error processing your request</Text>}
      {data &&
        data.map((price: Price) => (
          <Box
            key={price.id}
            p={4}
            mb={4}
            borderWidth={1}
            borderRadius="md"
            boxShadow="sm"
            overflow="hidden"
          >
            <Flex align="center" mb={2}>
              <Image
                src={price.image}
                boxSize="24px"
                alt={price.name}
                mr={2}
              />
              <Text fontWeight="bold" fontSize="lg" textTransform="capitalize">
                {price.name}
              </Text>
              <Badge ml={2}>{price.symbol.toUpperCase()}</Badge>
            </Flex>
            <Flex
              justify="space-between"
              flexDirection={isMobile ? "column" : "row"}
            >
              <Text padding={2}>
                <strong>Price:</strong> {formatNumber(price.current_price)}
              </Text>
              <Text padding={2}>
                <strong>24h Change:</strong>{" "}
                <Percentage percent={price.price_change_percentage_24h} />
              </Text>
              <Text padding={2}>
                <strong>Volume:</strong> {formatNumber(price.total_volume)}
              </Text>
              <Text padding={2}>
                <strong>Market Cap:</strong> {formatNumber(price.market_cap)}
              </Text>
            </Flex>
          </Box>
        ))}
      <Stack
        padding={5}
        spacing={4}
        direction={{ base: "column", md: "row" }}
        align="center"
        justify="center"
      >
        <Button
          colorScheme="blue"
          variant="outline"
          size="md"
          onClick={previousPage}
          disabled={page === 1}
        >
          Previous
        </Button>
        <Text>{page}</Text>
        <Button
          colorScheme="blue"
          variant="outline"
          size="md"
          onClick={nextPage}
        >
          Next
        </Button>
      </Stack>
    </Box>
  );
}

const queryClient = new QueryClient();
const Home = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <Card />
    </QueryClientProvider>
  );
};

export default Home;
