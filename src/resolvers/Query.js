import getUserId from '../utils/getUserId';

const Query = {
    
    users(parent, args, {prisma}, info){
        // arguments passed into the query
        const opArgs = {
            first: args.first,
            skip: args.skip,
            after: args.after,
            orderBy: args.orderBy
        };
        // if we have a query --> eg: all users with name containing "d"
        if(args.query){
            opArgs.where = {
                OR: [{
                    name_contains: args.query
                }]
            }
        }

        return prisma.query.users(opArgs, info);
    },

    comments(parent, args, {prisma}, info){
        const opArgs = {
            first: args.first,
            skip: args.skip,
            after: args.after,
            orderBy: args.orderBy
        };

        return prisma.query.comments(opArgs, info);
    },

    clubs(parent, args, {prisma}, info){
        const opArgs = {
            first: args.first,
            skip: args.skip,
            after: args.after,
            orderBy: args.orderBy
        };
        //console.log("hello");
        return prisma.query.clubs(opArgs, info);
    },

    me(parent, args, {prisma, request}, info){
        const userId = getUserId(request);
    
        return prisma.query.user({
            where: {
                id: userId
            }
        })
    },

    club(parent, args, {prisma}, info){
       return prisma.query.club({
           where: {
               id: args.id
           }
       });
    }
};

export { Query as default }