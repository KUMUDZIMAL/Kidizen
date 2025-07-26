"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import {
  ArrowUp,
  ArrowDown,
  MessageSquare,
  Star,
  Send,
  Heart,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/myComponents/Navbar2";

interface Comment {
  id: string;
  author: string;
  message: string;
  createdAt: string;
  likes: number;
  userLiked: boolean;
}

interface Post {
  id: string;
  author: string;
  avatar: string;
  message: string;
  likes: number;
  comments: Comment[];
  createdAt: string;
  userLiked: boolean;
  isVerified?: boolean;
}

interface User {
  username: string;
  age: number;
  _id: string;
}

const initialPosts: Post[] = [
  {
    id: "1",
    author: "Supriya",
    avatar: "",
    message:
      "Just a reminder that every child has the right to express their opinions about matters that affect them. Article 12 of the UN Convention on the Rights of the Child protects this right! 🌟",
    likes: 24,
    comments: [
      {
        id: "c1",
        author: "Priya",
        message: "Thanks for sharing! I didn't know about Article 12 before.",
        createdAt: "1 day ago",
        likes: 3,
        userLiked: false,
      },
      {
        id: "c2",
        author: "Sneha",
        message: "Great explanation! This is exactly what we discussed in class.",
        createdAt: "1 day ago",
        likes: 5,
        userLiked: false,
      },
    ],
    createdAt: "2 days ago",
    userLiked: false,
    isVerified: true,
  },
  {
    id: "2",
    author: "Prachi",
    avatar: "",
    message:
      "Today at school we had a debate about children's rights to privacy. It was interesting to learn that even kids have the right to keep some things private! 🔒",
    likes: 18,
    comments: [
      {
        id: "c3",
        author: "Bhoomi",
        message: "Privacy is so important! We should all respect each other's boundaries.",
        createdAt: "2 days ago",
        likes: 2,
        userLiked: false,
      },
    ],
    createdAt: "3 days ago",
    userLiked: false,
  },
  {
    id: "3",
    author: "Purva",
    avatar: "",
    message:
      "Did you know? The UN Convention on the Rights of the Child is the most widely ratified human rights treaty in history! It sets out the civil, political, economic, social, health and cultural rights of children. 📚✨",
    likes: 35,
    comments: [
      {
        id: "c4",
        author: "Simran",
        message: "Wow! That's amazing. How many countries have signed it?",
        createdAt: "5 days ago",
        likes: 1,
        userLiked: false,
      },
      {
        id: "c5",
        author: "Rohan",
        message: "196 countries have ratified it! That's almost every country in the world.",
        createdAt: "5 days ago",
        likes: 8,
        userLiked: false,
      },
    ],
    createdAt: "1 week ago",
    userLiked: false,
    isVerified: true,
  },
];

