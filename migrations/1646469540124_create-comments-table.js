/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
    pgm.createTable('comments', {
        id: {
            type: 'VARCHAR(50)',
            primaryKey: true
        },
        thread_id: {
            type: 'VARCHAR(50)',
            notNull: true
        },
        content: {
            type: 'TEXT',
            notNull: true
        },
        owner: {
            type: 'VARCHAR(50)',
            notNull: true
        },
        date: {
            type: 'TEXT',
            notNull: true
        },
        is_delete: {
            type: 'BOOLEAN',
            default: false,
            notNull: true
        }
    });
};

exports.down = (pgm) => {
    pgm.dropTable('comments');
};
