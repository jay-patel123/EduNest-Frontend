import React from "react"

const ForumActivity = () => {
  const forumPosts = []

  return (
    <div className="dashboard-card forum-activity">
      <div className="card-header">
        <h3>Forum Activity</h3>
        <button className="view-all-btn">View all</button>
      </div>
      <div className="forum-list">
        {forumPosts.map((post, index) => (
          <div key={index} className="forum-item">
            <img src={post.avatar || "/placeholder.svg"} alt={post.user} className="user-avatar" />
            <div className="forum-content">
              <h4>{post.title}</h4>
              <p>
                Posted by {post.user} • {post.time}
              </p>
            </div>
            <div className="forum-replies">{post.replies} replies</div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ForumActivity

