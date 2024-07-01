import { View, Text, TextInput, Alert } from "react-native";
import React, { useState } from "react";
import { TouchableOpacity, Image } from "react-native";
import { icons } from "../constants";
import { router, usePathname } from "expo-router";

const SearchInput = ({ initialQuery }) => {
  const [query, setQuery] = useState(initialQuery || "");
  const pathname = usePathname();
  return (
    <View className="w-full items-center bg-black-100 px-4 h-16 border-2 border-black-200 rounded-2xl focus:border-secondary flex-row space-x-4">
      <TextInput
        className="text-base mt-0.5 text-white flex-1 font-pregular"
        value={query}
        placeholder="Search for a video topic"
        placeholderTextColor="#CDCDE0"
        onChangeText={(e) => setQuery(e)}
      />
      <TouchableOpacity
        onPress={() => {
          if (!query) {
            Alert.alert(
              "Missing Query",
              "Please enter a query to search for a video"
            );
          }
          if (pathname.startsWith("/Search")) {
            router.setParams({ query: query });
          } else {
            router.push(`/Search/${query}`);
          }
        }}
      >
        <Image
          source={icons.search}
          className="w-6 h-6"
          resizeMode="contain"
        />
      </TouchableOpacity>
    </View>
  );
};

export default SearchInput;
