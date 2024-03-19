export interface IUser {
    username: string,
    email: string,
    password: string,
    account_type: string,
    id?: number
    email_conf?: boolean,
    is_active?: boolean
    created_at?: Date
    token?: string
}

export interface IPublicUser {
    username: string,
    email: string,
    account_type: string,
    id?: number
    email_conf?: boolean,
    is_active?: boolean
    created_at?: Date
    token?: string
}