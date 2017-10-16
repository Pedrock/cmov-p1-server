import {MigrationInterface, QueryRunner} from 'typeorm';

export class PurchaseDate1508187958451 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "public"."purchase" ADD "createdDate" TIMESTAMP NOT NULL DEFAULT now()`);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "public"."purchase" DROP "createdDate"`);
    }

}