const Community = () => {
  // State management
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [newPost, setNewPost] = useState("");
  const [expandedComments, setExpandedComments] = useState<Set<string>>(new Set());
  const [newComments, setNewComments] = useState<Record<string, string>>({});

  const { toast } = useToast();

  // Fetch the logged-in user on mount
  useEffect(() => {
    const fetchUser = async () => {
      try {
        setIsLoading(true);
        const res = await fetch("/api/auth/user", {
          method: "GET",
          credentials: "include",
        });

        if (res.ok) {
          const data: User = await res.json();
          setUser(data);
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error("Failed to fetch user:", error);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, []);

  const handleCreatePost = () => {
    if (!newPost.trim()) {
      toast({
        title: "Empty Post",
        description: "Please write something before posting.",
        variant: "destructive",
      });
      return;
    }

    const post: Post = {
      id: Math.random().toString(36).substring(2, 9),
      author: user?.username || "Anonymous",
      avatar: "",
      message: newPost.trim(),
      likes: 0,
      comments: [],
      createdAt: "Just now",
      userLiked: false,
    };

    setPosts([post, ...posts]);
    setNewPost("");

    toast({
      title: "Post Created! 🎉",
      description: "Your thoughts have been shared with the community!",
    });
  };

  const handleLike = (postId: string) => {
    setPosts(
      posts.map((post) =>
        post.id === postId
          ? {
              ...post,
              likes: post.userLiked ? post.likes - 1 : post.likes + 1,
              userLiked: !post.userLiked,
            }
          : post
      )
    );
  };

  const handleCommentLike = (postId: string, commentId: string) => {
    setPosts(
      posts.map((post) => {
        if (post.id === postId) {
          return {
            ...post,
            comments: post.comments.map((comment) =>
              comment.id === commentId
                ? {
                    ...comment,
                    likes: comment.userLiked ? comment.likes - 1 : comment.likes + 1,
                    userLiked: !comment.userLiked,
                  }
                : comment
            ),
          };
        }
        return post;
      })
    );
  };

  const toggleComments = (postId: string) => {
    const newExpanded = new Set(expandedComments);
    if (newExpanded.has(postId)) {
      newExpanded.delete(postId);
    } else {
      newExpanded.add(postId);
    }
    setExpandedComments(newExpanded);
  };

  const handleAddComment = (postId: string) => {
    const commentText = newComments[postId];
    if (!commentText?.trim()) {
      toast({
        title: "Empty Comment",
        description: "Please write something before commenting.",
        variant: "destructive",
      });
      return;
    }

    const newComment: Comment = {
      id: Math.random().toString(36).substring(2, 9),
      author: user?.username || "Anonymous",
      message: commentText.trim(),
      createdAt: "Just now",
      likes: 0,
      userLiked: false,
    };

    setPosts(
      posts.map((post) =>
        post.id === postId
          ? { ...post, comments: [...post.comments, newComment] }
          : post
      )
    );

    setNewComments({ ...newComments, [postId]: "" });

    toast({
      title: "Comment Added! 💬",
      description: "Your reply has been posted.",
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white">Loading community...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative">
      {/* Black blurred overlay */}
      <div
        className="absolute inset-0 bg-black/40 z-0"
        style={{ backdropFilter: "blur(2px)" }}
      />
      {/* Background image */}
      <div
        className="relative z-10 min-h-screen bg-cover bg-center bg-no-repeat p-6"
        style={{ backgroundImage: `url('images/image.jpg')`, opacity: 0.7 }}
      >
        <Navbar />
        <div className="max-w-5xl mx-auto bg-black/60 rounded-2xl shadow-2xl p-8 mt-24">
          <div className="container mx-auto p-4 max-w-4xl">
            {/* Header */}
            <div className="mb-8 text-center">
              <h1 className="text-4xl font-bold text-white mb-3">
                Rights Explorers Community 🌟
              </h1>
              <p className="text-lg text-white/80 max-w-2xl mx-auto">
                Connect with fellow rights advocates, share your thoughts, and learn together in our safe space!
              </p>
            </div>

            {/* Create Post */}
            <Card className="mb-8 shadow-lg border-0 bg-black/80 text-white">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <MessageSquare className="h-5 w-5" />
                  Share Your Voice
                </CardTitle>
                <CardDescription className="text-white/60">
                  What's on your mind about children's rights? Share your thoughts, questions, or experiences!
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <Textarea
                  placeholder="Express yourself! Share a thought about rights, ask a question, or tell us about something you learned... ✨"
                  value={newPost}
                  onChange={(e) => setNewPost(e.target.value)}
                  className="min-h-[120px] bg-white/10 text-white border border-white/20 placeholder-white/60"
                />
              </CardContent>
              <CardFooter className="flex justify-between items-center border-t border-white/10">
                <div className="flex items-center gap-2">
                  <Badge className="bg-green-700 text-white font-bold">Safe Space</Badge>
                  <span className="text-white/80 font-bold">Be kind and respectful 💝</span>
                </div>
                <Button
                  onClick={handleCreatePost}
                  className="bg-purple-600 text-white px-6 py-2 rounded-xl font-bold hover:bg-purple-700 transition-all duration-300"
                >
                  <Send className="h-4 w-4 mr-2" />
                  Post
                </Button>
              </CardFooter>
            </Card>

            {/* Community Guidelines */}
            <Card className="mb-8 border border-white/10 bg-black/80 text-white">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-purple-300 font-bold">
                  <Star className="h-5 w-5" />
                  Community Guidelines
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-3 text-white/80">
                  <div className="flex items-center gap-2">
                    <Heart className="h-4 w-4" />
                    Be respectful and kind to everyone
                  </div>
                  <div className="flex items-center gap-2">
                    <Star className="h-4 w-4" />
                    Share knowledge about rights
                  </div>
                  <div className="flex items-center gap-2">
                    <MessageSquare className="h-4 w-4" />
                    Ask questions if you're unsure
                  </div>
                  <div className="flex items-center gap-2">
                    <ArrowUp className="h-4 w-4" />
                    Support others with likes and comments
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Community Posts */}
            <div className="space-y-6">
              <h2 className="text-2xl font-extrabold text-center mb-6 text-white">
                Recent Conversations 💬
              </h2>

              {posts.map((post) => (
                <Card
                  key={post.id}
                  className="shadow-lg border-0 bg-black/80 text-white hover:shadow-xl transition-all duration-300"
                >
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center">
                        <Avatar className="h-12 w-12 mr-3 ring-2 ring-purple-400">
                          <AvatarFallback className="bg-purple-700 text-white font-bold">
                            {post.author.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="flex items-center gap-2">
                            <CardTitle className="text-lg text-white">
                              {post.author}
                            </CardTitle>
                            {(post.isVerified || post.author === "Teacher Mary") && (
                              <Badge className="bg-green-700 text-white text-xs">
                                <Star className="h-3 w-3 mr-1" />
                                Verified
                              </Badge>
                            )}
                          </div>
                          <CardDescription className="text-sm text-white/60">
                            {post.createdAt}
                          </CardDescription>
                        </div>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="pb-4">
                    <p className="text-white/90 leading-relaxed">{post.message}</p>
                  </CardContent>

                  <CardFooter className="flex-col space-y-4">
                    <div className="flex justify-between items-center w-full">
                      <div className="flex items-center space-x-6">
                        {/* Like Button for Post */}
                        <button
                          className={`flex items-center gap-2 px-3 py-1 rounded-full transition-all duration-200 ${
                            post.userLiked
                              ? "bg-red-700 text-white hover:bg-red-800"
                              : "bg-white/10 text-white hover:bg-white/20"
                          }`}
                          onClick={() => handleLike(post.id)}
                        >
                          <Heart className={`h-4 w-4 ${post.userLiked ? "fill-current" : ""}`} />
                          <span className="font-medium">{post.likes}</span>
                        </button>

                        {/* Toggle Comments */}
                        <button
                          className="flex items-center gap-2 px-3 py-1 rounded-full bg-purple-700 text-white hover:bg-purple-800 transition-all duration-200"
                          onClick={() => toggleComments(post.id)}
                        >
                          <MessageSquare className="h-4 w-4" />
                          <span className="font-medium">{post.comments.length}</span>
                        </button>
                      </div>
                    </div>

                    {/* Comments Section */}
                    {expandedComments.has(post.id) && (
                      <div className="w-full space-y-4">
                        <Separator className="bg-white/10" />

                        {/* Existing Comments */}
                        {post.comments.map((comment) => (
                          <div key={comment.id} className="bg-white/5 rounded-lg p-4 ml-4">
                            <div className="flex justify-between items-start mb-2">
                              <div className="flex items-center gap-2">
                                <Avatar className="h-8 w-8">
                                  <AvatarFallback className="bg-green-700 text-white text-sm">
                                    {comment.author.charAt(0)}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <p className="font-medium text-sm text-white">{comment.author}</p>
                                  <p className="text-xs text-white/60">{comment.createdAt}</p>
                                </div>
                              </div>

                              {/* Like Button for Comment */}
                              <button
                                className={`flex items-center gap-1 text-xs px-2 py-1 rounded-full transition-all ${
                                  comment.userLiked
                                    ? "bg-red-700 text-white"
                                    : "bg-white/10 text-white hover:bg-white/20"
                                }`}
                                onClick={() => handleCommentLike(post.id, comment.id)}
                              >
                                <Heart className={`h-3 w-3 ${comment.userLiked ? "fill-current" : ""}`} />
                                <span>{comment.likes}</span>
                              </button>
                            </div>
                            <p className="text-sm text-white/90">{comment.message}</p>
                          </div>
                        ))}

                        {/* Add Comment Input */}
                        <div className="flex gap-3 mt-4">
                          <Avatar className="h-8 w-8 flex-shrink-0">
                            <AvatarFallback className="bg-purple-700 text-white text-sm">
                              {user?.username.charAt(0) || "U"}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 flex gap-2">
                            <Input
                              placeholder="Write a thoughtful reply..."
                              value={newComments[post.id] || ""}
                              onChange={(e) =>
                                setNewComments({ ...newComments, [post.id]: e.target.value })
                              }
                              className="flex-1 bg-white/10 text-white border border-white/20 placeholder-white/60"
                              onKeyPress={(e) => {
                                if (e.key === "Enter") {
                                  handleAddComment(post.id);
                                }
                              }}
                            />
                            <Button
                              size="sm"
                              onClick={() => handleAddComment(post.id)}
                              className="bg-green-700 text-white hover:bg-green-800"
                            >
                              <Send className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Community;
