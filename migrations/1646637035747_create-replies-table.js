/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
    pgm.createTable('replies', {
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
        content: {
            type: 'TEXT',
            notNull: true,
        },
        date: {
            type: 'TEXT',
            notNull: true
        },
        owner: {
            type: 'VARCHAR(50)',
            notNull: true
        },
        is_delete: {
            type: 'BOOLEAN',
            default: false,
            notNull: true,
        }
    });

    pgm.addConstraint(
        'replies',
        'fk_replies.owner_users.id',
        'FOREIGN KEY(owner) REFERENCES users(id) on UPDATE CASCADE'
    );

    pgm.addConstraint(
        'replies',
        'fk_replies.comment_id_threads.id',
        'FOREIGN KEY(comment_id) REFERENCES comments(id) ON UPDATE CASCADE'
    );

    pgm.addConstraint(
        'replies',
        'fk_replies.thread_id_threads.id',
        'FOREIGN KEY(thread_id) REFERENCES threads(id) ON UPDATE CASCADE'
    );

};

exports.down = (pgm) => {
    pgm.dropTable('replies');
};
