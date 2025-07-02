export class SignUp {

    email:string | undefined
    username:string | undefined
    password:string | undefined
    bio:string | undefined

    constructor(
        email:string,
        username:string,
        password:string,
        bio:string 

    ){
        this.email=email
        this.username = username
        this.password =password
        this.bio = bio
    }

    toObject(){

        return {

            email:this.email,
            username: this.username,
            password:this.password,
            bio:this.bio
        }
    }
    
}
