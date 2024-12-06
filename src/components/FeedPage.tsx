import  { useEffect, useState } from 'react';
import axios from 'axios';
import { formatDistanceToNow } from 'date-fns';
import { MessageCircle } from 'lucide-react';
import CreatePost from './CreatePost';

interface Comment {
  userName: string;
  text: string;
  createdAt: string;
}

interface Post {
  _id: string;
  userName: string;
  description: string;
  mediaUrl: string;
  mediaType: 'image' | 'video';
  likes: number;
  comments: Comment[];
  createdAt: string;
}

const FeedPage = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [expandedComments, setExpandedComments] = useState<Record<string, boolean>>({});

  const fetchPosts = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/posts');
      setPosts(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch posts');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleLikeClick = async (postId: string) => {
    try {
      const response = await axios.patch(`http://localhost:5000/api/posts/${postId}/like`);
      setPosts(posts.map(post => 
        post._id === postId ? { ...post, likes: response.data.likes } : post
      ));
    } catch (err) {
      console.error('Error updating likes:', err);
    }
  };

  const toggleComments = (postId: string) => {
    setExpandedComments(prev => ({
      ...prev,
      [postId]: !prev[postId]
    }));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen text-red-500">
        {error}
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      <CreatePost onPostCreated={fetchPosts} />
      
      {posts.map(post => (
        <div key={post._id} className="bg-white rounded-lg shadow-sm mb-6 p-6">
          <div className="flex items-center mb-4">
            <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
              {post.userName.charAt(0).toUpperCase()}
            </div>
            <div className="ml-3">
              <p className="font-medium text-gray-900">{post.userName}</p>
              <p className="text-sm text-gray-500">
                {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
              </p>
            </div>
          </div>
          
          <p className="text-gray-800 mb-4">{post.description}</p>

          <div className="mb-4">
            {post.mediaType === 'image' ? (
              <img
                src={`http://localhost:5000${post.mediaUrl}`}
                alt="Post media"
                className="rounded-lg max-h-96 w-full object-cover"
              />
            ) : (
              <video
                src={`http://localhost:5000${post.mediaUrl}`}
                controls
                className="rounded-lg max-h-96 w-full"
              />
            )}
          </div>
          
          <div className="flex items-center space-x-6">
            <button
              onClick={() => handleLikeClick(post._id)}
              className="text-gray-500 hover:text-gray-700 transition-colors"
            >
              {post.likes} likes
            </button>
            
            <button
              onClick={() => toggleComments(post._id)}
              className="flex items-center text-gray-500 hover:text-gray-700 transition-colors"
            >
              <MessageCircle className="h-5 w-5 mr-1" />
              {post.comments.length} comments
            </button>
          </div>

          {expandedComments[post._id] && (
            <div className="mt-4 space-y-3">
              {post.comments.map((comment, index) => (
                <div key={index} className="bg-gray-50 rounded p-3">
                  <div className="flex items-center mb-1">
                    <span className="font-medium text-sm text-gray-900">
                      {comment.userName}
                    </span>
                    <span className="text-xs text-gray-500 ml-2">
                      {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700">{comment.text}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default FeedPage;