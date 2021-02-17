import { Password } from "./../services/password";
import mongoose from "mongoose";
// import { Password } from "../services/password";

/* An interface that describes the properties
    that are required to create a new user */
interface IUserAttrs {
    email: string;
    password: string;
}

/* An interface that describes the properties
    that a User Model has */
 interface IUserModel extends mongoose.Model<IUserDoc> {
  build(attrs: IUserAttrs): IUserDoc;
}

/* An interface that describes the properties
    that a User Document has */
interface IUserDoc extends mongoose.Document {
    email: string;
    password: string;
    // extra props here
    /*createdAt: Date;*/
}

const userSchema: any = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
}, {
    toJSON: {
        transform(doc: any, ret: any): any {
            ret.id = ret._id;
            delete ret._id;
            delete ret.password;
            delete ret.__v;
        }
    }
});

// userSchema.pre("save", async function(done) {
//     if(this.isModified("password")) {
//         const hashed = await Password.toHash(this.get("password"));
//         this.set("password", hashed);
//     }
//     done();
// });

let User: IUserModel;
userSchema.statics.build = (attrs: IUserAttrs) => {
    return new User(attrs);
};


User = mongoose.model<IUserDoc, IUserModel>("User", userSchema);

export { User };