"use client";

import {
  Box,
  Button,
  HStack,
  Input,
  Spinner,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  Text,
  Alert,
  AlertIcon,
  Badge,
} from "@chakra-ui/react";
import { useEffect, useMemo, useState } from "react";
import { fetchProducts } from "@/lib/productsApi";
import { useDebouncedValue } from "@/lib/useDebouncedValue";
import { useRouter } from "next/navigation";

export default function ProductsPage() {
  const router = useRouter();
  const LIMIT = 10;

  const [q, setQ] = useState("");
  const debouncedQ = useDebouncedValue(q, 400);

  const [page, setPage] = useState(1);
  const skip = useMemo(() => (page - 1) * LIMIT, [page]);

  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setPage(1);
  }, [debouncedQ]);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError("");

      try {
        const data = await fetchProducts({
          q: debouncedQ.trim(),
          limit: LIMIT,
          skip,
        });

        if (cancelled) return;

        setProducts(data.products || []);
        setTotal(data.total || 0);
      } catch (e) {
        if (cancelled) return;
        setError(e.message || "Error");
      } finally {
        if (cancelled) return;
        setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [debouncedQ, skip]);

  const totalPages = Math.max(1, Math.ceil(total / LIMIT));
  const canPrev = page > 1;
  const canNext = page < totalPages;

  return (
    <Box>
      <HStack justify="space-between" mb={4} spacing={4} flexWrap="wrap">
        <Text fontSize="xl" fontWeight="bold">
          Products <Badge ml={2}>{total}</Badge>
        </Text>

        <HStack spacing={3}>
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search products (title, brand, category...)"
            w={{ base: "260px", md: "360px" }}
          />

          <Button
            variant="outline"
            onClick={() => {
              setQ("");
              setPage(1);
            }}
          >
            Clear
          </Button>
        </HStack>
      </HStack>

      {error && (
        <Alert status="error" mb={4}>
          <AlertIcon />
          {error}
        </Alert>
      )}

      <Box borderWidth="1px" borderRadius="lg" overflow="hidden">
        <Box p={3} borderBottomWidth="1px">
          <HStack justify="space-between">
            <Text opacity={0.8}>
              Page {page} / {totalPages}
            </Text>

            <HStack spacing={2}>
              <Button
                size="sm"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                isDisabled={!canPrev || loading}
              >
                Prev
              </Button>
              <Button
                size="sm"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                isDisabled={!canNext || loading}
              >
                Next
              </Button>
            </HStack>
          </HStack>
        </Box>

        {loading ? (
          <HStack p={10} justify="center">
            <Spinner />
            <Text>Loading...</Text>
          </HStack>
        ) : (
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>ID</Th>
                <Th>Title</Th>
                <Th>Brand</Th>
                <Th>Category</Th>
                <Th isNumeric>Price</Th>
                <Th isNumeric>Stock</Th>
              </Tr>
            </Thead>

            <Tbody>
              {products.length === 0 ? (
                <Tr>
                  <Td colSpan={6}>
                    <Text opacity={0.7} py={6} textAlign="center">
                      No products found.
                    </Text>
                  </Td>
                </Tr>
              ) : (
                products.map((p) => (
                  <Tr
                    key={p.id}
                    cursor="pointer"
                    _hover={{ bg: "gray.100" }}
                    onClick={() => router.push(`/dashboard/products/${p.id}`)}
                  >
                    <Td>{p.id}</Td>
                    <Td>{p.title}</Td>
                    <Td>{p.brand || "-"}</Td>
                    <Td>{p.category}</Td>
                    <Td isNumeric>${p.price}</Td>
                    <Td isNumeric>{p.stock}</Td>
                  </Tr>
                ))
              )}
            </Tbody>
          </Table>
        )}
      </Box>
    </Box>
  );
}