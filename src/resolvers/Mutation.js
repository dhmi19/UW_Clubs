const Mutation = {
    async deleteComment(parent, args, {prisma}, info){
        console.log(args);
        return prisma.mutation.deleteComment({
            where: {
                id: args.id
            }
        });
    }
};

export { Mutation as default }