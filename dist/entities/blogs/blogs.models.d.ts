export declare class blogParamModel {
    blogId: string;
}
export declare class BanBlogModel {
    isBanned: boolean;
}
export declare class blogAndPostParamModel {
    blogId: string;
    postId: string;
}
export declare class blogAndUserParamModel {
    blogId: string;
    userId: string;
}
export declare class BlogViewModel {
    id: string;
    name: string;
    description: string;
    isMembership: boolean;
    websiteUrl: string;
    createdAt: string;
    constructor(id: string, name: string, description: string, isMembership: boolean, websiteUrl: string, createdAt: string);
}
export declare class BlogSAViewModel {
    id: string;
    name: string;
    description: string;
    isMembership: boolean;
    websiteUrl: string;
    createdAt: string;
    blogOwnerInfo: object;
    banInfo: object;
    constructor(id: string, name: string, description: string, isMembership: boolean, websiteUrl: string, createdAt: string, blogOwnerInfo: object, banInfo: object);
}
export declare class createBlogModel {
    name: string;
    description: string;
    websiteUrl: string;
}
export declare class updateBlogModel {
    name: string;
    description: string;
    websiteUrl: string;
}
