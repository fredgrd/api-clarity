import {
  HydratedDocument,
  Model,
  MongooseError,
  Schema,
  Types,
  model,
} from 'mongoose';
import { hasher, verifyHash } from '../../utils/hasher';
import { log } from '../../utils/logger';

interface IUser {
  email: string;
  password: string;
  name: string;
  surname: string;
  gender: number;
  onboarding_step: OnboardingStep;
}

enum OnboardingStep {
  SetPassword = 'SetPassword',
  CompleteProfile = 'CompleteProfile',
  MyersBriggs = 'MyersBriggs',
  BookAppointment = 'BookAppointment',
  Complete = 'Complete',
}

interface IUserMethods {
  fullName(): string;
}

interface UserModel extends Model<IUser, {}, IUserMethods> {
  createWithCredentials(
    email: string,
    password: string
  ): Promise<HydratedDocument<IUser, IUserMethods> | null>;

  findWithCredentials(
    email: string,
    password: string
  ): Promise<HydratedDocument<IUser, IUserMethods> | null>;

  findWithId(
    userId: string | Types.ObjectId
  ): Promise<HydratedDocument<IUser, IUserMethods> | null>;
}

const UserSchema = new Schema<IUser, UserModel, IUserMethods>({
  email: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  name: {
    type: String,
  },
  surname: {
    type: String,
  },
  gender: {
    type: Number,
    enum: [0, 1],
    default: 0,
  },
  onboarding_step: {
    type: String,
    enum: OnboardingStep,
    default: OnboardingStep.CompleteProfile,
  },
});

// STATICS

// CreateWithCredentials
UserSchema.static(
  'createWithCredentials',
  async function createWithCredentials(email: string, password: string) {
    const hashed = await hasher(password);

    try {
      const user: HydratedDocument<IUser, IUserMethods> = await this.create({
        email,
        password: hashed,
      });
      return user;
    } catch (error) {
      const mongooseError = error as MongooseError;
      log(
        'database/models/user',
        'createWithCredentials',
        mongooseError.message
      );
      return null;
    }
  }
);

// FindWithCredentials
UserSchema.static(
  'findWithCredentials',
  async function findWithCredentials(email: string, password: string) {
    try {
      const user: HydratedDocument<IUser, IUserMethods> = await this.findOne({
        email,
      }).orFail();

      const passMatch = await verifyHash(password, user.password);

      if (passMatch) {
        return user;
      } else {
        return null;
      }
    } catch (error) {
      const mongooseError = error as MongooseError;
      log('database/models/user', 'findWithCredentials', mongooseError.message);
      return null;
    }
  }
);

// FindWithId
UserSchema.static(
  'findWithId',
  async function findWithId(userId: string | Types.ObjectId) {
    try {
      const user: HydratedDocument<IUser, IUserMethods> = await this.findById(
        userId
      ).orFail();
      return user;
    } catch (error) {
      const mongooseError = error as MongooseError;
      log('database/models/user', 'findWithId', mongooseError.message);
      return null;
    }
  }
);

export const User = model<IUser, UserModel>('User', UserSchema);
