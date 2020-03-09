const User = {
  posts: ({ id }, args, { db }) =>
    db.posts.filter(post => post.authorId === id),
  comments: ({ id }, args, { db }) =>
    db.comments.filter(comment => comment.authorId === id)
}

export { User as default }
