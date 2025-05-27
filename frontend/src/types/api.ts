// probably should add some types here

export interface User {
    _id: string;
    name: string;
    email: string;
    token: string;
}

export interface PollOption {
    _id: string;
    text: string;
    votes: number;
}

export interface Poll {
    _id: string;
    title: string;
    description: string;
    creator: {
        _id: string;
        name: string;
    };
    options: PollOption[];
    endDate: string;
    isActive: boolean;
    voters: string[];
}

export interface ApiResponse<T> {
    data: T;
    message?: string;
}