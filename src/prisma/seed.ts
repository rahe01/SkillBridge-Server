import { prisma } from "../lib/prisma";



async function main() {

    const categories = ["Math", "Science", "History", "Literature", "Art", "Music", "Programming", "Languages"];

    for (const name of categories){

        await prisma.category.upsert({
            where: {name},
            update: {},
            create:{name}
        })
    }
    
    console.log("categories seedes");
}

main()
    .catch((e) => console.log(e))
    .finally(async () =>{
        await prisma.$disconnect();
    })