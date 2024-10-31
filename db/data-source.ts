import { DataSourceOptions, DataSource } from "typeorm";

export const dataSourceOptions: DataSourceOptions = {
    type: "mysql",
    host: "localhost",
    port: 3306,
    username: "kawasus",
    password: "elfneverlie",
    database: "dablog",
    entities: ['dist/**/*.entity.js'],
    migrations: ['dist/db/migrations/*.js'],
    //logging: true,
    synchronize: false
}

const dataSource = new DataSource(dataSourceOptions);
export default dataSource;