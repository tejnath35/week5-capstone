import { useParams, useLocation, useNavigate } from "react-router";
import { useEffect, useState } from "react";
import axios from 'axios';
import { useAuth } from "../Rstore/authStore";
import { API_URL } from '../utils/api';

function ArticleByID() {

  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const user = useAuth((state) => state.currentUser);

  const [article, setArticle] = useState(location.state || null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [newComment, setNewComment] = useState("");
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyText, setReplyText] = useState("");
  const [expandedReplies, setExpandedReplies] = useState({});
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editCommentText, setEditCommentText] = useState("");

  //fetch article to get latest likes/comments
  useEffect(() => {
    const getArticle = async () => {
      setLoading(true);

      try {
        const res = await axios.get(`${API_URL}/user-api/article/${id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
          withCredentials: true
        });

        setArticle(res.data.payload);
      } catch (err) {
        setError(err.response?.data?.error);
      } finally {
        setLoading(false);
      }
    };

    getArticle();
  }, [id]);

  // format date
  const formatDate = (date) => {
    return new Date(date).toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata",
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  //  DELETE (soft delete)
  const deleteArticle = async () => {
    try {
      const res = await axios.patch(`${API_URL}/author-api/articles/${id}/status`,
        { isArticleActive: false },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
          withCredentials: true
        }
      );

      setArticle(res.data.payload); 
    } catch (err) {
      setError(err.response?.data?.error);
    }
  };

  // RESTORE
  const restoreArticle = async () => {
    try {
      const res = await axios.patch(`${API_URL}/author-api/articles/${id}/status`,
        { isArticleActive: true },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
          withCredentials: true
        }
      );

      setArticle(res.data.payload);
    } catch (err) {
      setError(err.response?.data?.error);
    }
  };

  //EDIT
  const editArticle = (articleObj) => {
    navigate(`/edit-article/${articleObj._id}`, { state: articleObj });
  };

  // LIKE
  const handleLike = async () => {
    try {
      const res = await axios.post(`${API_URL}/user-api/articles/${id}/like`, {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        withCredentials: true
      });
      // the endpoint might not populate the author and comments fully, 
      // but it will return the updated arrays for likes/dislikes.
      setArticle(prev => ({ ...prev, likes: res.data.payload.likes, dislikes: res.data.payload.dislikes }));
    } catch (err) {
      setError(err.response?.data?.message || "Failed to like");
    }
  };

  // DISLIKE
  const handleDislike = async () => {
    try {
      const res = await axios.post(`${API_URL}/user-api/articles/${id}/dislike`, {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        withCredentials: true
      });
      setArticle(prev => ({ ...prev, likes: res.data.payload.likes, dislikes: res.data.payload.dislikes }));
    } catch (err) {
      setError(err.response?.data?.message || "Failed to dislike");
    }
  };

  // ADD COMMENT
  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    
    try {
      await axios.post(`${API_URL}/user-api/articles/${id}/comments`, { comment: newComment }, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        withCredentials: true
      });
      setNewComment("");
      // re-fetch article to get the populated comment
      const res = await axios.get(`${API_URL}/user-api/article/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        withCredentials: true
      });
      setArticle(res.data.payload);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add comment");
    }
  };

  // DELETE COMMENT
  const handleDeleteComment = async (commentId) => {
    try {
      await axios.delete(`${API_URL}/user-api/articles/${id}/comments/${commentId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        withCredentials: true
      });
      // remove from local state for quick update
      setArticle(prev => ({
        ...prev,
        comments: prev.comments.filter(c => c._id !== commentId)
      }));
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete comment");
    }
  };

  // EDIT COMMENT
  const handleEditComment = async (e, commentId) => {
    e.preventDefault();
    if (!editCommentText.trim()) return;
    
    try {
      await axios.put(`${API_URL}/user-api/articles/${id}/comments/${commentId}`, { comment: editCommentText }, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        withCredentials: true
      });
      setEditingCommentId(null);
      setEditCommentText("");
      // re-fetch article to get the updated comment
      const res = await axios.get(`${API_URL}/user-api/article/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        withCredentials: true
      });
      setArticle(res.data.payload);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to edit comment");
    }
  };

  // ADD REPLY
  const handleAddReply = async (e, commentId) => {
    e.preventDefault();
    if (!replyText.trim()) return;
    
    try {
      await axios.post(`${API_URL}/user-api/articles/${id}/comments/${commentId}/reply`, { comment: replyText }, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        withCredentials: true
      });
      setReplyText("");
      setReplyingTo(null);
      // re-fetch article to get the populated replies
      const res = await axios.get(`${API_URL}/user-api/article/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        withCredentials: true
      });
      setArticle(res.data.payload);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add reply");
    }
  };

  // COMMENT LIKE
  const handleCommentLike = async (commentId) => {
    try {
      const res = await axios.post(`${API_URL}/user-api/articles/${id}/comments/${commentId}/like`, {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        withCredentials: true
      });
      setArticle(res.data.payload);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to like comment");
    }
  };

  // COMMENT DISLIKE
  const handleCommentDislike = async (commentId) => {
    try {
      const res = await axios.post(`${API_URL}/user-api/articles/${id}/comments/${commentId}/dislike`, {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        withCredentials: true
      });
      setArticle(res.data.payload);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to dislike comment");
    }
  };


  // loading
  if (loading) {
    return (
      <p className="text-center text-lg font-semibold text-gray-600 mt-20">
        Loading article...
      </p>
    );
  }

  //  error
  if (error) {
    return <p className="text-center text-red-500 mt-20">{error}</p>;
  }

  if (!article) return null;

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">

      {/*Deleted Banner */}
      {!article.isArticleActive && (
        <div className="mb-6 p-3 bg-red-100 text-red-600 rounded-lg text-center font-medium">
          This article is deleted
        </div>
      )}

      {/* Header */}
      <div className="mb-8 border-b pb-6">
        <span className="text-sm font-semibold text-violet-600 uppercase">
          {article.category}
        </span>

        <h1 className="text-3xl font-bold text-gray-900 mt-2 uppercase">
          {article.title}
        </h1>

        <div className="flex justify-between items-center text-sm text-gray-500 mt-3">
          <div>✍️ {article.author?.firstName || "Author"}</div>
          <div>{formatDate(article.createdAt)}</div>
        </div>
      </div>

      {/* Content */}
      <div className="text-gray-700 leading-relaxed whitespace-pre-line wrap-break-word mb-10">
        {article.content}
      </div>

      {/* AUTHOR ACTIONS */}
      {user?.role === "AUTHOR" && (
        <div className="flex gap-4 mb-6">

          {article.isArticleActive ? (
            <>
              {/* Edit */}
              <button
                className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition"
                onClick={() => editArticle(article)}
              >
                Edit
              </button>

              {/* Delete */}
              <button
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                onClick={deleteArticle}
              >
                Delete
              </button>
            </>
          ) : (
            <>
              {/* Deleted Label */}
              <span className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg">
                Deleted
              </span>

              {/* Restore */}
              <button
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                onClick={restoreArticle}
              >
                Restore
              </button>
            </>
          )}

        </div>
      )}

      {/* Interactions (Like/Dislike) */}
      <div className="flex items-center gap-6 mb-8 pb-6 border-b border-gray-200">
        <button 
          onClick={handleLike}
          className={`flex items-center gap-2 px-4 py-2 rounded-full transition-colors ${article.likes?.includes(user?._id) ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
        >
          <span className="text-xl">👍</span>
          <span className="font-semibold">{article.likes?.length || 0}</span>
        </button>
        <button 
          onClick={handleDislike}
          className={`flex items-center gap-2 px-4 py-2 rounded-full transition-colors ${article.dislikes?.includes(user?._id) ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
        >
          <span className="text-xl">👎</span>
          <span className="font-semibold">{article.dislikes?.length || 0}</span>
        </button>
      </div>

      {/* Comments Section */}
      <div className="mb-10">
        <h3 className="text-2xl font-bold text-gray-900 mb-6">Comments ({article.comments?.length || 0})</h3>
        
        {/* Comment Form */}
        {user ? (
          <form onSubmit={handleAddComment} className="mb-8">
            <textarea
              className="w-full border border-gray-300 rounded-lg p-4 focus:outline-none focus:ring-2 focus:ring-violet-500 resize-none"
              rows="3"
              placeholder="Add a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              required
            ></textarea>
            <div className="flex justify-end mt-2">
              <button 
                type="submit" 
                className="bg-violet-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-violet-700 transition"
              >
                Post Comment
              </button>
            </div>
          </form>
        ) : (
          <div className="bg-gray-50 p-4 rounded-lg mb-8 text-center text-gray-600">
            Please log in to add a comment.
          </div>
        )}

        {/* Comments List */}
        <div className="space-y-6">
          {article.comments && article.comments.length > 0 ? (
            [...article.comments].reverse().map((c) => (
              <div key={c._id} className="bg-gray-50 p-5 rounded-xl border border-gray-100 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-violet-200 flex items-center justify-center text-violet-700 font-bold">
                      {c.user?.firstName?.charAt(0) || "U"}
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">
                        {c.user?.firstName || "Unknown User"} {c.user?.lastName || ""}
                      </div>
                    </div>
                  </div>
                  {user && (user._id === c.user?._id || user._id === article.author?._id) && (
                    <div className="flex gap-2">
                      {user._id === c.user?._id && (
                        <button 
                          onClick={() => {
                            setEditingCommentId(c._id);
                            setEditCommentText(c.comment);
                          }}
                          className="text-blue-500 text-sm font-medium hover:text-blue-700 transition"
                        >
                          Edit
                        </button>
                      )}
                      <button 
                        onClick={() => handleDeleteComment(c._id)}
                        className="text-red-500 text-sm font-medium hover:text-red-700 transition"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
                
                {/* Editing vs Displaying Comment */}
                {editingCommentId === c._id ? (
                  <form onSubmit={(e) => handleEditComment(e, c._id)} className="mb-4">
                    <textarea 
                      className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-violet-500 resize-none text-sm"
                      rows="2"
                      value={editCommentText}
                      onChange={(e) => setEditCommentText(e.target.value)}
                      required
                      autoFocus
                    ></textarea>
                    <div className="flex justify-end gap-2 mt-2">
                      <button 
                        type="button" 
                        onClick={() => setEditingCommentId(null)}
                        className="text-gray-500 text-sm font-medium hover:text-gray-700 transition"
                      >
                        Cancel
                      </button>
                      <button 
                        type="submit" 
                        className="bg-blue-600 text-white px-4 py-1 rounded text-sm font-medium hover:bg-blue-700 transition"
                      >
                        Save
                      </button>
                    </div>
                  </form>
                ) : (
                  <p className="text-gray-700 mb-4">{c.comment}</p>
                )}
                
                {/* Comment Actions: Like, Dislike, Reply, Toggle Replies */}
                <div className="flex items-center gap-4 mb-2">
                  <button 
                    onClick={() => handleCommentLike(c._id)}
                    className={`flex items-center gap-1 text-xs px-2 py-1 rounded transition-colors ${c.likes?.includes(user?._id) ? 'bg-blue-100 text-blue-700' : 'text-gray-500 hover:bg-gray-100'}`}
                  >
                    <span>👍</span>
                    <span>{c.likes?.length || 0}</span>
                  </button>
                  <button 
                    onClick={() => handleCommentDislike(c._id)}
                    className={`flex items-center gap-1 text-xs px-2 py-1 rounded transition-colors ${c.dislikes?.includes(user?._id) ? 'bg-red-100 text-red-700' : 'text-gray-500 hover:bg-gray-100'}`}
                  >
                    <span>👎</span>
                    <span>{c.dislikes?.length || 0}</span>
                  </button>

                  {user && (
                    <button 
                      onClick={() => {
                        setReplyingTo(replyingTo === c._id ? null : c._id);
                        setReplyText("");
                      }}
                      className="text-violet-600 text-xs font-medium hover:text-violet-800 transition"
                    >
                      {replyingTo === c._id ? "Cancel Reply" : "Reply"}
                    </button>
                  )}

                  {c.replies && c.replies.length > 0 && (
                    <button
                      onClick={() => setExpandedReplies(prev => ({ ...prev, [c._id]: !prev[c._id] }))}
                      className="text-gray-500 text-xs font-medium hover:text-gray-700 transition ml-auto"
                    >
                      {expandedReplies[c._id] ? "Hide Replies" : `View Replies (${c.replies.length})`}
                    </button>
                  )}
                </div>

                {/* Reply Input Form */}
                {replyingTo === c._id && (
                  <form onSubmit={(e) => handleAddReply(e, c._id)} className="mt-4 flex gap-2">
                    <input 
                      type="text" 
                      className="grow border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-violet-500 text-sm"
                      placeholder="Write a reply..."
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      required
                      autoFocus
                    />
                    <button 
                      type="submit"
                      className="bg-violet-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-violet-700 transition"
                    >
                      Post
                    </button>
                  </form>
                )}

                {/* Replies List */}
                {expandedReplies[c._id] && c.replies && c.replies.length > 0 && (
                  <div className="mt-4 pl-4 border-l-2 border-gray-200 space-y-4">
                    {c.replies.map((reply) => (
                      <div key={reply._id} className="bg-white p-3 rounded-lg border border-gray-100 shadow-sm">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-xs">
                            {reply.user?.firstName?.charAt(0) || "U"}
                          </div>
                          <div className="font-semibold text-gray-800 text-sm">
                            {reply.user?.firstName || "Unknown User"} {reply.user?.lastName || ""}
                          </div>
                        </div>
                        <p className="text-gray-600 text-sm pl-8">{reply.comment}</p>
                      </div>
                    ))}
                  </div>
                )}

              </div>
            ))
          ) : (
            <p className="text-gray-500 italic">No comments yet. Be the first to share your thoughts!</p>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="text-sm text-gray-400 border-t pt-4 text-center">
        Last updated: {formatDate(article.updatedAt)}
      </div>

    </div>
  );
}

export default ArticleByID;