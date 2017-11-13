import {MigrationInterface, QueryRunner} from 'typeorm';

export class ProductDescription1510414907515 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "public"."product" ADD "description" character varying NOT NULL DEFAULT ''`);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "public"."product" DROP "description"`);
    }

}
