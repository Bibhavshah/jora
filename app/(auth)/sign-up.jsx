import React, { useState } from "react";
import { StatusBar } from "expo-status-bar";
import { ScrollView, Text, View, Image, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { images } from "../../constants";
import CustomButton from "../../components/CustomButton";
import FormField from "../../components/FormField";
import { Link, router } from "expo-router";
import { createUser } from "../../lib/appwriteConfig";
import { useGlobalContext } from "../../store/GlobalProvider";

const SignUp = () => {
  const [form, setForm] = useState({
    email: "",
    username: "",
    password: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { setUser, setIsLoggedIn, isLoggedIn } = useGlobalContext();

  const submit = async () => {
    if (!form.email || !form.username || !form.password) {
      Alert.alert("Error", "Please fill all fields");
    }
    setIsSubmitting(true);
    try {
      const newCreatedUser = await createUser(
        form.email,
        form.password,
        form.username
      );
      setUser(newCreatedUser);
      setIsLoggedIn(true);
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
            Sign Up
          </Text>
          <FormField
            title="Username"
            placeholder="Enter your username"
            value={form.username}
            onChangeText={(text) =>
              setForm({
                ...form,
                username: text,
              })
            }
            keyboardType="email-address"
            otherStyles="mt-10"
          />
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
            title="Sign Up"
            handlePress={submit}
            containerStyles="mt-7"
            isLoading={isSubmitting}
          />
          <View className="justify-center flex-row pt-5 gap-2 text-center">
            <Text className="text-lg text-gray-100 font-pregular">
              Already have a account?
            </Text>
            <Link
              href="/sign-in"
              className="text-lg font-psemibold text-secondary"
            >
              Login
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

export default SignUp;
