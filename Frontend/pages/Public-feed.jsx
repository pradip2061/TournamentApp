import React, {useState} from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
  TextInput,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import {Ionicons} from '@expo/vector-icons';

// Dummy data for posts
const DUMMY_POSTS = [
  {
    id: '1',
    author: {
      name: 'Sarah Johnson',
      avatar: 'https://randomuser.me/api/portraits/women/32.jpg',
    },
    timeAgo: '2 hours ago',
    content:
      'Just finished an amazing hike today! The views were breathtaking.',
    image: 'https://images.unsplash.com/photo-1551632811-561732d1e306',
    likes: 142,
    comments: 23,
    shares: 5,
    liked: false,
  },
  {
    id: '2',
    author: {
      name: 'Mike Chen',
      avatar: 'https://randomuser.me/api/portraits/men/45.jpg',
    },
    timeAgo: '5 hours ago',
    content: "Working on a new project. Can't wait to share it with everyone!",
    image: null,
    likes: 87,
    comments: 12,
    shares: 2,
    liked: true,
  },
  {
    id: '3',
    author: {
      name: 'Emily Wilson',
      avatar: 'https://randomuser.me/api/portraits/women/68.jpg',
    },
    timeAgo: 'Yesterday',
    content: 'Check out this incredible sunset from my balcony!',
    image: 'https://images.unsplash.com/photo-1566045874325-89768a30eb33',
    likes: 247,
    comments: 32,
    shares: 15,
    liked: false,
  },
  {
    id: '4',
    author: {
      name: 'Jordan Taylor',
      avatar: 'https://randomuser.me/api/portraits/men/29.jpg',
    },
    timeAgo: '2 days ago',
    content: 'Just adopted this little guy. Meet Max!',
    image: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1',
    likes: 398,
    comments: 52,
    shares: 28,
    liked: false,
  },
];

