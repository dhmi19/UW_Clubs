import bcrypt from 'bcryptjs';
import getUserId from '../utils/getUserId';
import generateToken from '../utils/generateToken';
import hashPassword from '../utils/hashPassword';


const Mutation = {

    async createUser(parent, args, {prisma}, info){
        const password = await hashPassword(args.data.password);
        const user = await prisma.mutation.createUser({
            data: {
                ...args.data,
                password,
                clubs: {
                    connect: []
                },
                comments: {
                    connect: []
                }
            }
        });

        return {
            user,
            token: generateToken(user.id)
        };
    },

    async login(parent, args, {prisma}, info){
        const user = await prisma.query.user({
            where: {
                email: args.data.email
            }
        });

        if(!user){
            throw new Error("Unable to login");
        }

        const matchPassword = await bcrypt.compare(args.data.password, user.password);

        if(!matchPassword){
            throw new Error("Invalid password");
        }

        return{
            user,
            token: generateToken(user.id)
        };
    },

    async deleteUser(parent, args, { prisma, request }, info) {
        const userId = getUserId(request);

        return prisma.mutation.deleteUser({
            where: {
                id: userId
            }
        }, info);
    },

    async updateUser(parent, args, { prisma, request }, info) {
        const userId = getUserId(request);

        if (typeof args.data.password === 'string') {
            args.data.password = await hashPassword(args.data.password);
        }

        return prisma.mutation.updateUser({
            where: {
                id: userId
            },
            data: args.data
        }, info);
    },

    async createClub(parent, args, { prisma, request }, info){
        const userId = getUserId(request);

        return prisma.mutation.createClub({
            data: {
                ...args.data,
                rating: 0,
                founder: {
                    connect: {
                      id: userId
                    }
                }
            }
        }, info);
    },

    async deleteClub(parent, args, { prisma, request }, info) {
        const userId = getUserId(request);

        //Check if a club exists by this author
        const clubExists = await prisma.exists.clubs({
            id: args.id,
            author: {
                id: userId
            }
        });

        if (!postExists) {
            throw new Error('Unable to delete club')
        }
        
        return prisma.mutation.deleteClub({
            where: {
                id: args.id
            }
        }, info);
    },

    async updateClub(parent, args, { prisma, request }, info){
        const userId = getUserId(request);
        const clubExists = await prisma.exists.clubs({
            id: args.id,
            author: {
                id: userId
            }
        });

        if(!clubExists){
            throw new Error("Unable to update club");
        }

        return prisma.mutation.updateClub({
            where: {
                id: args.id
            },
            data: args.data
        }, info);
    },

    async createComment(parent, args, {prisma, request}, info){
        const userId = getUserId(request);
        const clubExists = await prisma.exists.Club({
            id: args.data.club
        });

        if(!clubExists){
            throw new Error("Unable to create comment");
        }
        
        // create the comment
        return await prisma.mutation.createComment({
            data:{
                rating: args.data.rating,
                text: args.data.text,
                author: {
                    connect: {
                        id: userId
                    }
                },
                club: {
                    connect: {
                        id: args.data.club
                    }
                }
            }
        }, info);
    },

    async deleteComment(parent, args, {prisma}, info){
        const userId = getUserId(request);
        const commentExists = await prisma.exists.Comment({
            id: args.id,
            author: {
                id: userId
            }
        });

        if (!commentExists) {
            throw new Error('Unable to delete comment')
        }

        return prisma.mutation.deleteComment({
            where: {
                id: args.id
            }
        }, info);
    },
    async updateComment(parent, args, { prisma, request }, info) {
        const userId = getUserId(request)
        const commentExists = await prisma.exists.Comment({
            id: args.id,
            author: {
                id: userId
            }
        })

        if (!commentExists) {
            throw new Error('Unable to update comment')
        }

        return prisma.mutation.updateComment({
            where: {
                id: args.id
            },
            data: args.data
        }, info)
    }
};

export { Mutation as default }