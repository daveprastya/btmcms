import React from "react";
import { Navbar } from "../src/components";
import { useBtmContext } from "../src/BtmContext";
import { Candidates, Layout, Categories } from "../src/components";
import { useRouter } from "next/router";

export default function Dashboard() {
  const btmContext = useBtmContext();
  const navigation = btmContext.navigation;
  const router = useRouter();

  React.useEffect(() => {
    if (
      !btmContext.isLogin &&
      !localStorage.getItem(`${process.env.NEXT_PUBLIC_LOCALSTORAGE}`)
    ) {
      setTimeout(() => {
        router.push("/");
      }, 5000);
    }
  }, [btmContext.isLogin]);

  return (
    <Layout title="Dashboard">
      {btmContext.isLogin ? (
        <>
          <Navbar />
          <div className="px-6 py-6">
            {navigation.map((nav) => {
              if (nav.name === "Candidates" && nav.current) {
                return <Candidates />;
              } else if (nav.name === "Categories" && nav.current) {
                return <Categories />;
              }
            })}
          </div>
        </>
      ) : (
        <>
          <div className="bg-wardah-primary relative flex justify-center items-center h-screen">
            <div className="rounded animate-spin ease duration-300 w-5 h-5 border-2 border-white"></div>
            <p className="ml-5 text-white text-xl font-bold">
              Please Login First!
            </p>
          </div>
        </>
      )}
    </Layout>
  );
}
