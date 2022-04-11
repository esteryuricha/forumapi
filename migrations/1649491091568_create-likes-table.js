/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
    pgm.createTable('likes', {
        id: {
            type: 'VARCHAR(50)',
            primaryKey: true
        },
        thread_id: {
            type: 'VARCHAR(50)',
            notNull: true
        },
        comment_id: {
            type: 'VARCHAR(50)',
            notNull: true,
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
            notNull: true,
        }
    });

    pgm.addConstraint(
        'likes',
        'fk_likes.thread_id_threads.id',
        'FOREIGN KEY(thread_id) REFERENCES threads(id) ON UPDATE CASCADE'
    );

    pgm.addConstraint(
        'likes',
        'fk_likes.comment_id_comments.id',
        'FOREIGN KEY(comment_id) REFERENCES comments(id) ON UPDATE CASCADE'
    );

    pgm.addConstraint(
        'likes',
        'fk_likes.owner_users.id',
        'FOREIGN KEY(owner) REFERENCES users(id) on UPDATE CASCADE'
    );
};

exports.down = (pgm) => {
    pgm.dropTable('likes');
};
