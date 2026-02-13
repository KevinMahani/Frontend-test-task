import Link from "next/link";

export default function HomePage() {
  return (
    <>
        <h1
          style={{
            justifyContent: "center",
            display: "flex",
            marginTop: 150,
            marginBottom: 40,
            fontSize: 22,
            fontWeight: 600,
            color: "#0f172a",
            letterSpacing: "-0.3px",
            fontSize: 45,
          }}
        >
          Frontend Task
        </h1>
    
    <main
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f8fafc",
      }}
    >
      <div
        style={{
          width: 380,
          padding: 40,
          border: "1px solid #000000",
          borderRadius: 18,
          backgroundColor: "#ffffff",
          boxShadow: "0 8px 30px rgba(0,0,0,0.04)",
          textAlign: "center",
        }}
      >


        <ul
          style={{
            listStyle: "none",
            padding: 0,
            margin: 0,
            display: "flex",
            flexDirection: "column",
            gap: 14,
          }}
        >
          <li>
            <Link
              href="/login"
              style={{
                display: "block",
                padding: "12px 16px",
                borderRadius: 12,
                border: "1px solid #000000",
                backgroundColor: "#f1f5f9",
                textDecoration: "none",
                color: "#0f172a",
                fontSize: 14,
                fontWeight: 500,
                transition: "all 0.2s ease",
              }}
            >
              Login
            </Link>
          </li>

          <li>
            <Link
              href="/dashboard"
              style={{
                display: "block",
                padding: "12px 16px",
                borderRadius: 12,
                border: "1px solid #000000",
                backgroundColor: "#f1f5f9",
                textDecoration: "none",
                color: "#0f172a",
                fontSize: 14,
                fontWeight: 500,
                transition: "all 0.2s ease",
              }}
            >
              Dashboard
            </Link>
          </li>
        </ul>
      </div>
    </main>
 </> 
 );
}
