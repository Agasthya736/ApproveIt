"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export function useRoleGuard(allowedRoles: string[]) {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      router.push("/login");
      return;
    }

    const rolesRaw = localStorage.getItem("userRoles");
    const roles: string[] = rolesRaw ? JSON.parse(rolesRaw) : [];

    const hasAccess = roles.some((r) => allowedRoles.includes(r));

    if (!hasAccess) {
      // send them somewhere sensible instead of a dead end
      if (roles.includes("ADMIN")) router.push("/admin");
      else if (roles.includes("MANAGER")) router.push("/manager");
      else router.push("/dashboard");
      return;
    }

    setAuthorized(true);
    setChecking(false);
  }, [router, allowedRoles]);

  return { authorized, checking };
}