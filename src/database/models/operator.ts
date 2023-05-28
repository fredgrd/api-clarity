import {
  HydratedDocument,
  Model,
  MongooseError,
  Schema,
  model,
} from 'mongoose';
import { hasher, verifyHash } from '../../utils/hasher';
import { log } from '../../utils/logger';

interface IOperator {
  email: string;
  password: string;
  name: string;
  surname: string;
  active: boolean;
}

interface IOperatorMethods {
  fullName(): string;
}

interface OperatorModel extends Model<IOperator, {}, IOperatorMethods> {
  findWithCredentials(
    email: string,
    password: string
  ): Promise<HydratedDocument<IOperator, IOperatorMethods> | null>;

  findWithId(
    userId: string
  ): Promise<HydratedDocument<IOperator, IOperatorMethods> | null>;
}

const OperatorSchema = new Schema<IOperator, OperatorModel, IOperatorMethods>({
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
});

// STATICS

// FindWithCredentials
OperatorSchema.static(
  'findWithCredentials',
  async function findWithCredentials(email: string, password: string) {
    try {
      const user: HydratedDocument<IOperator, IOperatorMethods> =
        await this.findOne({
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
OperatorSchema.static('findWithId', async function findWithId(userId: string) {
  try {
    const user: HydratedDocument<IOperator, IOperatorMethods> =
      await this.findById(userId).orFail();
    return user;
  } catch (error) {
    const mongooseError = error as MongooseError;
    log('database/models/user', 'findWithId', mongooseError.message);
    return null;
  }
});

export const User = model<IOperator, OperatorModel>('Operator', OperatorSchema);
