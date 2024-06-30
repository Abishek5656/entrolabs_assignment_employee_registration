import { mergeResolvers } from "@graphql-tools/merge";

import employeeResolver from "./employee.resolvers.js";

const mergedResolvers = mergeResolvers([employeeResolver]);

export default mergedResolvers;
