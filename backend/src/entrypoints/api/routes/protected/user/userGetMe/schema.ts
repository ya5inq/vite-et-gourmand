import { PublicUserSchemaParser } from '@/entrypoints/api/serializers/user.serializer';

export const userGetMeSchema = {
  response: PublicUserSchemaParser,
};
