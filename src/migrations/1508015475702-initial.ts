import {MigrationInterface, QueryRunner} from 'typeorm';

export class Initial1508015475702 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query('CREATE EXTENSION IF NOT EXISTS pgcrypto');
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
    }

}
