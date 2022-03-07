const ReplyRepository = require('../ReplyRepository');

describe('ReplyRepository', () => {
    it('should throw error when invoke unimplemented method', async() => {
        //arrange
        const replyRepository = new ReplyRepository();

        //action and assert
        expect(replyRepository.addReply).rejects.toThrowError('REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED');
        expect(replyRepository.checkReplyById).rejects.toThrowError('REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED');
        expect(replyRepository.checkReplyOwner).rejects.toThrowError('REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED');
        expect(replyRepository.deleteReply).rejects.toThrowError('REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED');
        expect(replyRepository.getReply).rejects.toThrowError('REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    });
})