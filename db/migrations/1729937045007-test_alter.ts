import { MigrationInterface, QueryRunner } from "typeorm";

export class TestAlter1729937045007 implements MigrationInterface {
    name = 'TestAlter1729937045007'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`posts\` DROP FOREIGN KEY \`posts_ibfk_1\``);
        await queryRunner.query(`ALTER TABLE \`posts\` DROP FOREIGN KEY \`posts_ibfk_2\``);
        await queryRunner.query(`DROP INDEX \`username\` ON \`users\``);
        await queryRunner.query(`DROP INDEX \`email\` ON \`users\``);
        await queryRunner.query(`DROP INDEX \`name\` ON \`categories\``);
        await queryRunner.query(`DROP INDEX \`author_id\` ON \`posts\``);
        await queryRunner.query(`DROP INDEX \`idx_post_title\` ON \`posts\``);
        await queryRunner.query(`DROP INDEX \`idx_post_category\` ON \`posts\``);
        await queryRunner.query(`ALTER TABLE \`users\` ADD \`refresh_token\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)`);
        await queryRunner.query(`ALTER TABLE \`users\` ADD \`token_create_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)`);
        await queryRunner.query(`ALTER TABLE \`users\` ADD \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)`);
        await queryRunner.query(`ALTER TABLE \`users\` ADD UNIQUE INDEX \`IDX_fe0bb3f6520ee0469504521e71\` (\`username\`)`);
        await queryRunner.query(`ALTER TABLE \`users\` ADD UNIQUE INDEX \`IDX_97672ac88f789774dd47f7c8be\` (\`email\`)`);
        await queryRunner.query(`ALTER TABLE \`users\` CHANGE \`avatar\` \`avatar\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`users\` CHANGE \`role\` \`role\` enum ('admin', 'user') NOT NULL DEFAULT 'user'`);
        await queryRunner.query(`ALTER TABLE \`users\` CHANGE \`created_at\` \`created_at\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE \`categories\` ADD UNIQUE INDEX \`IDX_8b0be371d28245da6e4f4b6187\` (\`name\`)`);
        await queryRunner.query(`ALTER TABLE \`posts\` CHANGE \`image_path\` \`image_path\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`posts\` CHANGE \`created_at\` \`created_at\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE \`posts\` CHANGE \`updated_at\` \`updated_at\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE \`posts\` CHANGE \`category_id\` \`category_id\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`posts\` CHANGE \`status\` \`status\` enum ('public', 'hidden') NOT NULL DEFAULT 'public'`);
        await queryRunner.query(`ALTER TABLE \`posts\` ADD CONSTRAINT \`FK_312c63be865c81b922e39c2475e\` FOREIGN KEY (\`author_id\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`posts\` ADD CONSTRAINT \`FK_852f266adc5d67c40405c887b49\` FOREIGN KEY (\`category_id\`) REFERENCES \`categories\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`posts\` DROP FOREIGN KEY \`FK_852f266adc5d67c40405c887b49\``);
        await queryRunner.query(`ALTER TABLE \`posts\` DROP FOREIGN KEY \`FK_312c63be865c81b922e39c2475e\``);
        await queryRunner.query(`ALTER TABLE \`posts\` CHANGE \`status\` \`status\` enum ('public', 'hidden') NULL DEFAULT ''public''`);
        await queryRunner.query(`ALTER TABLE \`posts\` CHANGE \`category_id\` \`category_id\` int NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`posts\` CHANGE \`updated_at\` \`updated_at\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP() ON UPDATE CURRENT_TIMESTAMP()`);
        await queryRunner.query(`ALTER TABLE \`posts\` CHANGE \`created_at\` \`created_at\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP()`);
        await queryRunner.query(`ALTER TABLE \`posts\` CHANGE \`image_path\` \`image_path\` varchar(255) NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`categories\` DROP INDEX \`IDX_8b0be371d28245da6e4f4b6187\``);
        await queryRunner.query(`ALTER TABLE \`users\` CHANGE \`created_at\` \`created_at\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP()`);
        await queryRunner.query(`ALTER TABLE \`users\` CHANGE \`role\` \`role\` enum ('admin', 'user') NULL DEFAULT ''user''`);
        await queryRunner.query(`ALTER TABLE \`users\` CHANGE \`avatar\` \`avatar\` varchar(255) NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`users\` DROP INDEX \`IDX_97672ac88f789774dd47f7c8be\``);
        await queryRunner.query(`ALTER TABLE \`users\` DROP INDEX \`IDX_fe0bb3f6520ee0469504521e71\``);
        await queryRunner.query(`ALTER TABLE \`users\` DROP COLUMN \`updated_at\``);
        await queryRunner.query(`ALTER TABLE \`users\` DROP COLUMN \`token_create_at\``);
        await queryRunner.query(`ALTER TABLE \`users\` DROP COLUMN \`refresh_token\``);
        await queryRunner.query(`CREATE INDEX \`idx_post_category\` ON \`posts\` (\`category_id\`)`);
        await queryRunner.query(`CREATE INDEX \`idx_post_title\` ON \`posts\` (\`title\`)`);
        await queryRunner.query(`CREATE INDEX \`author_id\` ON \`posts\` (\`author_id\`)`);
        await queryRunner.query(`CREATE UNIQUE INDEX \`name\` ON \`categories\` (\`name\`)`);
        await queryRunner.query(`CREATE UNIQUE INDEX \`email\` ON \`users\` (\`email\`)`);
        await queryRunner.query(`CREATE UNIQUE INDEX \`username\` ON \`users\` (\`username\`)`);
        await queryRunner.query(`ALTER TABLE \`posts\` ADD CONSTRAINT \`posts_ibfk_2\` FOREIGN KEY (\`category_id\`) REFERENCES \`categories\`(\`id\`) ON DELETE RESTRICT ON UPDATE RESTRICT`);
        await queryRunner.query(`ALTER TABLE \`posts\` ADD CONSTRAINT \`posts_ibfk_1\` FOREIGN KEY (\`author_id\`) REFERENCES \`users\`(\`id\`) ON DELETE RESTRICT ON UPDATE RESTRICT`);
    }

}
