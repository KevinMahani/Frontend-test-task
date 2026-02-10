import Link from "next/link";

export default function HomePage() {
  return (
    <main style={{ padding: 24}}>  
      <h1>Frontend Task</h1>
      <p>مسیرها:</p>
      <ul>
        <li><Link href="/Login">ورود</Link></li>
        <li><Link href="/dashboard">داشبورد</Link></li>
      </ul>
    </main>
  );
}
