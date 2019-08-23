import { objectType, subscriptionField } from 'nexus';
import { Post } from './Post';
import { User } from './User';

export const PostSubscriptionPayload = objectType({
  name: 'PostSubscriptionPayload',
  definition(t) {
    t.field('node', {
      type: Post,
      nullable: true,
    });
    t.list.string('updatedFields', { nullable: true });
  },
});

export const postCreatedSubscription = subscriptionField('postCreated', {
  type: PostSubscriptionPayload,
  subscribe: (root, args, context) => {
    return context.prisma.$subscribe.post({ mutation_in: 'CREATED' });
  },
  resolve: payload => {
    return payload;
  },
});

export const UserSubscriptionPayload = objectType({
  name: 'UserSubscriptionPayload',
  definition(t) {
    t.field('node', {
      type: User,
      nullable: true,
    });
    t.field('previousValues', {
      type: User,
      nullable: true,
    });
    t.list.string('updatedFields', { nullable: true });
  },
});

export const userUpdatedSubscription = subscriptionField('userUpdated', {
  type: UserSubscriptionPayload,
  subscribe: (root, args, context) => {
    return context.prisma.$subscribe.user({
      mutation_in: 'UPDATED',
      updatedFields_contains: 'name',
    });
  },
  resolve: payload => {
    return payload;
  },
});
