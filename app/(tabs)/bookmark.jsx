import { View, Text, FlatList, Image, RefreshControl } from "react-native";
import React, { useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import SearchInput from "../../components/SearchInput";
import EmptyState from "../../components/EmptyState";
import useAppwrite from "../../lib/useAppwrite";
import { userBookmarkedPosts } from "../../lib/appwriteConfig";
import VideoCard from "../../components/VideoCard";
import { useGlobalContext } from "../../store/GlobalProvider";

const Bookmark = () => {
  const { data: posts, refetch } = useAppwrite(userBookmarkedPosts);
  // const [posts, setPosts] = useState(data);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const onRefresh = async () => {
    setIsRefreshing(true);
    await refetch();
    setIsRefreshing(false);
  };
  return (
    <SafeAreaView className="bg-primary h-full">
      <FlatList
        data={posts}
        keyExtractor={(item) => item.$id}
        renderItem={({ item }) => (
          <VideoCard
            videoId={item.$id}
            title={item.title}
            thumbnail={item.thumbnail}
            video={item.video}
            username={item.users?.username}
            avatar_url={item.users.avatar_url}
          />
        )}
        ListHeaderComponent={() => (
          <View className="my-6 px-4 space-y-6">
            <View className="justify-between items-start flex-row mb-6">
              <View>
                <Text className="font-psemibold text-2xl text-white">
                  Saved Videos
                </Text>
              </View>
            </View>
            <SearchInput />
          </View>
        )}
        ListEmptyComponent={() => (
          <EmptyState
            title="No videos found"
            subtitle="No videos found for the selected topic"
          />
        )}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={onRefresh}
          />
        }
      />
    </SafeAreaView>
  );
};

export default Bookmark;
