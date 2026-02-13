// "use client";

// import {
//   Box,
//   Button,
//   Container,
//   Heading,
//   Input,
//   Stack,
//   Text,
//   Alert,
//   AlertIcon
// } from "@chakra-ui/react";

// import { useState } from "react";
// import { useRouter } from "next/navigation";
// import { loginUser } from "@/lib/api";

// export default function LoginPage() {
//   const router = useRouter();

//   const [username, setUsername] = useState("emilys");
//   const [password, setPassword] = useState("emilyspass");
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");

//   const onSubmit = async (e) => {
//     e.preventDefault();
//     setError("");
//     setLoading(true);

//     try {
//       const data = await loginUser(username, password);

//       localStorage.setItem("token", data.token);
//       localStorage.setItem("user", JSON.stringify(data));

//       router.push("/dashboard");
//       console.log("status:", response.status);
//       console.log("data:", data);

//     } catch (err) {
//       setError(err.message);
//       console.error(err);
//     }

//     setLoading(false);
//   };

//   return (
//     <Container maxW="md" py={12}>
//       <Box borderWidth="1px" borderRadius="lg" p={6}>
//         <Heading size="md" mb={4}>Login</Heading>

//         {error && (
//           <Alert status="error" mb={4}>
//             <AlertIcon />
//             {error}
//           </Alert>
//         )}

//         <form onSubmit={onSubmit}>
//           <Stack spacing={4}>
//             <Input
//               placeholder="username"
//               value={username}
//               onChange={(e) => setUsername(e.target.value)}
//             />

//             <Input
//               placeholder="password"
//               type="password"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//             />

//             <Button
//               type="submit"
//               isLoading={loading}
//               colorScheme="teal"
//             >
//               Login
//             </Button>
//           </Stack>
//         </form>
//       </Box>
//     </Container>
//   );
// }
"use client";

import {
  Box,
  Button,
  Container,
  Heading,
  Input,
  Stack,
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

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data));

      router.push("/dashboard");
    } catch (err) {
      setError(err.message);
    }

    setLoading(false);
  };

  return (
    <Container
      maxW="100%"
      minH="100vh"
      display="flex"
      justifyContent="center"
      alignItems="center"
      bg="#f8fafc"
    >
      <Box
        width="380px"
        p="20px"
        border="1px solid #000000"
        borderRadius="18px"
        bg="#ffffff"
        boxShadow="0 8px 30px rgba(0,0,0,0.04)"
      >
        <Heading
          size="md"
          mb={6}
          mr={"10em"}
          fontSize="22px"
          fontWeight="600"
          color="#0f172a"
          letterSpacing="-0.3px"
          textAlign="center"
        >
          Login
        </Heading>

        {error && (
          <Alert status="error" mb={4} borderRadius="12px">
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
              border="1px solid #000000"
              borderRadius="12px"
              bg="#f1f5f9"
              _focus={{
                boxShadow: "none",
                borderColor: "#000000",
              }}
            />

            <Input
              placeholder="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              border="1px solid #000000"
              borderRadius="12px"
              bg="#f1f5f9"
              _focus={{
                boxShadow: "none",
                borderColor: "#000000",
              }}
            />

            <Button
              type="submit"
              isLoading={loading}
              bg="#f1f5f9"
              border="1px solid #000000"
              borderRadius="12px"
              color="#0f172a"
              fontWeight="500"
              _hover={{
                bg: "#e2e8f0",
              }}
              _active={{
                bg: "#e2e8f0",
              }}
            >
              Login
            </Button>
          </Stack>
        </form>
      </Box>
    </Container>
  );
}
