"use client";

import { Box, Flex, VStack, Link as ChakraLink, Text } from "@chakra-ui/react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function DashboardLayout({ children }) {
  const router = useRouter();

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/login");
  };

  return (
    <Flex minH="100vh">
      {/* Sidebar */}
      <Box
        w="250px"
        bg="#2D3748"
        color="white"
        p={6}
      >
        <Text fontSize="lg" mb={6} fontWeight="bold">
          Dashboard
        </Text>

        <VStack align="start" spacing={4}>
          <ChakraLink as={Link} href="/dashboard/users">
            Users
          </ChakraLink>

          <ChakraLink as={Link} href="/dashboard/products">
            Products
          </ChakraLink>

          <ChakraLink as={Link} href="/dashboard/games">
            Games
          </ChakraLink>


          <ChakraLink onClick={logout} cursor="pointer">
            Logout
          </ChakraLink>
        </VStack>
      </Box>

      {/* Content */}
      <Box flex="1" p={8} bg="gray.50">
        {children}
      </Box>
    </Flex>
  );
}