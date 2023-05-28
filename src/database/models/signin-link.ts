import {
  HydratedDocument,
  Model,
  model,
  MongooseError,
  Schema,
  Types,
} from 'mongoose';
import uuid4 from 'uuid4';
import { log } from '../../utils/logger';

interface ISigninLink {
  token: string; // UUID4 unique
  user: Types.ObjectId;
  active: boolean;
}

interface SigninLinkModel extends Model<ISigninLink> {
  createWithUser(userId: Types.ObjectId): Promise<string | null>;

  validateToken(token: string): Promise<Types.ObjectId | null>;

  closeLink(userId: Types.ObjectId): Promise<boolean>;
}

const SigninLinkSchema = new Schema<ISigninLink, SigninLinkModel>({
  token: {
    type: String,
    required: true,
    unique: true,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  active: {
    type: Boolean,
    required: true,
    default: true,
  },
});

// STATICS

// CreateWithUser
SigninLinkSchema.static(
  'createWithUser',
  async function createWithUser(userId: Types.ObjectId) {
    const token = uuid4();
    try {
      const signinLink: HydratedDocument<ISigninLink> = await this.create({
        token,
        user: userId,
        active: true,
      });
      return signinLink.token;
    } catch (error) {
      const mongooseError = error as MongooseError;
      log(
        'database/models/signin-link',
        'createWithUser',
        mongooseError.message
      );
      return null;
    }
  }
);

// FindWithToken
SigninLinkSchema.static(
  'validateToken',
  async function validateToken(token: string) {
    try {
      const signinLink: HydratedDocument<ISigninLink> = await this.findOne({
        token,
      }).orFail();

      if (signinLink.active) {
        return signinLink.user;
      } else {
        return null;
      }
    } catch (error) {
      const mongooseError = error as MongooseError;
      log(
        'database/models/signin-link',
        'validateToken',
        mongooseError.message
      );
      return null;
    }
  }
);

// UpdateStatus
SigninLinkSchema.static(
  'closeLink',
  async function closeLink(userId: Types.ObjectId) {
    try {
      await this.findOneAndUpdate(
        { user: userId, active: true },
        { active: false },
        { new: true }
      ).orFail();
      return true;
    } catch (error) {
      const mongooseError = error as MongooseError;
      log('database/models/signin-link', 'closeLink', mongooseError.message);
      return false;
    }
  }
);

export const SigninLink = model<ISigninLink, SigninLinkModel>(
  'SigninLink',
  SigninLinkSchema
);
