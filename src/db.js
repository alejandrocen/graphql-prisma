const users = [
  {
    id: '1',
    name: 'Alejandro Cen',
    email: 'alex96.cen@gmail.com',
    age: 23
  },
  {
    id: '2',
    name: 'Rosalin Victoria',
    email: 'arosalinvictoria@gmail.com',
    age: null
  }
]

const posts = [
  {
    id: '1',
    title: 'Ruby',
    body: 'Bundler...',
    isPublished: true,
    authorId: '1'
  },
  {
    id: '2',
    title: 'Python',
    body: 'Pip...',
    isPublished: true,
    authorId: '1'
  },
  {
    id: '3',
    title: 'JS',
    body: 'Npm...',
    isPublished: false,
    authorId: '2'
  }
]

const comments = [
  { id: '1', text: 'First comment', authorId: '1', postId: '1' },
  { id: '2', text: 'Second comment', authorId: '1', postId: '1' },
  { id: '3', text: 'xd', authorId: '2', postId: '2' },
  { id: '4', text: 'Awesome', authorId: '2', postId: '3' }
]

const db = {
  users,
  posts,
  comments
}

export { db as default }
