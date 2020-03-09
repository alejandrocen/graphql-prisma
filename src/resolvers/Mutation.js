import * as uuid from 'uuid'

const Mutation = {
  createUser: (parent, args, { db }, info) => {
    const userData = { ...args.data }
    const emailTaken = db.users.some(user => user.email === userData.email)

    if (emailTaken) throw new Error('Email taken.')

    const newUser = { id: uuid.v4(), ...userData }
    db.users.push(newUser)

    return newUser
  },
  updateUser: (parent, args, { db }, info) => {
    const { id, data } = args
    const user = db.users.find(user => user.id === id)

    if (!user) throw new Error('User not found.')

    if (typeof data.email === 'string') {
      const emailTaken = db.users.some(user => user.email === data.email)

      if (emailTaken) throw new Error('Email taken.')

      user.email = data.email
    }

    if (typeof data.name === 'string') user.name = data.name
    if (typeof data.age !== 'undefined') user.age = data.age

    return user
  },
  deleteUser: (parent, args, { db }, info) => {
    const { id } = args
    const userIndex = db.users.findIndex(user => user.id === id)

    if (userIndex === -1) throw new Error('User not found.')

    const [userDeleted] = db.users.slice(userIndex, userIndex + 1)

    db.posts = db.posts.filter(post => {
      const isMatch = post.authorId === id

      if (isMatch) {
        db.comments = db.comments.filter(comment => comment.postId !== post.id)
      }

      return !isMatch
    })

    db.comments = db.comments.filter(comment => comment.authorId !== id)

    return userDeleted
  },
  createPost: (parent, args, { db, pubsub }, info) => {
    const postData = { ...args.data }
    const existUser = db.users.some(user => user.id === postData.authorId)

    if (!existUser) throw new Error('User not found.')

    const newPost = { id: uuid.v4(), ...postData }
    db.posts.push(newPost)

    if (newPost.isPublished) {
      pubsub.publish('post', {
        post: { mutation: 'CREATED', data: newPost }
      })
    }

    return newPost
  },
  updatePost: (parent, args, { db, pubsub }, info) => {
    const { id, data } = args
    const post = db.posts.find(post => post.id === id)
    const originalPost = { ...post }

    if (!post) throw new Error('Post not found')
    if (typeof data.title === 'string') post.title = data.title
    if (typeof data.body === 'string') post.body = data.body
    if (typeof data.isPublished === 'boolean') {
      post.isPublished = data.isPublished

      if (originalPost.isPublished && !post.isPublished) {
        pubsub.publish('post', {
          post: { mutation: 'DELETED', data: originalPost }
        })
      }

      if (!originalPost.isPublished && post.isPublished) {
        pubsub.publish('post', {
          post: { mutation: 'CREATED', data: post }
        })
      }
    } else if (post.isPublished) {
      pubsub.publish('post', {
        post: { mutation: 'UPDATED', data: post }
      })
    }

    return post
  },
  deletePost: (parent, args, { db, pubsub }, info) => {
    const { id } = args
    const postIndex = db.posts.findIndex(post => post.id === id)

    if (postIndex === -1) throw new Error('Post not found.')

    const [postDeleted] = db.posts.slice(postIndex, postIndex + 1)

    db.comments = db.comments.filter(comment => comment.postId !== id)

    if (postDeleted.isPublished) {
      pubsub.publish('post', {
        post: { mutation: 'DELETED', data: postDeleted }
      })
    }

    return postDeleted
  },
  createComment: (parent, args, { db, pubsub }, info) => {
    const commentData = { ...args.data }
    const existUser = db.users.some(user => user.id === commentData.authorId)
    const existPost = db.posts.some(
      post => post.id === commentData.postId && post.isPublished
    )

    if (!existUser || !existPost) {
      throw new Error('Unable to find user and post.')
    }

    const newComment = { id: uuid.v4(), ...commentData }
    db.comments.push(newComment)
    pubsub.publish(`comment ${newComment.postId}`, {
      comment: { mutation: 'CREATED', data: newComment }
    })

    return newComment
  },
  updateComment: (parent, args, { db, pubsub }, info) => {
    const { id, data } = args
    const comment = db.comments.find(comment => comment.id === id)

    if (!comment) throw new Error('Comment not found')
    if (typeof data.text === 'string') comment.text = data.text

    pubsub.publish(`comment ${comment.postId}`, {
      comment: { mutation: 'UPDATED', data: comment }
    })

    return comment
  },
  deleteComment: (parent, args, { db, pubsub }, info) => {
    const { id } = args
    const commentIndex = db.comments.findIndex(comment => comment.id === id)

    if (commentIndex === -1) throw new Error('Comment not found')

    const [commentDeleted] = db.comments.slice(commentIndex, commentIndex + 1)
    pubsub.publish(`comment ${commentDeleted.postId}`, {
      comment: { mutation: 'DELETED', data: commentDeleted }
    })

    return commentDeleted
  }
}

export { Mutation as default }
