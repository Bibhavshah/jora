import React from "react";
import { StatusBar } from "expo-status-bar";
import { Redirect, Stack } from "expo-router";
import { useGlobalContext } from "../../store/GlobalProvider";

const Authlayout = () => {
  const { isLoggedIn, isLoading } = useGlobalContext();
  if (!isLoading && isLoggedIn) return <Redirect href="/home" />;
  return (
    <>
      <Stack>
        <Stack.Screen
          name="sign-in"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="sign-up"
          options={{
            headerShown: false,
          }}
        />
      </Stack>
      <StatusBar
        backgroundColor="#161622"
        style="light"
      />
    </>
  );
};

export default Authlayout;
