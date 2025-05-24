import { createAccessControl } from "better-auth/plugins/access";
import { defaultStatements, adminAc } from "better-auth/plugins/admin/access";

// Define all available permissions
const statement = {
  ...defaultStatements, // Include default permissions from Better-Auth
  course: ["create", "update", "delete", "view"],
  assignment: ["create", "update", "delete", "grade", "view"],
  student: ["view", "manage"],
  parent: ["view"],
} as const;

// Create access control instance
export const ac = createAccessControl(statement);

// Define admin roles (teacher, staff, dev)
export const teacher = ac.newRole({
  ...adminAc.statements, // Include admin permissions
  course: ["create", "update", "view"],
  assignment: ["create", "update", "grade", "view"],
  student: ["view", "manage"],
});

export const staff = ac.newRole({
  ...adminAc.statements, // Include admin permissions
  course: ["view"],
  assignment: ["view"],
  student: ["view"],
  parent: ["view"],
});

export const dev = ac.newRole({
  ...adminAc.statements, // Include admin permissions
  course: ["create", "update", "delete", "view"],
  assignment: ["create", "update", "delete", "grade", "view"],
  student: ["view", "manage"],
  parent: ["view"],
});

// Define regular roles (student, parent)
export const student = ac.newRole({
  course: ["view"],
  assignment: ["view"],
});

export const parent = ac.newRole({
  student: ["view"],
  assignment: ["view"],
});

// Export all roles for use in auth configuration
export const roles = {
  teacher,
  staff,
  dev,
  student,
  parent,
};