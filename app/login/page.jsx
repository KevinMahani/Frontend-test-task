"use client";

import {
  Box,
  Button,
  Container,
  Heading,
  Input,
  Stack,
  Text,
  Alert,
  AlertIcon
} from "@chakra-ui/react";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { loginUser } from "@/lib/api";

export default function LoginPage() {
  const router = useRouter();

  const [username, setUsername] = useState("emilys");
  const [password, setPassword] = useState("emilyspass");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const data = await loginUser(username, password);

      // ذخیره توکن
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data));

      router.push("/dashboard");
      console.log("status:", response.status);
      console.log("data:", data);

    } catch (err) {
      setError(err.message);
      console.error(err);
    }

    setLoading(false);
  };

  return (
    <Container maxW="md" py={12}>
      <Box borderWidth="1px" borderRadius="lg" p={6}>
        <Heading size="md" mb={4}>ورود</Heading>

        {error && (
          <Alert status="error" mb={4}>
            <AlertIcon />
            {error}
          </Alert>
        )}

        <form onSubmit={onSubmit}>
          <Stack spacing={4}>
            <Input
              placeholder="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />

            <Input
              placeholder="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <Button
              type="submit"
              isLoading={loading}
              colorScheme="teal"
            >
              ورود
            </Button>
          </Stack>
        </form>
      </Box>
    </Container>
  );
}