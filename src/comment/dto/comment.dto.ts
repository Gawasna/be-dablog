export class GetCommentDTO {
    id: number;
    post_id: number;
    user_id: number;
    content: string;
    created_at: Date;
    user: {
        id: number;
        username: string;
        avatar: string;
    }
}