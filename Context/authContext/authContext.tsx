"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/navigation";

const AuthContext = createContext<any>({
  UserloggedIn: false,
  loading: false,
  currentUser: null,
});

export default function AuthProvider({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const router = useRouter();
  const [UserloggedIn, setUserloggedIn] = useState<boolean>(false);
  const [loading, setloading] = useState<boolean>(false);
  const [currentUser, setcurrentUser] = useState<any>();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, initializeUser);
    return unsubscribe;
  }, []);

  useEffect(() => {
    // console.log(UserloggedIn);
    UserloggedIn ? router.push("/Home") : router.push("/");
  }, [UserloggedIn]);

  async function initializeUser(user: any) {
    setloading(true);
    if (user) {
      setcurrentUser({ ...user });
      setUserloggedIn(true);
    } else {
      setcurrentUser(null);
      setUserloggedIn(false);
    }

    setloading(false);
  }

  const value = { UserloggedIn, loading, currentUser };
  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
