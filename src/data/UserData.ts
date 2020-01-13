export enum UserType {
    Owner,
    Contractor,
}

export class UserData {

    public name: string;
    public userType: UserType;

    constructor(name: string, userType: UserType) {
        this.name = name;
        this.userType = userType;
    }

}