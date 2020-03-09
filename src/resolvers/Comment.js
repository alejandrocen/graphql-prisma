const Comment = {
  author: ({ authorId }, args, { db }) =>
    db.users.find(user => user.id === authorId),
  post: ({ postId }, args, { db }) => db.posts.find(post => post.id === postId)
}

export { Comment as default }
