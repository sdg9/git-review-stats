// @flow
import _ from 'lodash';

import secrets from '../../../lib/secrets';

export const idToName = (id: string) => _.get(secrets, ['userMapping', id, 'name'], id);
