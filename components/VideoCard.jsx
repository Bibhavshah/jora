import { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import {
  bookmarkVideo,
  unBookmarkVideo,
  checkIfBookmarked,
} from "../lib/appwriteConfig";
import { icons } from "../constants";
import { ResizeMode, Video } from "expo-av";

const VideoCard = ({
  videoId,
  title,
  thumbnail,
  video,
  username,
  avatar_url,
  fromPage,
}) => {
  const [liked, setLiked] = useState(false);
  const [play, setPlay] = useState(false);

  useEffect(() => {
    const checkIfLiked = async () => {
      try {
        const isLiked = await checkIfBookmarked(videoId);
        setLiked(isLiked);
      } catch (error) {
        throw new Error("Error checking if video is bookmarked");
      }
    };
    checkIfLiked();
  }, [videoId]);

  const likePostAction = async (videoId) => {
    try {
      await bookmarkVideo(videoId);
      console.log("Video Successfully bookmarked");
    } catch (error) {
      throw new Error("Error bookmarking video");
    }
  };

  const unLikePostAction = async (videoId) => {
    try {
      await unBookmarkVideo(videoId);
      console.log("Video Successfully unbookmarked");
    } catch (error) {
      throw new Error("Error unbookmarking video");
    }
  };

  const likePost = async () => {
    try {
      if (liked) {
        await unLikePostAction(videoId);
        setLiked(false);
      } else {
        await likePostAction(videoId);
        setLiked(true);
      }
    } catch (error) {
      throw new Error("Error liking post");
    }
  };
  return (
    <View className="flex flex-col items-center px-4 mb-14">
      <View className="flex flex-row gap-3 items-start">
        <View className="flex justify-center items-center flex-row flex-1">
          <View className="w-[46px] h-[46px] rounded-lg border border-secondary flex justify-center items-center p-0.5">
            <Image
              source={{ uri: avatar_url }}
              className="w-full h-full rounded-lg"
              resizeMode="cover"
            />
          </View>

          <View className="flex justify-center flex-1 ml-3 gap-y-1">
            <Text
              className="font-psemibold text-sm text-white"
              numberOfLines={1}
            >
              {title}
            </Text>
            <Text
              className="text-xs text-gray-100 font-pregular"
              numberOfLines={1}
            >
              {username}
            </Text>
          </View>
        </View>

        <TouchableOpacity
          onPress={() => likePost()}
          className="pt-2"
        >
          <Image
            source={!liked ? icons.like : icons.likefilled}
            className="w-8 h-8"
            resizeMode="contain"
          />
        </TouchableOpacity>
      </View>

      {play ? (
        <Video
          source={{ uri: video }}
          className="w-full h-60 rounded-xl mt-3"
          resizeMode={ResizeMode.CONTAIN}
          useNativeControls
          shouldPlay
          onPlaybackStatusUpdate={(status) => {
            if (status.didJustFinish) setPlay(false);
          }}
        />
      ) : (
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => setPlay(true)}
          className="w-full h-60 rounded-xl mt-3 relative flex justify-center items-center"
        >
          <Image
            source={{ uri: thumbnail }}
            className="w-full h-full rounded-xl mt-3"
            resizeMode="cover"
          />

          <Image
            source={icons.play}
            className="w-12 h-12 absolute"
            resizeMode="contain"
          />
        </TouchableOpacity>
      )}
    </View>
  );
};

export default VideoCard;
