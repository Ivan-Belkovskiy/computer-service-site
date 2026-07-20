import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import { writeFile, writeFileSync } from "fs";
import path from "path";
import { Pool } from "pg";

const globalForPrisma = global as unknown as { prisma: PrismaClient };

const prismaClientSingleton = () => {
    // const pool = new Pool({
    //     connectionString: process.env.DATABASE_URL,
    //     ssl: {
    //         rejectUnauthorized: false
    //     }
    // });

    // const adapter = new PrismaPg(pool);
    // const adapter = new PrismaMariaDb({
    //     database: "computer_service_site_db",
    //     host: "127.0.0.1",
    //     port: 3306,
    //     // port: Number(process.env.DB_MYSQL_PORT),
    //     user: "root",
    //     password: "",
    //     // password:  process.env.DB_MYSQL_PASS,
    //     // connectionLimit: 5,
    //     ssl: true
    // });
    const adapter = new PrismaMariaDb('mysql://root:Dragon851171!@localhost:3306/computer_service_site_db');

    // writeFileSync(path.join(process.cwd(), 'log.txt'), String(process.env.DATABASE_URL))

    return new PrismaClient({ adapter });
}

export const prisma = globalForPrisma.prisma || prismaClientSingleton();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;