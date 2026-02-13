"use client";

import {
  Box,
  Button,
  Heading,
  HStack,
  Spinner,
  Text,
  Alert,
  AlertIcon,
  Stack,
  Divider,
  Image,
  Badge,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { fetchProductById } from "@/lib/productsApi";
import { useParams, useRouter } from "next/navigation";

export default function ProductDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const productId = params.id;

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError("");

      try {
        const data = await fetchProductById(productId);
        if (cancelled) return;
        setProduct(data);
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
  }, [productId]);

  return (
    <Box>
      <HStack justify="space-between" mb={4}>
        <Heading size="md">Product Details</Heading>
        <Button variant="outline" onClick={() => router.back()}>
          Back
        </Button>
      </HStack>

      {error && (
        <Alert status="error" mb={4}>
          <AlertIcon />
          {error}
        </Alert>
      )}

      {loading ? (
        <HStack py={10} justify="center">
          <Spinner />
          <Text>Loading...</Text>
        </HStack>
      ) : product ? (
        <Box borderWidth="1px" borderRadius="lg" p={6} bg="white">
          <Stack spacing={4}>
            <HStack spacing={4} align="start" flexWrap="wrap">
              <Image
                src={product.thumbnail}
                alt={product.title}
                borderRadius="md"
                maxW="240px"
                objectFit="cover"
              />

              <Box>
                <Heading size="sm" mb={2}>
                  {product.title}
                </Heading>

                <Text opacity={0.8} mb={2}>
                  {product.description}
                </Text>

                <HStack spacing={2} flexWrap="wrap">
                  <Badge colorScheme="purple">{product.category}</Badge>
                  {product.brand ? <Badge>{product.brand}</Badge> : null}
                  <Badge colorScheme="green">${product.price}</Badge>
                  <Badge colorScheme="blue">Stock: {product.stock}</Badge>
                  <Badge colorScheme="orange">Rating: {product.rating}</Badge>
                </HStack>
              </Box>
            </HStack>

            <Divider />

            <HStack justify="space-between" flexWrap="wrap">
              <Text><b>ID:</b> {product.id}</Text>
              <Text><b>SKU:</b> {product.sku || "-"}</Text>
              <Text><b>Discount:</b> {product.discountPercentage}%</Text>
            </HStack>

            {Array.isArray(product.images) && product.images.length > 0 ? (
              <>
                <Divider />
                <Box>
                  <Heading size="xs" mb={3}>Images</Heading>
                  <HStack spacing={3} flexWrap="wrap">
                    {product.images.slice(0, 6).map((img) => (
                      <Image
                        key={img}
                        src={img}
                        alt="product"
                        borderRadius="md"
                        maxW="120px"
                        objectFit="cover"
                      />
                    ))}
                  </HStack>
                </Box>
              </>
            ) : null}
          </Stack>
        </Box>
      ) : (
        <Text opacity={0.7}>No product data.</Text>
      )}
    </Box>
  );
}