const Post = {
  author: ({ authorId }, args, { db }) =>
    db.users.find(user => user.id === authorId),
  comments: ({ id }, args, { db }) =>
    db.comments.filter(comment => comment.postId === id)
}

export { Post as default }
