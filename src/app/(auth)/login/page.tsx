"use client";

import { useState, FormEvent, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import styles from "../../auth.module.css";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const registered = searchParams.get("registered");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Invalid credentials");
      }

      // Successful login
      if (data.user.role === "SUPER_ADMIN") {
        router.push("/dashboard/admin");
      } else if (data.user.role === "VENDOR") {
        router.push("/dashboard/vendor");
      } else {
        router.push("/products"); // Customer default route
      }
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`animate-fade-in ${styles.authCard}`}>
      <h1 className={styles.title}>Welcome Back</h1>
      <p className={styles.subtitle}>Log in to AutoPartsGlobal.</p>

      {registered && (
        <div style={{
          backgroundColor: "#ECFDF5",
          color: "#059669",
          padding: "0.75rem",
          borderRadius: "var(--radius-md)",
          border: "1px solid #A7F3D0",
          marginBottom: "1rem",
          textAlign: "center",
          fontSize: "0.875rem"
        }}>
          Account created successfully! Please log in.
        </div>
      )}

      {error && <div className={styles.errorText}>{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className={styles.formGroup}>
          <label className={styles.label} htmlFor="email">Email Address</label>
          <input
            type="email"
            id="email"
            className={styles.input}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label} htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            className={styles.input}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button
          type="submit"
          className={`btn btn-primary ${styles.submitBtn}`}
          disabled={loading}
        >
          {loading ? "Logging in..." : "Log In"}
        </button>
      </form>

      <p className={styles.footerText}>
        Don't have an account? <Link href="/register">Sign up here</Link>
      </p>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className={styles.authWrapper}>
      <Suspense fallback={<div>Loading...</div>}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
