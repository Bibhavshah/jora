import { View, Text, TextInput } from "react-native";
import React, { useState } from "react";
import { TouchableOpacity, Image } from "react-native";
import { icons } from "../constants";

const FormField = ({
  title,
  placeholder,
  value,
  onChangeText,
  keyboardType,
  otherStyles,
  ...props
}) => {
  const [Showpassword, setShowpassword] = useState(true);
  return (
    <View className={`space-y-2 ${otherStyles}`}>
      <Text className="text-gray-100 text-base text-pmedium">{title}</Text>
      <View className="w-full bg-black-100 px-4 h-16 border-2 border-black-200 rounded-2xl focus:border-secondary flex-row">
        <TextInput
          className="flex-1 text-white text-base font-psemibold"
          value={value}
          placeholder={placeholder}
          placeholderTextColor="#8C8C8C"
          onChangeText={onChangeText}
          secureTextEntry={title === "Password" && !Showpassword}
        />
        {title === "Password" && (
          <TouchableOpacity
            onPress={() => setShowpassword(!Showpassword)}
            className="flex items-center justify-center"
          >
            <Image
              source={Showpassword ? icons.eye : icons.eyeHide}
              className="w-6 h-6"
              resizeMode="contain"
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default FormField;
