import bcrypt from 'bcryptjs'
import prisma from '../../src/prisma'

const seedDatabase = async () => {
    await prisma.mutation.deleteManyPosts()
    await prisma.mutation.deleteManyUsers()
    const user = await prisma.mutation.createUser({
        data: {
            name: 'Jen',
            email: 'jen@example.com',
            password: bcrypt.hashSync('hello')
        }
    })
    await prisma.mutation.createClub({
        data: {
            title: 'My first club',
            body: '',
            author: {
                connect: {
                    id: user.id
                }
            }
        }
    })
    await prisma.mutation.createClub({
        data: {
            title: 'My second club',
            body: '',
            author: {
                connect: {
                    id: user.id
                }
            }
        }
    })
}

export { seedDatabase as default }
