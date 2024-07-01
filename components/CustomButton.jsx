import { TouchableOpacity, Text } from "react-native";
import React from "react";

const CustomButton = ({
  title,
  containerStyles,
  handlePress,
  isLoading,
  textSytles,
}) => {
  return (
    <TouchableOpacity
      onPress={handlePress}
      activeOpacity={0.7}
      className={`w-full bg-secondary min-h-[62px] rounded-xl justify-center items-center ${containerStyles} ${
        isLoading ? "opacity-50" : "opacity-100"
      }`}
      disabled={isLoading}
    >
      <Text className={`font-psemibold text-primary text-lg ${textSytles}`}>
        {title}
      </Text>
    </TouchableOpacity>
  );
};

export default CustomButton;
