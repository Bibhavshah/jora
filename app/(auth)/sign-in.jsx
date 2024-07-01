import React, { useState } from "react";
import { StatusBar } from "expo-status-bar";
import { ScrollView, Text, View, Image, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { images } from "../../constants";
import CustomButton from "../../components/CustomButton";
import FormField from "../../components/FormField";
import { Link, router } from "expo-router";
import { getCurrentUser, signIn } from "../../lib/appwriteConfig";
import { useGlobalContext } from "../../store/GlobalProvider";

const SignIn = () => {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { setUser, setIsLoggedIn, user, isLoggedIn } = useGlobalContext();

  const submit = async () => {
    if (!form.email || !form.password) {
      Alert.alert("Error", "Please fill all fields");
    }
    setIsSubmitting(true);
    try {
      await signIn(form.email, form.password);
      const currentUser = await getCurrentUser();
      console.log("Current User: ", currentUser);
      setUser(currentUser);
      setIsLoggedIn(true);
      console.log("User signed in successfully", user, isLoggedIn);
      Alert.alert("Success", "User signed in successfully");
      router.replace("/home");
    } catch (error) {
      Alert.alert("Error", error.message);
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <SafeAreaView className="h-full bg-primary">
      <ScrollView>
        <View className="w-full min-h-[85vh] justify-center px-4 my-6">
          <Image
            source={images.logo}
            className="w-[130px] h-[84px]"
            resizeMode="contain"
          />
          <Text className="text-white text-3xl font-psemibold text-semibold mt-4">
            Sign In
          </Text>
          <FormField
            title="Email"
            placeholder="Enter your email"
            value={form.email}
            onChangeText={(text) =>
              setForm({
                ...form,
                email: text,
              })
            }
            keyboardType="email-address"
            otherStyles="mt-7"
          />
          <FormField
            title="Password"
            placeholder="Enter your password"
            value={form.password}
            onChangeText={(text) =>
              setForm({
                ...form,
                password: text,
              })
            }
            otherStyles="mt-7"
          />
          <CustomButton
            title="Login"
            handlePress={submit}
            containerStyles="mt-7"
            isLoading={isSubmitting}
          />
          <View className="justify-center flex-row pt-5 gap-2 text-center">
            <Text className="text-lg text-gray-100 font-pregular">
              Don't have an account?
            </Text>
            <Link
              href="/sign-up"
              className="text-lg font-psemibold text-secondary"
            >
              Sign Up
            </Link>
          </View>
        </View>
      </ScrollView>
      <StatusBar
        backgroundColor="#161622"
        style="light"
      />
    </SafeAreaView>
  );
};

export default SignIn;
