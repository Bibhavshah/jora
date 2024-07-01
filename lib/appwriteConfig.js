import {
  Client,
  Account,
  Avatars,
  ID,
  Databases,
  Storage,
  Query,
} from "react-native-appwrite";
export const config = {
  endpoint: process.env.ENDPOINT_URL,
  platform: process.env.PPLATFORM_URL,
  projectId: process.env.PROJECT_ID,
  databaseId: process.env.DATABASE_ID,
  userCollectionId: process.env.USER_COLLECTION_ID,
  videosCollectionId: process.env.VIDEOS_COLLECTION_ID,
  storgeBucketId: process.env.STORAGE_BUCKET_ID,
};

const client = new Client();

client
  .setEndpoint(config.endpoint)
  .setProject(config.projectId)
  .setPlatform(config.platform);

const account = new Account(client);
const avatars = new Avatars(client);
const database = new Databases(client);
const storage = new Storage(client);

export const createUser = async (email, password, username) => {
  try {
    const newAccount = await account.create(
      ID.unique(),
      email,
      password,
      username
    );

    if (!newAccount) {
      throw new Error("Account creation failed");
    }

    const avatarUrl = avatars.getInitials(username);

    await signIn(email, password);

    const newUser = await database.createDocument(
      config.databaseId,
      config.userCollectionId,
      ID.unique(),
      {
        accountId: newAccount.$id,
        email: email,
        username: username,
        avatar_url: avatarUrl,
      }
    );
    return newUser;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const signIn = async (email, password) => {
  try {
    // const newsession = await account.deleteSession("current");
    const session = await account.createEmailPasswordSession(email, password);
    return session;
  } catch (error) {
    console.log("Error from signin appwrite: ", error);
    throw new Error(error.message);
  }
};

export const getCurrentUser = async () => {
  try {
    const currentAccount = await account.get();
    if (!currentAccount) {
      throw Error;
    }
    const currentUser = await database.listDocuments(
      config.databaseId,
      config.userCollectionId,
      [Query.equal("accountId", currentAccount.$id)]
    );
    if (!currentUser) {
      throw Error;
    }
    return currentUser.documents[0];
  } catch (error) {
    console.log(error);
  }
};

export const getPosts = async () => {
  try {
    const posts = await database.listDocuments(
      config.databaseId,
      config.videosCollectionId
    );
    return posts.documents;
  } catch (error) {
    console.log(error);
  }
};

export const getLatestPosts = async () => {
  try {
    const posts = await database.listDocuments(
      config.databaseId,
      config.videosCollectionId,
      [Query.orderDesc("$createdAt"), Query.limit(7)]
    );
    return posts.documents;
  } catch (error) {
    console.log(error);
  }
};

export const getPostsWithQuery = async (query) => {
  try {
    const posts = await database.listDocuments(
      config.databaseId,
      config.videosCollectionId,
      [Query.search("title", query)]
    );
    return posts.documents;
  } catch (error) {
    console.log(error);
  }
};

export const getUsersPosts = async (userId) => {
  try {
    const posts = await database.listDocuments(
      config.databaseId,
      config.videosCollectionId,
      [Query.equal("users", userId)]
    );
    return posts.documents;
  } catch (error) {
    console.log(error);
  }
};

export const signOut = async () => {
  try {
    const session = await account.deleteSession("current");
    return session;
  } catch (error) {
    throw new Error(error.message);
  }
};

const getFilePreview = async (fileId, type) => {
  let fileUrl;
  try {
    if (type === "image") {
      fileUrl = storage.getFilePreview(
        config.storageId,
        fileId,
        2000,
        2000,
        "top",
        100
      );
    } else if (type === "video") {
      fileUrl = storage.getFileView(config.storageId, fileId);
    } else {
      throw new Error("Invalid file type");
    }
    if (!fileUrl) throw new Error("Failed to get file preview");
    return fileUrl;
  } catch (error) {
    console.log("Error from getFilePreview: ", error.message);
    throw new Error(error);
  }
};

const uploadFile = async (file, type) => {
  if (!file) return;

  const assest = {
    name: file.filename,
    type: file.mimeType,
    size: file.fileSize,
    file: file.uri,
  };

  try {
    const uploadedFile = await storage.createFile(
      config.storgeBucketId,
      ID.unique(),
      assest
    );
    const fileUrl = await getFilePreview(uploadedFile.$id, type);
    return fileUrl;
  } catch (error) {
    console.log("Error from uploadFile: ", error.message);
    throw new Error(error);
  }
};

export const createVideoPost = async (form) => {
  try {
    const [thumbanilUrl, videoUrl] = await Promise.all([
      uploadFile(form.thumbnail, "image"),
      uploadFile(form.video, "video"),
    ]);

    const newPost = await database.createDocument(
      config.databaseId,
      config.videosCollectionId,
      ID.unique(),
      {
        title: form.title,
        thumbnail: thumbanilUrl,
        video: videoUrl,
        prompt: form.prompt,
        users: form.userId,
      }
    );
    return newPost;
  } catch (error) {
    console.log("Error from createVideoPost: ", error.message);
    throw new Error(error);
  }
};

export const bookmarkVideo = async (videoId) => {
  try {
    const userDoc = await getCurrentUser();
    const isBookmarked = await checkIfBookmarked(videoId);
    if (isBookmarked) {
      return;
    }
    const updatedVideos = userDoc.videos
      ? [...userDoc.videos, videoId]
      : [videoId];

    const updatedUserDoc = await database.updateDocument(
      config.databaseId,
      config.userCollectionId,
      userDoc.$id,
      { videos: updatedVideos }
    );

    return updatedUserDoc;
  } catch (error) {
    console.log("Error from addLikedVideo: ", error.message);
    throw new Error(error);
  }
};

export const userBookmarkedPosts = async () => {
  try {
    const userDoc = await getCurrentUser();
    const bookmarkedVideoIds = userDoc.videos || [];
    const videoFetchPromises = bookmarkedVideoIds.map((videoId) =>
      database.getDocument(
        config.databaseId,
        config.videosCollectionId,
        videoId.$id
      )
    );

    const bookmarkedVideos = await Promise.all(videoFetchPromises);
    return bookmarkedVideos;
  } catch (error) {
    console.log("Error from getLikedVideos: ", error.message);
    throw new Error(error);
  }
};

export const checkIfBookmarked = async (videoId) => {
  try {
    const userDoc = await getCurrentUser();
    const bookmarkedVideoIds = userDoc.videos || [];
    const isBookmarked = bookmarkedVideoIds.some(
      (video) => video.$id === videoId
    );
    return isBookmarked;
  } catch (error) {
    console.log("Error from checkIfLiked: ", error.message);
    throw new Error(error);
  }
};

export const unBookmarkVideo = async (videoId) => {
  try {
    const userDoc = await getCurrentUser();
    const isBookmarked = await checkIfBookmarked(videoId);
    if (!isBookmarked) {
      return;
    }
    const updatedVideos = userDoc.videos
      ? userDoc.videos.filter((video) => video.$id !== videoId)
      : [];

    const updatedUserDoc = await database.updateDocument(
      config.databaseId,
      config.userCollectionId,
      userDoc.$id,
      { videos: updatedVideos }
    );

    return updatedUserDoc;
  } catch (error) {
    console.log("Error from removeLikedVideo: ", error.message);
    throw new Error(error);
  }
};
