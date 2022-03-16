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

    pgm.addConstraint(
        'comments',
        'fk_comments.owner_users.id',
        'FOREIGN KEY(owner) REFERENCES users(id) ON UPDATE CASCADE',
    );
    
    pgm.addConstraint(
        'comments',
        'fk_comments.thread_id_threads.id',
        'FOREIGN KEY(thread_id) REFERENCES threads(id) ON UPDATE CASCADE',
    );
};

exports.down = (pgm) => {
    pgm.dropTable('comments');
};
