const path = require('path')
const fs = require('fs')
const mysql = require('mysql2/promise');
const db = require('../config/db')
require('dotenv').config();

const DB_NAME = process.env.DB_NAME;

async function runMigrations() {
    const migrationDir = path.join(__dirname, '..', 'migrations');

    const files = fs.readdirSync(migrationDir)
        .filter(f => f.endsWith('.sql'))
        .sort();

    for (const file of files) {
        const sql = fs.readFileSync(path.join(migrationDir, file), 'utf8');
        console.log(`Running migration: ${file}`);

        try {
            await db.query(sql);
            console.log(`Migration ${file} applied successfully`);
        } catch (err) {
            console.error(`Migration ${file} failed:`, err);
            process.exit(1);
        }
    }

    console.log('All migrations completed.');
}

async function refreshDB() {
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        multipleStatements: true
    });

    console.log('Dropping database if exists...');
    await connection.query(`DROP DATABASE IF EXISTS \`${DB_NAME}\``);

    console.log('Creating database...');
    await connection.query(`CREATE DATABASE \`${DB_NAME}\``);

    console.log('Using database...');
    await connection.query(`USE \`${DB_NAME}\``);

    await runMigrations()

    console.log('Database refreshed successfully!');

    await connection.end();
    process.exit(0);
}

refreshDB().catch(err => {
    console.error('Error refreshing database:', err);
});
