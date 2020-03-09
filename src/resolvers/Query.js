const Query = {
  me: (parent, args, { db }) => db.users[0],
  posts: (parent, { query }, { db }) =>
    !query
      ? db.posts
      : db.posts.filter(
          post =>
            post.title
              .toLocaleLowerCase()
              .includes(query.toLocaleLowerCase()) ||
            post.body.toLocaleLowerCase().includes(query.toLocaleLowerCase())
        ),
  users: (parent, { query }, { db }) =>
    !query
      ? db.users
      : db.users.filter(user =>
          user.name.toLocaleLowerCase().includes(query.toLocaleLowerCase())
        ),
  comments: (parent, args, { db }) => db.comments
}

export { Query as default }
