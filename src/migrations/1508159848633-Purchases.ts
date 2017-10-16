import {MigrationInterface, QueryRunner} from 'typeorm';

export class Purchases1508159848633 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`CREATE TABLE "purchase" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "products" jsonb NOT NULL, "total" numeric(12,2) NOT NULL, "userId" uuid, PRIMARY KEY("id"))`);
        await queryRunner.query(`ALTER TABLE "purchase" ADD CONSTRAINT "fk_6a6b208e8cd4c1b7a4f58655b31" FOREIGN KEY ("userId") REFERENCES "user"("id")`);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "purchase" DROP CONSTRAINT "fk_6a6b208e8cd4c1b7a4f58655b31"`);
        await queryRunner.query(`DROP TABLE "purchase"`);
    }

}