const SocialFeedApp = () => {
  const [posts, setPosts] = useState(DUMMY_POSTS);
  const [newPostText, setNewPostText] = useState('');
  const [newPostImage, setNewPostImage] = useState(null);
  const [showComments, setShowComments] = useState({});

  // Toggle like for a post
  const toggleLike = postId => {
    setPosts(
      posts.map(post => {
        if (post.id === postId) {
          return {
            ...post,
            liked: !post.liked,
            likes: post.liked ? post.likes - 1 : post.likes + 1,
          };
        }
        return post;
      }),
    );
  };

  // Toggle comments visibility
  const toggleComments = postId => {
    setShowComments({
      ...showComments,
      [postId]: !showComments[postId],
    });
  };

  // Handle share
  const handleShare = postId => {
    // In a real app, this would open a share dialog
    alert(`Sharing post ${postId}`);
  };

  // Add new post
  const addNewPost = () => {
    if (newPostText.trim() === '' && !newPostImage) return;

    const newPost = {
      id: String(Date.now()),
      author: {
        name: 'You',
        avatar: 'https://randomuser.me/api/portraits/women/10.jpg',
      },
      timeAgo: 'Just now',
      content: newPostText,
      image: newPostImage,
      likes: 0,
      comments: 0,
      shares: 0,
      liked: false,
    };

    setPosts([newPost, ...posts]);
    setNewPostText('');
    setNewPostImage(null);
  };

  // Simulate uploading a photo
  const uploadPhoto = () => {
    // In a real app, this would open a photo picker
    // For this demo, we'll just set a random unsplash image
    const randomImages = [
      'https://images.unsplash.com/photo-1526336024174-e58f5cdd8e13',
      'https://images.unsplash.com/photo-1504674900247-0877df9cc836',
      'https://images.unsplash.com/photo-1512621776951-a57141f2eefd',
    ];
    const randomIndex = Math.floor(Math.random() * randomImages.length);
    setNewPostImage(randomImages[randomIndex]);
  };

  // Render individual post
  const renderPost = ({item}) => {
    return (
      <View style={styles.postContainer}>
        <View style={styles.postHeader}>
          <Image source={{uri: item.author.avatar}} style={styles.avatar} />
          <View style={styles.postHeaderText}>
            <Text style={styles.authorName}>{item.author.name}</Text>
            <Text style={styles.timeAgo}>{item.timeAgo}</Text>
          </View>
          <TouchableOpacity style={styles.moreButton}>
            <Ionicons name="ellipsis-horizontal" size={20} color="#666" />
          </TouchableOpacity>
        </View>

        <Text style={styles.postContent}>{item.content}</Text>

        {item.image && (
          <Image source={{uri: item.image}} style={styles.postImage} />
        )}

        <View style={styles.postStats}>
          <Text style={styles.statsText}>
            {item.likes} likes • {item.comments} comments • {item.shares} shares
          </Text>
        </View>

        <View style={styles.postActions}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => toggleLike(item.id)}>
            <Ionicons
              name={item.liked ? 'heart' : 'heart-outline'}
              size={22}
              color={item.liked ? '#e74c3c' : '#666'}
            />
            <Text style={[styles.actionText, item.liked && {color: '#e74c3c'}]}>
              Like
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => toggleComments(item.id)}>
            <Ionicons name="chatbubble-outline" size={22} color="#666" />
            <Text style={styles.actionText}>Comment</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => handleShare(item.id)}>
            <Ionicons name="share-social-outline" size={22} color="#666" />
            <Text style={styles.actionText}>Share</Text>
          </TouchableOpacity>
        </View>

        {showComments[item.id] && (
          <View style={styles.commentsSection}>
            <View style={styles.commentInputContainer}>
              <Image
                source={{
                  uri: 'https://randomuser.me/api/portraits/women/10.jpg',
                }}
                style={styles.commentAvatar}
              />
              <TextInput
                style={styles.commentInput}
                placeholder="Write a comment..."
                placeholderTextColor="#999"
              />
              <TouchableOpacity style={styles.commentSendButton}>
                <Ionicons name="send" size={18} color="#3b82f6" />
              </TouchableOpacity>
            </View>

            <Text style={styles.commentsHeader}>Comments</Text>

            {item.comments > 0 ? (
              <Text style={styles.noCommentsText}>
                Previous comments would appear here
              </Text>
            ) : (
              <Text style={styles.noCommentsText}>
                No comments yet. Be the first to comment!
              </Text>
            )}
          </View>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Social Feed</Text>
        <View style={styles.headerIcons}>
          <TouchableOpacity style={styles.iconButton}>
            <Ionicons name="search-outline" size={24} color="#333" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton}>
            <Ionicons name="notifications-outline" size={24} color="#333" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton}>
            <Ionicons name="chatbubbles-outline" size={24} color="#333" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Create Post */}
      <View style={styles.createPostContainer}>
        <View style={styles.createPostHeader}>
          <Image
            source={{uri: 'https://randomuser.me/api/portraits/women/10.jpg'}}
            style={styles.avatar}
          />
          <TextInput
            style={styles.createPostInput}
            placeholder="What's on your mind?"
            placeholderTextColor="#999"
            multiline
            value={newPostText}
            onChangeText={setNewPostText}
          />
        </View>

        {newPostImage && (
          <View style={styles.previewImageContainer}>
            <Image source={{uri: newPostImage}} style={styles.previewImage} />
            <TouchableOpacity
              style={styles.removeImageButton}
              onPress={() => setNewPostImage(null)}>
              <Ionicons name="close-circle" size={26} color="#fff" />
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.createPostActions}>
          <TouchableOpacity
            style={styles.createPostActionButton}
            onPress={uploadPhoto}>
            <Ionicons name="image-outline" size={22} color="#3b82f6" />
            <Text style={styles.createPostActionText}>Photo</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.postButton} onPress={addNewPost}>
            <Text style={styles.postButtonText}>Post</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Posts List */}
      <FlatList
        data={posts}
        renderItem={renderPost}
        keyExtractor={item => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.postsList}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f2f2',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e1e1e1',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
  },
  headerIcons: {
    flexDirection: 'row',
  },
  iconButton: {
    marginLeft: 16,
  },
  createPostContainer: {
    backgroundColor: '#fff',
    padding: 16,
    marginBottom: 8,
  },
  createPostHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  createPostInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    color: '#333',
    minHeight: 40,
  },
  previewImageContainer: {
    marginTop: 12,
    position: 'relative',
  },
  previewImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
  },
  removeImageButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: 15,
  },
  createPostActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#e1e1e1',
  },
  createPostActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#f0f8ff',
  },
  createPostActionText: {
    marginLeft: 4,
    fontSize: 16,
    color: '#3b82f6',
  },
  postButton: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    backgroundColor: '#3b82f6',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  postButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  postsList: {
    paddingBottom: 20,
  },
  postContainer: {
    backgroundColor: '#fff',
    marginBottom: 8,
    padding: 16,
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  postHeaderText: {
    flex: 1,
    marginLeft: 12,
  },
  authorName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  timeAgo: {
    fontSize: 14,
    color: '#999',
  },
  moreButton: {
    padding: 4,
  },
  postContent: {
    fontSize: 16,
    color: '#333',
    marginTop: 12,
    lineHeight: 22,
  },
  postImage: {
    width: '100%',
    height: 300,
    borderRadius: 8,
    marginTop: 12,
  },
  postStats: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#e1e1e1',
  },
  statsText: {
    fontSize: 14,
    color: '#666',
  },
  postActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#e1e1e1',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderRadius: 4,
  },
  actionText: {
    marginLeft: 4,
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  commentsSection: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#e1e1e1',
  },
  commentInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  commentAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  commentInput: {
    flex: 1,
    marginLeft: 8,
    backgroundColor: '#f0f2f5',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    fontSize: 14,
    color: '#333',
  },
  commentSendButton: {
    marginLeft: 8,
    padding: 4,
  },
  commentsHeader: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
    color: '#333',
  },
  noCommentsText: {
    fontSize: 14,
    color: '#999',
    fontStyle: 'italic',
  },
});

export default SocialFeedApp;
