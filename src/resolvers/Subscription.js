const Subscription = {
  comment: {
    subscribe: (parent, { postId }, { db, pubsub }, info) => {
      const post = db.posts.find(post => post.id === postId && post.isPublished)

      if (!post) throw new Error('Post not found.')

      return pubsub.asyncIterator(`comment ${post.id}`)
    }
  },
  post: {
    subscribe: (parent, args, { pubsub }, info) => pubsub.asyncIterator('post')
  }
}

export { Subscription as default }
